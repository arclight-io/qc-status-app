<?php
define("IN_SITE",true);
define('SITE_ROOT', substr(dirname(__FILE__), 0, -3));
require_once SITE_ROOT."lib/main_conf.php";
require_once SITE_ROOT."lib/libdb.php";
require_once SITE_ROOT."lib/tiezi-vendor.php";
require_once SITE_ROOT."lib/uc_conf.php";
require_once SITE_ROOT."uc_client/client.php";

if(!isset($_REQUEST["domain"]) || !isset($_REQUEST["tid"])){
	die('{"code":-404}');
}

tieziVendor::heapingTiezi($_REQUEST["domain"],"note/".$_REQUEST["tid"]);

$tiezic = tieziVendor::getNewestTiezi(1,0,"(domain='".$_REQUEST["domain"]."' AND tid=".$_REQUEST["tid"].")");

if(count($tiezic) <= 0){
	die('{"code":-404}');
}
die(json_encode(array("code"=>200,"tiezi"=>$tiezic[0])));
?>