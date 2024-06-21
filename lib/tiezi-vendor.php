<?php
require_once "libdb.php";
require_once "main_conf.php";

class tieziVendor{
	static function heapingTiezi($domain,$suburl=""){
		global $_G;
		global $dbConnect;
		$gliveral = json_decode(file_get_contents("http://".$domain."/api/qcstatus/note/".$suburl),true);
		foreach($gliveral["tiezis"] as $i){
			$tid = $i["tid"];
			$sender = addslashes($i["sender"]["note"]);
			$parentdomain = "";
			$parentid = 0;
			if($i["parent"] != null){
				$parentdomain = $i["parent"]["domain"];
				$parentid = $i["parent"]["tid"];
			}
			$icomment = addslashes(json_encode($i["content"]));
			$time = (int)$i["sendtime"];
			$table = $_G["Mysql"]["DBPrefix"]."tiezi";
			$sql = <<<EOF
INSERT INTO $table (domain,tid,sender,parent_domain,parent_tid,content_json,sendtime)
VALUES ($domain,$tid,"$sender","$parentdomain",$parentid,"$icomment",$time);
EOF;
			$result = mysqli_query($dbConnect,$sql);
		}
	}
	static function getNewestTiezi($limit=50,$offset=0,$where="1=1"){
		global $_G;
		global $dbConnect;
		$result = mysqli_query($dbConnect,"SELECT * FROM ".$_G["Mysql"]["DBPrefix"]."tiezi WHERE ".$where." Order By sendtime DESC LIMIT ".$limit." OFFSET ".$offset);
		if($result == false){
			return array();
		}
		$ivl = array();
		while($row = mysqli_fetch_array($result))
		{
			$pix = array(
				"domain" => $row["domain"],
				"tid" => $row["tid"],
				"sender" => array(
					"note" => $row["sender"],
					"domain" => $row["domain"]
				),
				"sendtime" => $row["sendtime"],
				"content" => json_decode($row["content_json"],true),
				"parent" => array(
					"domain" => $row["parent_domain"],
					"tid" => $row["parent_tid"]
				)
			);
			if($row["parent_domain"] == "" || $row["parent_tid"] == 0){
				$pix["parent"] = null;
			}
			$ivl[] = $pix;
		}
		return $ivl;
	}
	static function getLocalNewestTiezi($limit=50,$offset=0,$where="1=1"){
		global $_G;
		$domain = $_G["Site"]["SiteDomain"];
		return tieziVendor::getNewestTiezi($limit,$offset,"($where) AND domain=\"$domain\"");
	}
	static function sendTiezi($sender,$content,$parentdomain="",$parentid=0){
		global $_G;
		global $dbConnect;
		$icomment = addslashes(json_encode($content));
		$domain = addslashes($_G["Site"]["SiteDomain"]);
		$time = time();
		$tid = mt_rand(0,9).mt_rand(0,65535).$time.mt_rand(100,999);
		$table = $_G["Mysql"]["DBPrefix"]."tiezi";
		$sql = <<<EOF
INSERT INTO $table (domain,tid,sender,parent_domain,parent_tid,content_json,sendtime)
VALUES ("$domain",$tid,"$sender","$parentdomain",$parentid,"$icomment",$time);
EOF;
		$result = mysqli_query($dbConnect,$sql);
		return ($result != false);
	}
	static function deleteOwnedTiezi($tid,$sender){
		global $_G;
		global $dbConnect;
		$table = $_G["Mysql"]["DBPrefix"]."tiezi";
		$sql = "DELETE FROM $table WHERE tid=$tid AND sender=$sender";
		$result = mysqli_query($dbConnect,$sql);
		return ($result != false);
	}
}
?>