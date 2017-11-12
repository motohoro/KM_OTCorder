/* Copyright motohoro  */
jQuery(document).ready(function () {
	if($("#preview").length + $("#barcodevisiblebtn").length){
	return;
	}

	var script3 = document.createElement('script');
	script3.type="text/javascript";

	if(($("input[value='sure']").length + $("input[value='order_mail']").length) >0){
		$("body").prepend('<button id="barcodevisiblebtn" onclick="showqrcode();">バーコード表示</button>');
	script3.innerHTML = `function aaa() {
		showqrcode = function(){
			$("#barcodevisiblebtn").hide();
			var orders = $("input[name='order']").val();
			var order = orders.split("!");
			// https://www.markernet.co.jp/blog/blog/2014/08/22/post-2493/
			$("font:contains('商品名')").parent().parent().nextAll().each(function(index,domEle){//tr
				if ($("td",this).attr("bgcolor")=="#ffffff"){
					var params1 = order[index].split(":");
					var params2 = params1[0].split(",");
					var qrstr = '{"name":"'+encodeURIComponent($("td",this).get(1).innerHTML+ $("td",this).get(3).innerHTML) + '","param":["g_no='+params2[0]+'","op1='+params2[1]+'","op2='+params2[2]+'","amount='+params1[1]+'","FF=0"]}';
					var qrimgtag = document.createElement("img");
					qrimgtag.setAttribute("src","https://api.qrserver.com/v1/create-qr-code/?charset-source=UTF-8&margin=8&size=110x110&data="+qrstr);
					domEle.appendChild(qrimgtag);
				}
			});
		};//<-showqrcode
	};`;
	}else{
		$("body").prepend('<div id="scanpane"><div><video id="preview" width="300" height="150" style="text-align:center;display:none"></video></div><div><button id="scanbtn">バーコードスキャン開始</button></div><div id="scannamelist"></div></div>');
	script3.innerHTML = `function aaa() {
		var order="";
		/*
		$(window).on('beforeunload', function() {
			cameraoff();
			return;
		});
		*/
		$("#scanbtn").on('click',function(){
			$("#preview").toggle();
			if($("#preview").css('display')=="none"){
				$("#scanbtn").text("バーコードスキャン開始");
				cameraoff();
			}else{
				$("#scanbtn").text("スキャン停止");
				camerainit();
			}
		});
		camerainit = function(){
			Instascan.Camera.getCameras().then(function (cameras) {
				if (cameras.length > 0) {
					scanner.start(cameras[0]);
				} else {
					console.error('No cameras found.');
				}
			}).catch(function (e) {
				console.error(e);
			});
	    }/*camerainit*/
		cameraoff = function(){
			scanner.stop();
		}/*cameraoff*/

		let scanner;
		try{
			scanner = new Instascan.Scanner({ video: document.getElementById('preview'),backgroundScan:true,scanPeriod: 2 });
		}catch(e){
			alert("reload");
			return;
		}

		scanner.addListener('scan', function (content) {
			qrdatajson = JSON.parse(content);
			qrdataparam=qrdatajson['param'].join("&");
			order=Cookies.get("order");
			console.log("ORder cookie:"+order);
			// http://qiita.com/isseium/items/12b215b6eab26acd2afe
			new Audio("data:audio/wav;base64,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").play();
			//https://stackoverflow.com/questions/22587308/convert-iso-8859-1-to-utf-8
	//		insel.innerHTML=decodeURIComponent(escape(qrdatajson['name']));
			$("#scannamelist").append("<div>"+decodeURIComponent(escape(qrdatajson['name']))+"</div>")
			$.get("https://kansaimedico.co.jp/medico_syanai/cgi/spfne/shop.cgi?" + qrdataparam +"&"+ order,function(data){
Cookies.remove('order', { path: '' });
Cookies.set("order",$("input[name=order]",data).first().val());
				$('a[href*="order="]').each(function(){
				//Javascriptの正規表現置換で後方参照を使いたい http://d.hatena.ne.jp/seuzo/20090218/1234926645
				//正規表現チェッカー PHP: preg_match() / JavaScript: match() http://okumocchi.jp/php/re.php
				var newurl = $(this).attr("href").replace(/(.*?)order=.*?(\&.*|$)/,"$1order=" + encodeURIComponent($("input[name=order]",data).first().val())+"$2");
					$(this).attr("href",newurl);
				});//url書き換え

				//Form書き換え
				$("input:hidden[name='order']").val($("input[name=order]",data).first().val());
			});
		});
	};`;//<-script3
	}
	document.head.appendChild(script3);

	var jqurl = chrome.extension.getURL("resources/jquery-3.2.1.min.js");
	var jqcookurl = chrome.extension.getURL("resources/js.cookie.min.js");

	var script = document.createElement('script');
	script.type="text/javascript";
/*	script.setAttribute('onload',`var script2 = document.createElement('script');
		script2.id="jqueryscript";
		script2.type="text/javascript";
		script2.setAttribute('onload',"aaa();");
		script2.src = "${jqurl}";
		document.head.appendChild(script2);
		var script4 = document.createElement('script');
		script4.type="text/javascript";
		script4.src= "${jqcookurl}";
		document.head.appendChild(script4);
	`);
*/
	var scriptcontent1 = `var script2 = document.createElement('script');
		script2.id="jqueryscript";
		script2.type="text/javascript";
		script2.setAttribute('onload',"aaa();");
		script2.src = "${jqurl}";
		document.head.appendChild(script2);
		var script4 = document.createElement('script');
		script4.type="text/javascript";
		script4.src= "${jqcookurl}";
		document.head.appendChild(script4);
	`;
	//jQueryのajax()を利用すると返り値をとりたいときのやり方 - Qiita https://qiita.com/katsukii/items/bd64efcf4f070d77c028
	var instascanurl = chrome.extension.getURL("resources/instascan.min.js");
	function instaload(){
		return $.ajax({
			url:instascanurl,
			dataType: 'text'
		});
	}
	
	instaload().done(function(result){
	script.innerHTML=result+";"+scriptcontent1;
//	script.src = 'https://cdn.rawgit.com/schmich/instascan-builds/36ad50f0/instascan.min.js';
	document.head.appendChild(script);
	}).fail(function(result){
	});

});
