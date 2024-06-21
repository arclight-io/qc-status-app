(()=>{
	function lib_request(url,method="GET",payload=undefined){
		return new Promise(function(resolve){
			var xmlhttp=new XMLHttpRequest();
			xmlhttp.onreadystatechange=function()
			{
				if (xmlhttp.readyState==4)
				{
					resolve(xmlhttp);
				}
			}
			xmlhttp.open(method,url,true);
			xmlhttp.send(payload);
		})
	}
	window.tiezidb = {};
	
	function _get_new_tiezi(page){
		for (var i=0;i<=page;i++){
			setTimeout(()=>{
				lib_request("api/getTiezi.php?page="+(page - i)).then((e)=>{
					return JSON.parse(e.responseText)
				}).then((v)=>{
					window.tiezidb = Object.assign(window.tiezidb,v.tiezi);
				})
			},Math.random()*500)
		}
		if(window.tiezidb.length + 30 > page * 100){
			window.get_new_tiezi = _get_new_tiezi.bind(null,page+1);
		}
	}
	
	window.get_new_tiezi = _get_new_tiezi.bind(null,2);
	window.get_new_tiezi();
})()