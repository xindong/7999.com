<?php

if (array_key_exists('REMOTE_ADDR', $_SERVER)) {
	die("This script is command ONLY");
}

include_once './area-code.inc.php';

$dir = dirname(__FILE__);
chdir($dir);

$ids = array();
detectIds($CC);

foreach ($ids as $id) {
	if ($id == null) {
		continue;
	}
	$area = getLocation($id);
	if ($area == null) {
		continue;
	}
	$file = "./details/" . base64_encode($area) . ".js";
	$root = "http://www.cma.gov.cn/tqyb/weatherdetail/$id.html";
	verbose("正在获取 $root ... ");
	$html = file_get_contents($root);
	if (!$html) {
		verbose("失败\n");
	}
	$info = parseWeatherHTML($html, $file);
	if (!$info) {
		verbose("返回格式无效\n");
		continue;
	}
	verbose("OK\n");
	writeJSInfo($file, $info);
}


function detectIds($arr) {
	global $ids;
	foreach ($arr as $area => $code) {
		if (is_array($code)) {
			detectIds($code);
		} else {
			$ids[] = $code;
		}
	}
}

function getLocation($id) {
	global $CC;
	foreach ($CC as $area => $ac) {
		if (is_array($ac)) {
			foreach ($ac as $city => $cc) {
				if ($cc == $id) {
					return "$area.$id";
				}
			}
		} else {
			if ($ac == $id ) {
				return "$area.";
			}
		}
	}
	return null;
}

function parseWeatherRow($buf, &$off) {	
	$ret = array();	
	if (!($pos1 = strpos($buf, '<tr', $off)))
		return false;
	$pos3 = 0;
	while ($pos2 = strpos($buf, '<td', $pos1)) {
		if ($pos3 && $pos2 > $pos3) break;
		$pos1 = strpos($buf, '>', $pos2) + 1;
		$pos2 = strpos($buf, '<table', $pos1);
		if (!$pos2 || ($pos2 - $pos1) > 20) {
			$pos2 = strpos($buf, '</td', $pos1);
			$ret[] = trim(strip_tags(substr($buf, $pos1, $pos2 - $pos1)));
		} else {
			$pos2 = strpos($buf, '</table', $pos1);
			$str2 = substr($buf, $pos1, $pos2 - $pos1);
			$imgs = array();
			$p2 = 0;
			while ($p1 = strpos($str2, '/img/weather/', $p2)) {
				$p1 += 13;
				$p2  = strpos($str2, '"', $p1);
				$imgs[] = substr($str2, $p1, $p2 - $p1);
			}
			if (!isset($imgs[1]))
				$imgs[1] = '';
			if ($p1 = strpos($str2, '<', $p2))
				$desc = trim(strip_tags(substr($str2, $p1)));			
			else
				$desc = '';
			$ret[] = $imgs[0] . '|' . $imgs[1] . '|' . $desc;
		}
		if (!($pos3 = strpos($buf, '</tr', $pos2)))	{
			$pos3 = $pos2;
			break;
		}
		$pos1 = $pos2;
	}
	$off = $pos3;
	if (count($ret) == 0)
		$ret = false;
	return $ret;		
}

function parseWeatherHTML($html, $file) {
	if (!$html) {
		touch($file);
		return false;
	}
	if (!($pos1 = strpos($html, '3天预报'))) {
		touch($file);
		return false;
	}
	$pos1 += 25;
	$pos2  = strpos($html, '<', $pos1);
	if ($pos2 == $pos1) {
		touch($file);
		return false; // not-found
	}
	// get city
	$ret = array();
	$ret['city']  = trim(substr($html, $pos1, $pos2 - $pos1));

	// get the data
	$pos1 = strpos($html, '<table', $pos2);
	$pos2 = strpos($html, '<div id="main2">', $pos1);
	$str = substr($html, $pos1, $pos2 - $pos1);
	$str = preg_replace('/<!\-\-.+?\-\->/s', '', $str);

	// parse every row
	$weather = array();
	$off = $cnt = 0;
	if (!($date = parseWeatherRow($str, $off)) || strcmp($date[0], '时间')) {
		touch($file);
		return false;
	}
	$cnt = count($date);
	for ($i = 1; $i < $cnt; $i++)
		$weather[] = array('date' => $date[$i]);

	// other types
	$types = array('天气概况' => 'base', '气 温' => 'temp', '风向/风力' => 'wind');
	while ($row = parseWeatherRow($str, $off)) {
		if (!isset($types[$row[0]])) continue;
		$type = $types[$row[0]];
		for ($i = 1; $i < $cnt; $i++) {
			$j = $i - 1;
			if ($type == 'temp') {
				$tmp = explode('/', $row[$i]);
				$weather[$j]['temp0'] = str_replace(" ", "", trim($tmp[0]));
				$weather[$j]['temp1'] = str_replace(" ", "", trim($tmp[1]));
			} else if ($type == 'base') {
				$tmp = explode('|', $row[$i]);
				$weather[$j]['img0'] = intval($tmp[0]);
				$weather[$j]['img1'] = intval($tmp[1]);
				$weather[$j]['desc'] = trim($tmp[2]);
			}
			else {
				$weather[$j][$type] = $row[$i];
			}
		}
	}
	$ret['weather'] = $weather;
	return $ret;
}

function writeJSInfo($file, $info) {
	$weather = '';
	foreach ($info['weather'] as $w) {
		$weather .= "{ date: '${w['date']}', desc: '${w['desc']}', wind: '${w['wind']}', temp: ['${w['temp0']}', '${w['temp1']}'], img: [${w['img0']}, ${w['img1']}] }, ";
	}
	$weather = substr($weather, 0, -2);
	$js = "fetchWeatherRPCDone('${info['city']}', [$weather])";
	if ($fd = @fopen($file, 'w')) {
		fwrite($fd, $js);
		fclose($fd);
	}
}

function verbose($msg) {
	if (array_key_exists('REMOTE_ADDR', $_SERVER)) {
		return;
	}
	$msg = iconv("gb2312", "utf-8", $msg);
	print($msg);
}

