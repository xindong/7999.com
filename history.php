<?php

$ignore_preg = array(
	"/7999\.com\/#$/i"
);

include_once './api/functions.inc.php';

ini_set('session.save_handler', 'memcache');
ini_set('session.save_path', 'tcp://localhost:11211?persistent=0&weight=1&timeout=1&retry_interval=3');

exportTimeout(0);

session_set_cookie_params(3600 * 24 * 365, '/');
session_start();

if (!array_key_exists('h', $_SESSION) || !is_array($_SESSION['h'])) {
	$_SESSION['h'] = array();
}

if (array_key_exists('action', $_POST) && $_POST['action'] == 'empty') {
	$_SESSION['h'] = array();
} elseif (array_key_exists('url', $_POST) && array_key_exists('txt', $_POST)) {
	$url = urldecode($_POST['url']);
	$txt = urldecode($_POST['txt']);
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
