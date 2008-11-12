<?php

$ignore_preg = array(
	"/7999\.com\/#$/i"
);
$secret_token = 'yw28ZtMQ&ub.\}CvIB2X_-qMsX1SZg[aRY8b/z-Q}1KsF-KE/&Yx2r7TbRqw4nm5[6Q}D,D.z}ppJcHxz*7C{4Et*S/W)';
$expires = 3600 * 24 * 365;
$items_limit = 53

include_once './api/functions.inc.php';

if (array_key_exists('v', $_REQUEST) && $_REQUEST['v'] == '2') {
	setcookie('PHPSESSID', '', time() - 3600);
	
	$cookie = array();
	
	while (array_key_exists('H', $_COOKIE)) {
		$sig = substr($_COOKIE['H'], -40, 40);
		$zip = substr($_COOKIE['H'], 0, -40);
		if (!$sig || !$zip) {
			break;
		}
		$base = base64_decode($zip);
		$json = gzuncompress($base);
		if (sha1($zip.$secret_token) != $sig) {
			break;
		}
		$cookie = json_decode($json, true);
		break;
	}
	
	header('Content-type: text/plain');
	
	if (array_key_exists('action', $_REQUEST) && $_REQUEST['action'] == 'empty') {
		$cookie = array();
		setcookie('H', '', time() - 3600);
	}
	if (array_key_exists('url', $_REQUEST) && array_key_exists('txt', $_REQUEST)) {
		$url = urldecode($_REQUEST['url']);
		$txt = urldecode($_REQUEST['txt']);
		$ign = false;
		foreach ($ignore_preg as $preg) {
			if (preg_match($preg, $url)) {
				$ign = true;
				break;
			}
		}
		if (!$ign) {
			foreach($cookie as $key => $row) {
				if ($row['t'] == $txt || $row['u'] == $url) {
					unset($cookie[$key]);
					break;
				}
			}
			$cookie = array_slice($cookie, 0, $items_limit);
			array_unshift($cookie, array('t' => $txt, 'u' => $url));	
		}
	}
	
	$data = json_encode($cookie);
	$data = gzcompress($data, 9);
	$data = base64_encode($data);
	$data .= sha1($data.$secret_token);
	
	setcookie('H', $data, time() + $expires, '/');
	
	header('Content-type: text/plain');
	echo json_encode($cookie);

} else {
	ini_set('session.save_handler', 'memcache');
	ini_set('session.save_path', 'tcp://localhost:11211?persistent=0&weight=1&timeout=1&retry_interval=3');
	//ini_set('session.gc_maxlifetime', $expires);
	session_set_cookie_params($expires, '/');
	session_cache_limiter('private');
	session_cache_expire($expires / 60);
	session_start();
	exportTimeout(0);
	
	if (!array_key_exists('h', $_SESSION) || !is_array($_SESSION['h'])) {
		$_SESSION['h'] = array();
	}
	if (array_key_exists('action', $_REQUEST) && $_REQUEST['action'] == 'empty') {
		$_SESSION['h'] = array();
	} elseif (array_key_exists('url', $_REQUEST) && array_key_exists('txt', $_REQUEST)) {
		$url = urldecode($_REQUEST['url']);
		$txt = urldecode($_REQUEST['txt']);
		$ign = false;
		foreach ($ignore_preg as $preg) {
			if (preg_match($preg, $url)) {
				$ign = true;
				break;
			}
		}
		if (!$ign) {
			foreach($_SESSION['h'] as $key => $row) {
				if ($row['t'] == $txt || $row['u'] == $url) {
					unset($_SESSION['h'][$key]);
					break;
				}
			}
			$_SESSION['h'] = array_slice($_SESSION['h'], 0, $items_limit);
			array_unshift($_SESSION['h'], array('t' => $txt, 'u' => $url));	
		}
	}
	
	header('Content-type: text/plain');
	echo json_encode($_SESSION['h']);
}
