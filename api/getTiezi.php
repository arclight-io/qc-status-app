<?php
define("IN_SITE",true);
define('SITE_ROOT', substr(dirname(__FILE__), 0, -3));
require_once SITE_ROOT."lib/main_conf.php";
require_once SITE_ROOT."lib/libdb.php";
require_once SITE_ROOT."lib/tiezi-vendor.php";
require_once SITE_ROOT."lib/uc_conf.php";
require_once SITE_ROOT."uc_client/client.php";

$mod = isset($_GET["mod"])?$_GET["mod"]:"global";
$page = (int)(isset($_GET["page"])?$_GET["page"]:"0");

if(!in_array($mod,array("local","global","subtalk"))){
	die('{"code":-404,"tiezi":[]}');
}

$tiezi = array();
$tiezic = array();

if($mod == "local"){
	$tiezic = tieziVendor::getLocalNewestTiezi(32,$page*32);
}if($mod == "subtalk" && isset($_GET["tid"]) && preg_match("/[1-9][0-9]*/",$_GET["tid"]) && isset($_GET["domain"])){
	$tiezic = tieziVendor::getNewestTiezi(32,$page*32,"(parent_tid=".$_GET["tid"]." AND parent_domain='".addslashes($_GET["domain"])."')");
}else{
	$tiezic = tieziVendor::getNewestTiezi(32,$page*32);
}

foreach($tiezic as $i){
	$tiezi[$i["domain"]."$".$i["tid"]] = $i;
}

die(json_encode(array("code"=>200,"tiezi"=>$tiezi)));
?>