<?php

session_start();

if (!array_key_exists('h', $_SESSION) || !is_array($_SESSION['h'])) {
	$_SESSION['h'] = array();
}

if (array_key_exists('url', $_GET) && array_key_exists('txt', $_GET)) {
	$url = urldecode($_GET['url']);
	$txt = urldecode($_GET['txt']);
	foreach($_SESSION['h'] as $key => $row) {
		if ($row['t'] == $txt || $row['u'] == $url) {
			unset($_SESSION['h'][$key]);
			break;
		}
	}
	array_unshift($_SESSION['h'], array('t' => $txt, 'u' => $url));
}

echo json_encode($_SESSION['h']);
