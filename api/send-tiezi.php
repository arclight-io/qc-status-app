<?php
define("IN_SITE",true);
define('SITE_ROOT', substr(dirname(__FILE__), 0, -3));
require_once SITE_ROOT."lib/main_conf.php";
require_once SITE_ROOT."lib/libdb.php";
require_once SITE_ROOT."lib/tiezi-vendor.php";
require_once SITE_ROOT."lib/uc_conf.php";
require_once SITE_ROOT."uc_client/client.php";
require_once SITE_ROOT."lib/account.php";

if(!isset($_REQUEST["content"])){
	die('{"code":-403}');
}
if($_G["Cache"]["Auth"]["uid"] <= 0){
	die('{"code":-403}');
}

$parent = isset($_REQUEST["parent"])?(int)($_REQUEST["parent"]):0;
$parentdomain = isset($_REQUEST["parent_domain"])?(int)($_REQUEST["parent_domain"]):"";

if($parentdomain == ""){
	$parent = 0;
}
if($parent == 0){
	$parentdomain = "";
}

$contentarr = array("type"=>"note","cw"=>null,"content"=>array(array("type"=>"text","content"=>$_REQUEST["content"])));

if(tieziVendor::sendTiezi($_G["Cache"]["Auth"]["uid"],$contentarr,$parentdomain,$parent)){
	die('{"code":200}');
}else{
	die('{"code":-200}');
}
?>