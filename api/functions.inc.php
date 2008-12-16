<?php

/**
 * 得到用户真实IP
 * 注意我们的 Squid 和 HAProxy 都需要设置 HTTP_X_FORWARDED_FOR
 *
 * @return string
 */
function getClientRealIP() {
	if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && $_SERVER['HTTP_X_FORWARDED_FOR']) {
    	$realip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	} elseif (isset($_SERVER['HTTP_CLIENT_IP']) && $_SERVER['HTTP_CLIENT_IP']) {
        $realip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR']) {
        $realip = $_SERVER['REMOTE_ADDR'];
    } else {
    	$realip = null;
    }
    if (strpos($realip, ",")) {
        $realips = explode(",", $realip);
        return trim($realips[0]);
    }
    return $realip;
}

function exportTimeout($time, $unit = 's') {
    $unit = strtolower($unit);
	switch ($unit) {
		case 'w':
	        $time *= 7;
		case 'd':
	        $time *= 24;
	    case 'h':
	        $time *= 60;
	    case 'm':
    	    $time *= 60;
	    default:
	}
    header("Expires: ".gmdate("D, d M Y H:i:s", time() + $time)." GMT");
    header("Last-Modified: ".gmdate("D, d M Y H:i:s", time())." GMT");
    if ($time == 0) {
        header("Cache-Control: private");
    } else {
        header("Cache-Control: public, max-age=$time");
        header("Pragma: Pragma");
    }
}
