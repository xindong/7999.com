<?php

include_once '../functions.inc.php';
include_once './IPLocation.inc.php';

exportTimeout(0);

$rip = array_key_exists('ip', $_GET) ? $_GET['ip'] : getClientRealIP();
$ipl = IPLocation::getInstance('./chunzhen.dat');
$loc = $ipl->getLocation($rip);
$loc = $loc['country'];

$mod = array_key_exists('mod', $_GET) ? $_GET['mod'] : '';
if ($mod == 'weather') {
	include_once '../weather/area-code.inc.php';
	$area = $city = null;
	$areas = array_keys($CC);
	for ($i = 0; $i < count($areas); $i++) {
		$area = $areas[$i];
		if (strpos($loc, $area) === 0) { // 符合
			if (is_array($CC[$area])) { // 还有市
				$cities = array_keys($CC[$area]);
				for ($j = 0; $j < count($cities); $j++) {
					$city = $cities[$j];
					if (strpos($loc, $city) !== false) { // 符合
						break;
					}
					$city = null; // 重置
				}
			}
			break;
		}
		$area = null; // 重置
	}
	// 探测返回格式
	$fmt = "xml";
	if (preg_match("/\.([^\.]+)$/", $_SERVER['SCRIPT_NAME'], $matches)) {
		switch ($matches[1]) {
			case 'js';
				$fmt = 'js';
				break;
			case 'yml';
			case 'yaml';
				$fmt = 'yml';
				break;
			case 'red';
			case 'php';
				$fmt = 'red';
				break;
		}
	}
	if ($area == null && ($rip == '127.0.0.1' || strpos($rip, '192.168.1.') === 0)) {
		$area = '上海';
	}
    if ($area == null) {
    	setcookie('L', 'unknow', time() + (3600 * 6), '/');
		exit;
	}
	switch ($fmt) {
		case 'red':
			if ($city == null) $location = "$area";
			else $location = "$area/$city";
			$encoded = crc32($location);
			setcookie('L', $encoded, time() + (3600 * 24), '/');
			header("Location: /api/weather/details/$encoded.js");
			exit;
		case 'js':
			header('Content-type: application/x-javascript; charset=gb2312');
			break;
		case 'yml':
			header('Content-type: text/plain; charset=utf-8');
			break;
		case 'xml':
			header('Content-type: text/xml; charset=utf-8');
			break;
	}
}

