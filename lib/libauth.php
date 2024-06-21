<?php
require_once "main_conf.php";
require_once "rc4.php";

class LibAuth{
	static function _getRPass($r1,$r2,$r3,$i){
		$h1 = md5(md5($r1.$i).$r2.md5($r3)).$r1;
		$h2 = md5(md5($r2.$i).$r3.md5($r1)).$r3;
		$h3 = md5(md5($r3.$i).$r1.md5($r2)).$r2;
		$k = md5($h1.$h2.$h3.md5(rc4($i.$h1,$h2).rc4($h3,$h2.$i)));
		list($h1,$h2,$h3) = array($h2,$h3,$h1);
		$k .= md5($h1.$h2.$h3.md5(rc4($i.$h1,$h2).rc4($h3,$h2.$i)));
		list($h1,$h2,$h3) = array($h2,$h3,$h1);
		$k .= md5($h1.$h2.$h3.md5(rc4($i.$h1,$h2).rc4($h3,$h2.$i)));
		return $k.md5($k.$r1.$i);
	}
	static function _encrypt($data,$pass1,$pass2,$pass3){
		$data = rc4($pass1.$pass3,$data);
		$data = rc4(LibAuth::_getRPass($pass1,$pass2,$pass3,md5($pass1.$pass3."1")),$data);
		$data = rc4(LibAuth::_getRPass($pass1,"2".$pass2,$pass3,md5($pass1.$pass3."45")),$data);
		$data = rc4("556".$pass1.$pass3,$data);
		return $data;
	}
	static function _decrypt($data,$pass1,$pass2,$pass3){
		$data = rc4("556".$pass1.$pass3,$data);
		$data = rc4(LibAuth::_getRPass($pass1,"2".$pass2,$pass3,md5($pass1.$pass3."45")),$data);
		$data = rc4(LibAuth::_getRPass($pass1,$pass2,$pass3,md5($pass1.$pass3."1")),$data);
		$data = rc4($pass1.$pass3,$data);
		return $data;
	}
	static function _encryptPodicBin($djson,$pass1,$pass2,$pass3){
		$data = json_encode($djson);
		$payload = json_encode(array("d"=>$data,"h"=>md5($data."1")));
		return LibAuth::_encrypt($payload,$pass1,$pass2,$pass3);
	}
	static function _decryptPodicBin($podicbin,$pass1,$pass2,$pass3){
		$payload = json_decode(LibAuth::_encrypt($podicbin,$pass1,$pass2,$pass3),true);
		if($payload["h"] != md5($payload["d"]."1")){
			return null;
		}
		return json_decode($payload["d"],true);
	}
	static function encryptPodicBase64($djson){
		global $_G;
		return base64_encode(LibAuth::_encryptPodicBin($djson,$_G["Auth"]["SecretCode1"],$_G["Auth"]["SecretCode2"],$_G["Auth"]["SecretCode3"]));
	}
	static function decryptPodicBase64($code){
		global $_G;
		return LibAuth::_decryptPodicBin(base64_decode($code),$_G["Auth"]["SecretCode1"],$_G["Auth"]["SecretCode2"],$_G["Auth"]["SecretCode3"]);
	}
	static function encryptPodicBin($djson){
		global $_G;
		return LibAuth::_encryptPodicBin($djson,$_G["Auth"]["SecretCode1"],$_G["Auth"]["SecretCode2"],$_G["Auth"]["SecretCode3"]);
	}
	static function decryptPodicBin($bin){
		global $_G;
		return LibAuth::_decryptPodicBin($bin,$_G["Auth"]["SecretCode1"],$_G["Auth"]["SecretCode2"],$_G["Auth"]["SecretCode3"]);
	}
	static function encryptPodicBase32($djson){
		global $_G;
		return Base32::encode(LibAuth::_encryptPodicBin($djson,$_G["Auth"]["SecretCode1"],$_G["Auth"]["SecretCode2"],$_G["Auth"]["SecretCode3"]));
	}
	static function decryptPodicBase32($code){
		global $_G;
		return LibAuth::_decryptPodicBin(Base32::decode($code),$_G["Auth"]["SecretCode1"],$_G["Auth"]["SecretCode2"],$_G["Auth"]["SecretCode3"]);
	}
}
?>