<?php
$_G = array();

//Database config
$_G["Mysql"]["Server"] = "<数据库服务器>";
$_G["Mysql"]["Port"] = 3306; //数据库端口
$_G["Mysql"]["Username"] = "<数据库用户名>";
$_G["Mysql"]["Password"] = "<数据库密码>";
$_G["Mysql"]["DBName"] = "<数据库名>";
$_G["Mysql"]["DBPrefix"] = "<表前缀>";

//Auth config
$_G["Auth"]["CookiePrefix"] = "qcstatus_"; //Cookie前缀
$_G["Auth"]["SecretCode1"] = "<密钥，请务必乱填>";
$_G["Auth"]["SecretCode2"] = "<密钥，请务必乱填>";
$_G["Auth"]["SecretCode3"] = "<密钥，请务必乱填>";

//Site config
$_G["Site"]["Name"] = "<站名>";
$_G["Site"]["SiteDomain"] = "<域名>";

//Federation config
$_G["Federation"]["Pairs"] = array(
	"chatsns.yz666.eu.org"
	"blhx.yz666.eu.org"
); //其他服务器的地址，用于去中心化连接
?>