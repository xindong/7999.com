<?php
if( !function_exists('ftok') )
{
    function ftok($filename = "", $proj = "")
    {
        if( empty($filename) || !file_exists($filename) )
        {
            return -1;
        }
        else
        {
            $filename = $filename . (string) $proj;
            for($key = array(); sizeof($key) < strlen($filename); $key[] = ord(substr($filename, sizeof($key), 1)));
            return array_sum($key);
        }
    }
}

/**
* IP 地理位置查询类
*
* @author 马秉尧
* @version 2.5
* @copyright 2005 CoolCode.CN
*/
if (function_exists('shmop_open')) {
    class IPLocation {
        /**
         * 共享内存编号
         *
         * @var int
         */
        var $shm_id;
        /**
         * 第一条IP记录的偏移地址
         *
         * @var int
         */
        var $firstip;

        /**
         * 最后一条IP记录的偏移地址
         *
         * @var int
         */
        var $lastip;

        /**
         * IP记录的总条数（不包含版本信息记录）
         *
         * @var int
         */
        var $totalip;

        /**
         * 当前共享内存位置指针
         *
         * @var int
         */
        var $pos;

        /**
         * 返回读取的长整型数
         *
         * @access private
         * @return int
         */
        function getLong() {
            //将读取的little-endian编码的4个字节转化为长整型数
            $result = unpack('Vlong', shmop_read($this->shm_id, $this->pos, 4));
            $this->pos += 4;
            return $result['long'];
        }

        /**
         * 返回读取的3个字节的长整型数
         *
         * @access private
         * @return int
         */
        function getLong3() {
            //将读取的little-endian编码的3个字节转化为长整型数
            $result = unpack('Vlong', shmop_read($this->shm_id, $this->pos, 3).chr(0));
            $this->pos += 3;
            return $result['long'];
        }

        /**
         * 返回压缩后可进行比较的IP地址
         *
         * @access private
         * @param string $ip
         * @return string
         */
        function packIp($ip) {
            // 将IP地址转化为长整型数，如果在PHP5中，IP地址错误，则返回False，

            // 这时intval将Flase转化为整数-1，之后压缩成big-endian编码的字符串

            return pack('N', intval(ip2long($ip)));
        }

        /**
         * 返回读取的字符串
         *
         * @access private
         * @param string $data
         * @return string
         */
        function getString($data = "") {
            $char = shmop_read($this->shm_id, $this->pos++, 1);
            while (ord($char) > 0) {        // 字符串按照C格式保存，以\0结束
                $data .= $char;             // 将读取的字符连接到给定字符串之后
                $char = shmop_read($this->shm_id, $this->pos++, 1);
            }
            return $data;
        }

        /**
         * 返回地区信息
         *
         * @access private
         * @return string
         */
        function getArea() {
            $byte = shmop_read($this->shm_id, $this->pos++, 1); // 标志字节
            switch (ord($byte)) {
                case 0:                     // 没有区域信息
                $area = "";
                break;
                case 1:
                case 2:                     // 标志字节为1或2，表示区域信息被重定向
                $this->pos = $this->getLong3($this->pos);
                $area = $this->getString();
                break;
                default:                    // 否则，表示区域信息没有被重定向

                $area = $this->getString($byte);
                break;
            }
            return $area;
        }

        /**
         * 根据所给 IP 地址或域名返回所在地区信息
         *
         * @access public
         * @param string $ip
         * @return array
         */
        function getLocation($ip) {
            if (!$this->shm_id) return null;    // 如果共享内存没有被正确打开，则直接返回空
            $location['ip'] = gethostbyname($ip);   // 将输入的域名转化为IP地址
            $ip = $this->packIp($location['ip']);   // 将输入的IP地址转化为可比较的IP地址
            // 不合法的IP地址会被转化为255.255.255.255
            // 对分搜索
            $l = 0;                             // 搜索的下边界
            $u = $this->totalip;                // 搜索的上边界
            $findip = $this->lastip;            // 如果没有找到就返回最后一条IP记录（QQWry.Dat的版本信息）
            while ($l <= $u) {                  // 当上边界小于下边界时，查找失败
                $i = floor(($l + $u) / 2);      // 计算近似中间记录
                $this->pos = $this->firstip + $i * 7;
                $beginip = strrev(shmop_read($this->shm_id, $this->pos, 4));
                // 获取中间记录的开始IP地址
                // strrev函数在这里的作用是将little-endian的压缩IP地址转化为big-endian的格式
                // 以便用于比较，后面相同。
                if ($ip < $beginip) {       // 用户的IP小于中间记录的开始IP地址时
                    $u = $i - 1;            // 将搜索的上边界修改为中间记录减一
                }
                else {
                    $this->pos += 4;
                    $this->pos = $this->getLong3();
                    $endip = strrev(shmop_read($this->shm_id, $this->pos, 4));  // 获取中间记录的结束IP地址
                    if ($ip > $endip) {     // 用户的IP大于中间记录的结束IP地址时
                        $l = $i + 1;        // 将搜索的下边界修改为中间记录加一
                    }
                    else {                  // 用户的IP在中间记录的IP范围内时

                        $findip = $this->firstip + $i * 7;

                        break;              // 则表示找到结果，退出循环
                    }
                }
            }

            //获取查找到的IP地理位置信息
            $this->pos = $findip;
            $location['beginip'] = long2ip($this->getLong());   // 用户IP所在范围的开始地址
            $this->pos = $offset = $this->getLong3();
            $location['endip'] = long2ip($this->getLong());     // 用户IP所在范围的结束地址
            $byte = shmop_read($this->shm_id, $this->pos++, 1); // 标志字节
            switch (ord($byte)) {
                case 1:                     // 标志字节为1，表示国家和区域信息都被同时重定向
                $this->pos = $countryOffset = $this->getLong3();           // 重定向地址
                $byte = shmop_read($this->shm_id, $this->pos++, 1);        // 标志字节
                switch (ord($byte)) {
                    case 2:             // 标志字节为2，表示国家信息又被重定向
                    $this->pos = $this->getLong3();
                    $location['country'] = $this->getString();
                    $this->pos = $countryOffset + 4;
                    $location['area'] = $this->getArea();
                    break;
                    default:            // 否则，表示国家信息没有被重定向

                    $location['country'] = $this->getString($byte);
                    $location['area'] = $this->getArea();
                    break;
                }
                break;
                case 2:                     // 标志字节为2，表示国家信息被重定向
                $this->pos = $this->getLong3();
                $location['country'] = $this->getString();
                $this->pos = $offset + 8;
                $location['area'] = $this->getArea();
                break;
                default:                    // 否则，表示国家信息没有被重定向

                $location['country'] = $this->getString($byte);
                $location['area'] = $this->getArea();
                break;
            }
            if ($location['country'] == " CZ88.NET") {  //  CZ88.NET表示没有有效信息
                $location['country'] = "未知";
            }
            if ($location['area'] == " CZ88.NET") {
                $location['area'] = "";
            }
            return $location;
        }

        /**
         * 构造函数
         *
         * @param string $filename
         * @return IPLocation
         */
        function IPLocation($filename) {

            $shm_key = ftok($filename, 'R');
            if (!($this->shm_id = shmop_open($shm_key, "a", 0, 0))) {  // 如果没有建立共享内存块
                $content = file_get_contents($filename);                // 则读取文件内容
                $this->shm_id = shmop_open($shm_key, "c", 0644, strlen($content));
                shmop_write($this->shm_id, $content, 0);                // 并将其写入新建的共享内存块
            }
            $this->pos = 0;
            $this->firstip = $this->getLong();
            $this->lastip = $this->getLong();
            $this->totalip = ($this->lastip - $this->firstip) / 7;
            //注册析构函数，使其在程序执行结束时执行
            register_shutdown_function(array(&$this, '_IPLocation'));
        }

        /**
         * 析构函数，用于在页面执行结束后自动关闭打开的文件。
         *
         */
        function _IPLocation() {
            shmop_close($this->shm_id);
        }

        /**
         * 本类为一个 Singleton 类，必须用下面的函数来返回实例
         *
         * @param string $filename
         * @return IPLocation
         */
        function &getInstance($filename = "QQWry.Dat") {
            static $instance = null;
            if (is_null($instance)) {
                $instance = new IPLocation($filename);
            }
            return $instance;
        }
    }

} else {

    class IPLocation {
        /**
         * QQWry.Dat文件指针
         *
         * @var resource
         */
        var $fp;

        /**
         * 第一条IP记录的偏移地址
         *
         * @var int
         */
        var $firstip;

        /**
         * 最后一条IP记录的偏移地址
         *
         * @var int
         */
        var $lastip;

        /**
         * IP记录的总条数（不包含版本信息记录）
         *
         * @var int
         */
        var $totalip;

        /**
         * 返回读取的长整型数
         *
         * @access private
         * @return int
         */
        function getLong() {
            //将读取的little-endian编码的4个字节转化为长整型数
            $result = unpack('Vlong', fread($this->fp, 4));
            return $result['long'];
        }

        /**
     * 返回读取的3个字节的长整型数
     *
     * @access private
     * @return int
     */
        function getLong3() {
            //将读取的little-endian编码的3个字节转化为长整型数
            $result = unpack('Vlong', fread($this->fp, 3).chr(0));
            return $result['long'];
        }

        /**
         * 返回压缩后可进行比较的IP地址
         *
         * @access private
         * @param string $ip
         * @return string
         */
        function packIp($ip) {
            // 将IP地址转化为长整型数，如果在PHP5中，IP地址错误，则返回False，

            // 这时intval将Flase转化为整数-1，之后压缩成big-endian编码的字符串

            return pack('N', intval(ip2long($ip)));
        }

        /**
         * 返回读取的字符串
         *
         * @access private
         * @param string $data
         * @return string
         */
        function getString($data = "") {
            $char = fread($this->fp, 1);
            while (ord($char) > 0) {        // 字符串按照C格式保存，以\0结束
                $data .= $char;             // 将读取的字符连接到给定字符串之后
                $char = fread($this->fp, 1);
            }
            return $data;
        }

        /**
         * 返回地区信息
         *
         * @access private
         * @return string
         */
        function getArea() {
            $byte = fread($this->fp, 1);    // 标志字节
            switch (ord($byte)) {
                case 0:                     // 没有区域信息
                $area = "";
                break;
                case 1:
                case 2:                     // 标志字节为1或2，表示区域信息被重定向
                fseek($this->fp, $this->getLong3());
                $area = $this->getString();
                break;
                default:                    // 否则，表示区域信息没有被重定向

                $area = $this->getString($byte);
                break;
            }
            return $area;
        }

        /**
         * 根据所给 IP 地址或域名返回所在地区信息
         *
         * @access public
         * @param string $ip
         * @return array
         */
        function getLocation($ip) {
            if (!$this->fp) return null;            // 如果数据文件没有被正确打开，则直接返回空
            $location['ip'] = gethostbyname($ip);   // 将输入的域名转化为IP地址
            $ip = $this->packIp($location['ip']);   // 将输入的IP地址转化为可比较的IP地址
            // 不合法的IP地址会被转化为255.255.255.255
            // 对分搜索
            $l = 0;                         // 搜索的下边界
            $u = $this->totalip;            // 搜索的上边界
            $findip = $this->lastip;        // 如果没有找到就返回最后一条IP记录（QQWry.Dat的版本信息）
            while ($l <= $u) {              // 当上边界小于下边界时，查找失败

                $i = floor(($l + $u) / 2);  // 计算近似中间记录
                fseek($this->fp, $this->firstip + $i * 7);
                $beginip = strrev(fread($this->fp, 4));     // 获取中间记录的开始IP地址
                // strrev函数在这里的作用是将little-endian的压缩IP地址转化为big-endian的格式
                // 以便用于比较，后面相同。
                if ($ip < $beginip) {       // 用户的IP小于中间记录的开始IP地址时
                    $u = $i - 1;            // 将搜索的上边界修改为中间记录减一
                }
                else {
                    fseek($this->fp, $this->getLong3());
                    $endip = strrev(fread($this->fp, 4));   // 获取中间记录的结束IP地址
                    if ($ip > $endip) {     // 用户的IP大于中间记录的结束IP地址时
                        $l = $i + 1;        // 将搜索的下边界修改为中间记录加一
                    }
                    else {                  // 用户的IP在中间记录的IP范围内时

                        $findip = $this->firstip + $i * 7;
                        break;              // 则表示找到结果，退出循环
                    }
                }
            }

            //获取查找到的IP地理位置信息
            fseek($this->fp, $findip);
            $location['beginip'] = long2ip($this->getLong());   // 用户IP所在范围的开始地址
            $offset = $this->getLong3();
            fseek($this->fp, $offset);
            $location['endip'] = long2ip($this->getLong());     // 用户IP所在范围的结束地址
            $byte = fread($this->fp, 1);    // 标志字节
            switch (ord($byte)) {
                case 1:                     // 标志字节为1，表示国家和区域信息都被同时重定向
                $countryOffset = $this->getLong3();         // 重定向地址
                fseek($this->fp, $countryOffset);
                $byte = fread($this->fp, 1);    // 标志字节
                switch (ord($byte)) {
                    case 2:             // 标志字节为2，表示国家信息又被重定向
                    fseek($this->fp, $this->getLong3());
                    $location['country'] = $this->getString();
                    fseek($this->fp, $countryOffset + 4);
                    $location['area'] = $this->getArea();
                    break;
                    default:            // 否则，表示国家信息没有被重定向
                    $location['country'] = $this->getString($byte);
                    $location['area'] = $this->getArea();
                    break;
                }
                break;
                case 2:                     // 标志字节为2，表示国家信息被重定向
                fseek($this->fp, $this->getLong3());
                $location['country'] = $this->getString();
                fseek($this->fp, $offset + 8);
                $location['area'] = $this->getArea();
                break;
                default:                    // 否则，表示国家信息没有被重定向

                $location['country'] = $this->getString($byte);
                $location['area'] = $this->getArea();
                break;
            }
            if ($location['country'] == " CZ88.NET") {  // CZ88.NET表示没有有效信息
                $location['country'] = "unknow";
            }
            if ($location['area'] == " CZ88.NET") {
                $location['area'] = "";
            }
            return $location;
        }

        /**
         * 构造函数，打开 QQWry.Dat 文件并初始化类中的信息
         *
         * @param string $filename
         * @return IPLocation
         */
        function IPLocation($filename = "QQWry.Dat") {
            $this->fp = 0;
            if (($this->fp = @fopen($filename, 'rb')) !== false) {
                $this->firstip = $this->getLong();
                $this->lastip = $this->getLong();
                $this->totalip = ($this->lastip - $this->firstip) / 7;
                //注册析构函数，使其在程序执行结束时执行
                register_shutdown_function(array(&$this, '_IPLocation'));
            }
        }

        /**
         * 析构函数，用于在页面执行结束后自动关闭打开的文件。
         *
         */
        function _IPLocation() {
            if ($this->fp) {
                fclose($this->fp);
            }
            $this->fp = 0;
        }
        
        /**
         * 本类为一个 Singleton 类，必须用下面的函数来返回实例
         *
         * @param string $filename
         * @return IPLocation
         */
        function &getInstance($filename = "QQWry.Dat") {
            static $instance = null;
            if (is_null($instance)) {
                $instance = new IPLocation($filename);
            }
            return $instance;
        }
    }
}
/*
$a = IPLocation::getInstance();
$b = $a->getLocation('127.0.0.1');
var_dump($b);
*/