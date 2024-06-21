<?php
$_SERVER["USER_AGENT"] = "syser";
define("IN_SITE",true);
define('SITE_ROOT', substr(dirname(__FILE__), 0, -3));
require_once SITE_ROOT."lib/main_conf.php";
require_once SITE_ROOT."lib/libdb.php";
require_once SITE_ROOT."lib/tiezi-vendor.php";
require_once SITE_ROOT."lib/uc_conf.php";
require_once SITE_ROOT."uc_client/client.php";

if(!isset($_GET["mod"])){
	die('{"code":404}');
}

if($_SERVER['HTTP_HOST'] != $_G["Site"]["SiteDomain"] && !isset($_GET["cliental"])){
	die('{"code":404}');
}

$mod = $_GET["mod"];

if($mod == "user"){
	$uid = $_GET["uid"];
	if(!preg_match("/[0-9]+/",$_GET["uid"])){
		die('{"code":404}');
	}
	if($data = uc_get_user($_GET["uid"],1)) {
		list($uid, $username, $email) = $data;
	} else {
		die('{"code":404}');
	}
	$cheader = null;
	if(uc_check_avatar($uid) == 1){
		$cheader = array(
			"large"=>UC_API."/avatar.php?uid=$uid&size=big",
			"normal"=>UC_API."/avatar.php?uid=$uid&size=middle",
			"small"=>UC_API."/avatar.php?uid=$uid&size=small",
			"bit"=>UC_API."/avatar.php?uid=$uid&size=small"
		);
	}
	if(isset($_GET["tagix"]) && isset($_GET["size"]) && $_GET["tagix"] == "image"){
		if(!in_array($_GET["size"],array("large","normal","small","bit"))){
			header("Location: /static/noavatar.png");
			die();
		}
		if($cheader == null){
			header("Location: /static/noavatar.png");
			die();
		}
		header("Location: ".$cheader[$_GET["size"]]);
		die();
	}
	die(json_encode(array(
		"code"=>200,
		"user"=>array(
			"note"=>"$uid",
			"displayname"=>$username,
			"headerimg"=>$cheader,
			"outbox"=>'http://'.$_SERVER['HTTP_HOST']."api/qcstatus/user/$uid/note"
		)
	)));
}

if($mod == "tiezi"){
	$matchx = "1=1";
	$page = (int)(isset($_GET["page"])?$_GET["page"]:1);
	if(isset($_GET["tid"])){
		$matchx = "tid=".$_GET["tid"]." OR (parent_domain='".$_G["Site"]["SiteDomain"]."' AND parent_tid=".$_GET["tid"].")";
	}
	if(isset($_GET["uid"])){
		$matchx = "sender=".$_GET["uid"];
	}
	$tiezic = tieziVendor::getLocalNewestTiezi(100,$page*100 - 100,$matchx);
	die(json_encode(array(
		"code"=>200,
		"page"=>$page,
		"tiezis"=>$tiezic
	)));
}

if($mod == "server"){
	die(json_encode(array(
		"code"=>200,
		"profile"=>array(
			"title"=>$_G["Site"]["Name"],
			"domain"=>$_G["Site"]["SiteDomain"]
		)
	)));
}

die('{"code":404}');
?>