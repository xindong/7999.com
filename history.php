<?php

$ignore_preg = array(
	"/7999\.com\/#$/i"
);

include_once './api/functions.inc.php';

$expires = 3600 * 24 * 365;
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
		$_SESSION['h'] = array_slice($_SESSION['h'], 0, 53);
		array_unshift($_SESSION['h'], array('t' => $txt, 'u' => $url));	
	}
}

header('Content-type: text/plain');
echo json_encode($_SESSION['h']);
