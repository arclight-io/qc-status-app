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
	function page_switch(code){
		document.getElementById("sns_looker").style.display = (code=="sns_looker"?"block":"none");
		document.getElementById("indexer").style.display = (code=="indexer"?"block":"none");
		document.getElementById("notfounds").style.display = (code=="404"?"block":"none");
		document.getElementById("userdisplay").style.display = (code=="user"?"block":"none");
		document.getElementById("tiezidisplay").style.display = (code=="tiezi"?"block":"none");
		document.getElementById("account").style.display = (code=="account"?"block":"none");
	}
	function loadTieziDisplay(domain,tid){
		lib_request("api/selectTiezi.php?domain="+domain+"&tid="+tid).then((e)=>{
			return JSON.parse(e.responseText);
		}).then((v)=>{
			window.fsendbacker = _fsendbacker.bind(null,domain,tid);
			if(v.code == -404){
				page_switch("404");
				return;
			}
			page_switch("tiezi");
			let qsc=document.getElementById("tiezidisplay");
			qsc.innerHTML = "";
			qsc.style.margin = "2px";
			qsc.style.marginTop = "3px";
			qsc.padding = "2px";
			qsc.appendChild(decodeTiezi(v["tiezi"],false));
			console.log(window.loginuid);
			let rav = document.createElement("div");
			qsc.appendChild(rav);
			checkAccount().then(()=>{
				if(window.loginuid != 0){
					rav.innerHTML = `
<hr/>
<h3 style="margin-top:0px;margin-bottom:2px;">回帖</h3>
<div>
	<textarea id="slativ2" style="resize:none;width:calc(100% - 6px);height:200px;"></textarea><br/>
	<button onclick="window.fsendbacker();">发帖</button>
</div>
`;
				}
			})
			
			setTimeout(()=>{
				lib_request("api/getTiezi.php?mod=subtalk&domain="+domain+"&tid="+tid).then((e)=>{
					return JSON.parse(e.responseText);
				}).then((v)=>{
					for(ox in v.tiezi){
						let ub = document.createElement("div");
						let ax = decodeTiezi(v.tiezi[ox],true,true);
						ax.style.padding = "2px";
						ax.style.marginTop = "1px";
						ub.appendChild(document.createElement("hr"));
						ub.appendChild(ax);
						qsc.appendChild(ub);
					}
				})
			},Math.random()*500);
			history.pushState('', '', "/?mod=note&domain="+domain+"&tid="+tid);
		})
	}
	function loadUserDisplay(domain,note){
		page_switch("user");
		let displayc = document.getElementById("userdisplay");
		displayc.innerHTML = "";
		displayc.appendChild((()=>{
			let qs = document.createElement("div");
			let imgcdiv = document.createElement("div");
			let imgc = document.createElement("img");
			let qs2 = document.createElement("div");
			let txt1 = document.createElement("span");
			txt1.style.fontSize = "25px";
			txt1.style.fontWeight = "800";
			txt1.innerText = "加载中...";
			qs2.appendChild(txt1);
			qs2.appendChild(document.createElement("br"));
			qs2.appendChild(document.createTextNode(btoa(domain + "/" + note).replace(/=/g,"")));
			imgc.style.width = "60px";
			imgc.style.height = "60px";
			imgcdiv.style.position = "relative";
			imgc.style.position = "absolute";
			imgc.src = "/static/noavatar.png";
			imgcdiv.appendChild(imgc);
			imgc.style.borderRadius = "8px";
			qs.appendChild(imgcdiv);
			qs2.style.paddingLeft = "63px";
			qs.appendChild(qs2);
			lib_request("//"+domain+"/api/qcstatus/user/"+note).then((e)=>{
				return JSON.parse(e.responseText);
			}).then((mx)=>{
				if(mx.code == "404"){
					page_switch("404");
					return;
				}
				txt1.innerText = mx.user.displayname;
				if(mx.user.headerimg != undefined && mx.user.headerimg != null){
					imgc.src = mx.user.headerimg.large;
				}
			});
			qs.style.padding = "4px";
			return qs;
		})());
		displayc.appendChild((()=>{
			let qs = document.createElement("table");
			let adder = function(key,value){
				let row = document.createElement("tr");
				let tcol1=(()=>{
					let col1 = document.createElement("td");
					col1.innerText = key
					return col1;
				})();
				let tcol2=(()=>{
					let col1 = document.createElement("td");
					col1.innerText = value
					return col1;
				})();
				row.appendChild(tcol1);
				row.appendChild(tcol2);
				qs.appendChild(row);
				return [tcol1,tcol2];
			}
			adder("QC-Status指纹：",btoa(domain + "/" + note).replace(/=/g,""));
			adder("跨站用户名：","@"+note+"@"+domain);
			let server_confa = adder("服务器：",domain)[1];
			lib_request("//"+domain+"/api/qcstatus/server").then((e)=>{
				return JSON.parse(e.responseText);
			}).then((v)=>{
				server_confa.innerText = v.profile.title+"（"+domain+"）";
			})
			history.pushState('', '', "/?mod=user&finger="+btoa(domain + "/" + note).replace(/=/g,""));
			return qs;
		})());
		lib_request("//"+domain+"/api/qcstatus/user/"+note+"/note").then((e)=>{
			return JSON.parse(e.responseText);
		}).then((udx)=>{
			for(x in udx.tiezis){
				displayc.appendChild(document.createElement("hr"));
				displayc.appendChild(decodeTiezi(udx.tiezis[x]));
			}
		})
	}
	window.loginuid = 0;
	function checkAccount(){
		return lib_request("api/authapi.php?mod=check").then((e)=>{
			return JSON.parse(e.responseText);
		}).then((v)=>{
			if(v.result == null){
				window.loginuid = 0;
				document.getElementById("tie_send").display = "none";
				document.getElementById("account").innerHTML = `
<h2 style="display:inline">登录</h2>
<table>
	<tr>
		<td>用户名：</td><td><input id="i_username"/></td>
	</tr>
	<tr>
		<td>密码：</td><td><input id="i_password" type="password"/></td>
	</tr>
<table>
`;
				let qc = document.createElement("button");
				qc.innerText = "登录";
				qc.onclick = function(){
					let username = document.getElementById("i_username").value;
					let password = document.getElementById("i_password").value;
					lib_request("api/authapi.php?mod=login&username="+username+"&password="+password).then((e)=>{
						return JSON.parse(e.responseText);
					}).then((v)=>{
						if(v.result == 1){
							alert("登录成功！欢迎您，"+v.username);
							checkAccount();
						} else {
							alert("登录失败");
						}
					})
				}
				document.getElementById("account").appendChild(qc);
			} else {
				window.loginuid = Number(v.result.uc_uid);
				document.getElementById("tie_send").display = "block";
				document.getElementById("account").innerHTML = "";
				let cwe = document.createElement("div");
				cwe.appendChild((()=>{
					let img = document.createElement('img');
					img.style.width = "100px";
					img.style.height = "100px";
					img.src = "/api/qcstatus/user/"+v.result.note+"/header/large";
					return img;
				})());
				cwe.appendChild(document.createElement("br"));
				cwe.appendChild((()=>{
					let h2 = document.createElement('h2');
					let span = document.createElement('span');
					h2.style.display = "inline";
					h2.innerText = v.result.uc_username;
					span.style.fontWeight = "500";
					span.style.fontSize = "1rem";
					h2.appendChild(document.createTextNode(" "))
					h2.appendChild(span);
					span.innerText = v.result.finger;
					return h2;
				})());
				cwe.appendChild(document.createElement("br"));
				cwe.appendChild((()=>{
					let alink=document.createElement("a");
					let button=document.createElement("button");
					button.innerText = "个人主页";
					alink.appendChild(button);
					alink.href = "/?mod=user&finger="+v.result.finger;
					return alink;
				})())
				cwe.appendChild(document.createTextNode(" "))
				cwe.appendChild((()=>{
					let button=document.createElement("button");
					button.innerText = "退出登录";
					button.onclick = ()=>{lib_request("api/authapi.php?mod=exit").then(()=>{checkAccount()});};
					return button;
				})())
				cwe.style.padding = "3px";
				cwe.style.paddingBottom = "0px";
				document.getElementById("account").appendChild(cwe);
			}
		})
	}
	
	setTimeout(()=>{
		document.getElementById("sns_looker_alink").onclick = function(){
			history.pushState('', '', "/?mod=global");
			page_switch("sns_looker");
			return false;
		}
		document.getElementById("indexer_alink").onclick = function(){
			history.pushState('', '', "/?mod=index");
			setPortal("index");
			return false;
		}
		document.getElementById("account_alink").onclick = function(){
			history.pushState('', '', "/?mod=account");
			page_switch("account");
			return false;
		}
	},1);
	
	window.tieziDisplayer = {}
	
	function decodeContent(content){
		let inner = document.createElement("div");
		for(i in content){
			if(content[i]["type"] == "text"){
				let obj = document.createElement("span");
				if(content[i]["color"] != undefined){obj.style.color = content[i]["color"];}
				obj.innerText = content[i]["content"];
				inner.appendChild(obj);
			}
			if(content[i]["type"] == "link"){
				let obj = document.createElement("span");
				if(content[i]["color"] != undefined){obj.style.color = content[i]["color"];}
				obj.className = "ovelink";
				obj.innerText = content[i]["content"];
				inner.appendChild(obj);
			}
			if(content[i]["type"] == "h1"){
				let obj = document.createElement("h2");
				if(content[i]["color"] != undefined){obj.style.color = content[i]["color"];}
				obj.style.display = "inline";
				obj.innerText = [i]["content"];
				inner.appendChild(obj);
			}
			if(content[i]["type"] == "h2"){
				let obj = document.createElement("h3");
				if(content[i]["color"] != undefined){obj.style.color = content[i]["color"];}
				obj.style.display = "inline";
				obj.innerText = [i]["content"];
				inner.appendChild(obj);
			}
			if(content[i]["type"] == "h3"){
				let obj = document.createElement("h4");
				if(content[i]["color"] != undefined){obj.style.color = content[i]["color"];}
				obj.style.display = "inline";
				obj.innerText = [i]["content"];
				inner.appendChild(obj);
			}
			if(content[i]["type"] == "img"){
				let imgx = document.createElement("img");
				imgx.src = content[i]["content"];
				imgx.alt = content[i]["alt"];
				imgx.style.width = content[i]["width"];
				imgx.style.height = content[i]["height"];
				inner.appendChild(imgx);
			}
		}
		return {"lora":inner};
	}
	function decodeTiezi(tiezi,usejump=true,ignoreParent=false){
		let ax = document.createElement("div");
		let kl = document.createElement("div");
		if(tiezi["content"]["type"] == "note"){
			if(tiezi["content"]["content"] == undefined){
				kl.innerHTML = "Format Error.";
			} else {
				let innovate = decodeContent(tiezi["content"]["content"])
				kl.appendChild(innovate["lora"]);
			}
		} else {
			kl.innerHTML = "Unknown Note type.";
		}
		ax.appendChild((()=>{
			let qs = document.createElement("div");
			let imgcdiv = document.createElement("div");
			let imgc = document.createElement("img");
			let qs2 = document.createElement("div");
			let txt1 = document.createElement("span");
			txt1.style.fontWeight = "800";
			txt1.innerText = "[匿名]";
			qs2.appendChild(txt1);
			qs2.appendChild(document.createElement("br"));
			qs2.appendChild(document.createTextNode(btoa(tiezi["domain"] + "/" + tiezi["sender"]["note"]).replace(/=/g,"")));
			imgc.style.width = "40px";
			imgc.style.height = "40px";
			imgcdiv.style.position = "relative";
			imgc.style.position = "absolute";
			imgc.src = "/static/noavatar.png";
			imgcdiv.appendChild(imgc);
			imgc.style.borderRadius = "8px";
			qs.appendChild(imgcdiv);
			qs2.style.paddingLeft = "43px";
			qs.appendChild(qs2);
			setTimeout(()=>{
				lib_request("//"+tiezi["domain"]+"/api/qcstatus/user/"+tiezi["sender"]["note"]).then((e)=>{
					return JSON.parse(e.responseText);
				}).then((mx)=>{
					if(mx.code == "404"){
						return;
					}
					txt1.innerText = mx.user.displayname;
					if(mx.user.headerimg != undefined && mx.user.headerimg != null){
						imgc.src = mx.user.headerimg.normal;
					}
				});
			},Math.random()*700);
			qs.onclick = loadUserDisplay.bind(null,tiezi["domain"],tiezi["sender"]["note"]);
			return qs;
		})())
		let qtime=(()=>{
			let date = new Date(tiezi["sendtime"] * 1000);  // 参数需要毫秒数，所以这里将秒数乘于 1000
			Y = date.getFullYear() + '-';
			M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
			D = date.getDate() + ' ';
			h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) +  ":";
			m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
			return Y+M+D+h+m;
		})()
		if(tiezi["parent"] != null && tiezi["parent"] != undefined){
			ax.appendChild((()=>{
				let ed=document.createElement("div");
				let q=document.createElement("span");
				let qh=document.createElement("div");
				ed.appendChild(q);
				ed.appendChild(qh);
				qh.style.border = "1px solid #555555";
				qh.style.borderRadius = "3px";
				qh.style.padding = "2px";
				qh.style.marginBottom = "2px";
				qh.style.marginTop = "2px";
				qh.innerText = "加载中...";
				q.innerText = "于 "+qtime+" 回复他人";
				q.style.color = "#00A613";
				q.appendChild(document.createElement("br"));
				setTimeout(()=>{
					lib_request("api/selectTiezi.php?domain="+tiezi["parent"]["domain"]+"&tid="+tiezi["parent"]["tid"]).then((e)=>{
						return JSON.parse(e.responseText);
					}).then((v)=>{
						if(v.code == -404){
							q.innerText = "于 "+qtime+" 回复 null";
							qh.innerText = "帖子不存在或实例不可达";
							return;
						}
						qh.innerHTML = "";
						qh.appendChild(decodeTiezi(v["tiezi"]));
						q.innerText = "于 "+qtime+" 回复 "+btoa(v["tiezi"]["domain"] + "/" + v["tiezi"]["sender"]["note"]).replace(/=/g,"");
					})
				},Math.random()*600);
				if(ignoreParent){
					qh.style.display = "none";
				}
				return ed;
			})());
		} else {
			ax.appendChild((()=>{
				let q=document.createElement("span");
				q.innerText = "于 "+qtime+" 发送帖子";
				q.style.color = "#00A613";
				q.appendChild(document.createElement("br"));
				return q;
			})());
		}
		if(usejump){
			kl.onclick = loadTieziDisplay.bind(null,tiezi.domain,tiezi.tid)
		}
		ax.appendChild(kl);
		return ax;
	}
	
	function fetchTiezi(){
		if(window.get_new_tiezi != undefined){
			window.get_new_tiezi();
		}
		for(ic in window.tiezidb){
			if(window.tieziDisplayer[ic] == undefined){
				let ub = document.createElement("div");
				let ax = decodeTiezi(window.tiezidb[ic]);
				ax.style.padding = "2px";
				ax.style.marginTop = "1px";
				ub.appendChild(ax);
				ub.appendChild(document.createElement("hr"));
				window.tieziDisplayer[ic] = ub;
				document.getElementById("sns_looker_list").appendChild(ub);
			}
		}
	}
	window.fetchTiezi = fetchTiezi;
	setTimeout(fetchTiezi,100);
	setTimeout(fetchTiezi,500);
	setInterval(fetchTiezi,60000);
	
	function setPortal(pid){
		lib_request("config/portal/"+pid+".inc.html?r="+Math.random()).then((e)=>{
			if(e.status == 404){
				page_switch("404");
			} else {
				page_switch("indexer");
				document.getElementById("indexer").innerHTML = e.responseText;
			}
		})
	}
	window.setPortal = setPortal;
	
	setTimeout(function(){
		let urlobject = new URL(location.href);
		let urlmod = urlobject.searchParams.get("mod");
		if(urlmod == undefined || urlmod == "index"){
			page_switch("indexer");
			let topic = urlobject.searchParams.get("topic");
			if(topic == undefined){
				topic = "index";
			}
			setPortal(topic);
		} else if(urlmod == "global") {
			page_switch("sns_looker");
		} else if(urlmod == "account") {
			page_switch("account");
		} else if(urlmod == "note") {
			if(urlobject.searchParams.get("domain") == undefined){
				page_switch("404");
			}else if(urlobject.searchParams.get("tid") == undefined){
				page_switch("404");
			}else{
				loadTieziDisplay(urlobject.searchParams.get("domain"),urlobject.searchParams.get("tid"));
			}
		} else if(urlmod == "user") {
			if(urlobject.searchParams.get("finger") == undefined){
				page_switch("404");
			} else {
				let ccl =  atob(urlobject.searchParams.get("finger")).split("/",2);
				if(ccl.length < 2){
					page_switch("404");
				} else {
					loadUserDisplay(ccl[0],ccl[1]);
				}
			}
		} else {
			page_switch("404");
		}
		checkAccount();
		
	},100);
	lib_request("api/federal_restful.php?mod=server&cliental=1").then((e)=>{
		return JSON.parse(e.responseText);
	}).then((v)=>{
		if(location.hostname != v.profile.domain){
			location.hostname = v.profile.domain;
		}
		document.title = v.profile.title;
		document.getElementById("slctitle").innerText = v.profile.title;
	})
	function wx_tiezi_post(txtcontent,imglist=[],parentdom="",parentid=0){
		let FD = new FormData();
		FD.append("content",txtcontent);
		FD.append("parent_domain",parentdom);
		FD.append("parent",parentid);
		return lib_request("api/send-tiezi.php","POST",FD).then((e)=>{
			return JSON.parse(e.responseText);
		}).then((v)=>{
			if(v.code == 200){
				return true;
			}
			return false;
		});
	}
	function _fsendtiezi(){
		let textareac = document.getElementById("slativ");
		if(textareac.value == ""){
			return;
		}
		window.fsendtiezi = function(){};
		wx_tiezi_post(textareac.value).then((s)=>{
			if(s){
				alert("发帖成功");
				textareac.value = "";
				history.go(0);
			} else {
				alert("发帖失败");
				window.fsendtiezi = _fsendtiezi;
			}
		})
	}
	function _fsendbacker(dom,tid){
		let textareac = document.getElementById("slativ2");
		if(textareac.value == ""){
			return;
		}
		let origx = window.fsendbacker;
		window.fsendbacker = function(){};
		wx_tiezi_post(textareac.value,[],dom,tid).then((s)=>{
			if(s){
				alert("发帖成功");
				textareac.value = "";
				history.go(0);
			} else {
				alert("发帖失败");
				window.fsendbacker = origx;
			}
		})
	}
	window.fsendbacker = function(){};
	window.fsendtiezi = _fsendtiezi;
})()