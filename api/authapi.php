<?php
if(!isset($_REQUEST["mod"])){
	die('{"code":200,"result":-1}');
}
define("IN_SITE",true);
define('SITE_ROOT', substr(dirname(__FILE__), 0, -3));
require_once SITE_ROOT."lib/main_conf.php";
require_once SITE_ROOT."lib/account.php";
require_once SITE_ROOT."lib/uc_conf.php";
require_once SITE_ROOT."uc_client/client.php";

if($_REQUEST["mod"] == "check"){
	if($data = uc_get_user($_G["Cache"]["Auth"]["uid"],1)) {
		list($uid, $username, $email) = $data;
	} else {
		setcookie($_G["Auth"]["CookiePrefix"]."auther","",1,"/");
		die('{"code":200,"result":null}');
	}
	$finger = str_replace("=","",base64_encode($_G["Site"]["SiteDomain"]."/".$uid));
	die(json_encode(array("code"=>200,"result"=>array("uc_uid"=>$uid,"note"=>$uid,"finger"=>$finger,"display_name"=>$username,"uc_username"=>$username))));
}elseif($_REQUEST["mod"] == "login"){
	if(!isset($_REQUEST["username"]) || !isset($_REQUEST["password"])){
		die();
	}
	list($uid, $username, $password, $email) = uc_user_login($_REQUEST["username"], $_REQUEST['password'],2);
	if($uid <= 0){
		list($uid, $username, $password, $email) = uc_user_login($_REQUEST["username"], $_REQUEST['password'],0);
		if($uid <= 0){
			list($uid, $username, $password, $email) = uc_user_login($_REQUEST["username"], $_REQUEST['password'],1);
		}
	}
	if($uid > 0) {
		setcookie($_G["Auth"]["CookiePrefix"]."auther",Account::makeLoginAuth($uid),time()+2*86400,"/");
	}
	die('{"code":200,"result":1,"uid":'.$uid.',"username":'.json_encode($username).'}');
}elseif($_REQUEST["mod"] == "exit"){
	require_once SITE_ROOT."lib/account.php";
	if($_G["Cache"]["Auth"]["uid"] <= 0){
		die('{"code":200,"result":-1}');
	}
	setcookie($_G["Auth"]["CookiePrefix"]."auther","",1,"/");
	die('{"code":200,"result":1}');
}elseif($_REQUEST["mod"] == "sync"){
	if($_G["Cache"]["Auth"]["uid"] == 0){
		die(uc_user_synlogout());
	}
	die(uc_user_synlogin($_G["Cache"]["Auth"]["uid"]));
}else{
	die('{"code":200,"result":-1}');
}
die('{"code":200,"result":-1}');
?>