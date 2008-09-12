<?php

include_once './api/functions.inc.php';

$from = trim($_SERVER['PATH_INFO']);
$from = substr($from, 1);

exportTimeout(1, 'd'); // »º´æ1Ìì

$arrs = array('dt', 'fg');

if (in_array($from, $arrs)) {
	setcookie('D', $from, time() + 10, '/');
}

header('Location: /');
