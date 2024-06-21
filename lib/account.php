<?php
if(!defined("IN_SITE")){die();}
require_once SITE_ROOT."lib/libauth.php";
require_once SITE_ROOT."lib/uc_conf.php";
require_once SITE_ROOT."lib/main_conf.php";
require_once SITE_ROOT."uc_client/client.php";
class Account{
	static function makeLoginAuth($uid,$expire=172600){
		$payload = array("uid"=>$uid,"expire"=>time()+$expire);
		return LibAuth::encryptPodicBase64($payload);
	}
	static function checkLoginAuth($auth){
		$i = LibAuth::decryptPodicBase64($auth);
		if(!is_array($i)){
			return 0;
		}
		if(!isset($i["expire"]) || !isset($i["uid"])){
			return 0;
		}
		if($i["expire"] < time()){
			return 0;
		}
		return $i["uid"];
	}
}

$logincookie = isset($_COOKIE[$_G["Auth"]["CookiePrefix"]."auther"])?$_COOKIE[$_G["Auth"]["CookiePrefix"]."auther"]:"";
list($uid, $uname, $email) = array(0,"","");
if($logincookie != ""){
	$uid = Account::checkLoginAuth($logincookie);
	if($data = uc_get_user($uid,1)) {
		list($uid, $uname, $email) = $data;
		setcookie($_COOKIE[$_G["Auth"]["CookiePrefix"]."auther"],Account::makeLoginAuth($uid),time()+172600);
	} else {
		list($uid, $uname, $email) = array(0,"","");
		setcookie($_COOKIE[$_G["Auth"]["CookiePrefix"]."auther"],"",1);
	}
}
$_G["Cache"]["Auth"]["uid"] = $uid;
$_G["Cache"]["Auth"]["username"] = $uname;
$_G["Cache"]["Auth"]["email"] = $email;
?>