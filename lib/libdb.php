<?php
require_once "main_conf.php";
require_once "rc4.php";

$dbConnect = new mysqli($_G["Mysql"]["Server"], $_G["Mysql"]["Username"], $_G["Mysql"]["Password"], $_G["Mysql"]["DBName"]);
?>