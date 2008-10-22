<?php

session_start();

if (!array_key_exists('h', $_SESSION) || !is_array($_SESSION['h'])) {
	$_SESSION['h'] = array();
}

if (array_key_exists('action', $_POST) && $_POST['action'] == 'empty') {
	$_SESSION['h'] = array();
} elseif (array_key_exists('url', $_POST) && array_key_exists('txt', $_POST)) {
	$url = urldecode($_POST['url']);
	$txt = urldecode($_POST['txt']);
	foreach($_SESSION['h'] as $key => $row) {
		if ($row['t'] == $txt || $row['u'] == $url) {
			unset($_SESSION['h'][$key]);
			break;
		}
	}
	$_SESSION['h'] = array_slice($_SESSION['h'], 0, 53);
	array_unshift($_SESSION['h'], array('t' => $txt, 'u' => $url));
}

header('Content-type: application/x-javascript');
echo json_encode($_SESSION['h']);
