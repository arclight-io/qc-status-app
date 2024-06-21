<?php
define("IN_SITE",true);
define('SITE_ROOT', substr(dirname(__FILE__), 0, -3));
require_once SITE_ROOT."config/main_conf.php";
require_once SITE_ROOT."lib/tiezi-vendor.php";

foreach($_G["Federation"]["Pairs"] as $i){
	tieziVendor::heapingTiezi($i);
}
?>