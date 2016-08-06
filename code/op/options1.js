
function saveOptions(e) {
	var e1 = document.querySelector("#estat").checked;
	var d1 = new Date();
	chrome.storage.local.set({
		url: document.querySelector("#url").value,
		ehist: document.querySelector("#ehist").checked  ,
		estat: e1 ,
		atabDet: document.querySelector("#atabDet").checked ,
		savDate: d1
	});
	document.querySelector("#saveStat").innerHTML = "Last saved (now) " + escapeHTML(d1) + " (Status show :" + escapeHTML(e1) + ")";
}

function restoreOptions() {
	var e1 = 'true';
	chrome.storage.local.get(null, (res) => {
		document.querySelector("#url").value = res.url || 'http://localhost:8080/urlConsumer/';
		if(res.ehist ===null || res.ehist ){
			document.querySelector("#ehist").checked = true;
		}else{
			document.querySelector("#ehist").checked = "";
		}
		document.querySelector("#dbg2").innerHTML = '';
		e1 = res.estat === null ? 'true' : res.estat;

		if(e1 == false) {		
			document.querySelector("#estat").checked = "";
		}else{
			document.querySelector("#estat").checked = "checked"; 
		}
		if(res.atabDet ===null || res.atabDet ){
			document.querySelector("#atabDet").checked = "checked";
		}else{
			document.querySelector("#atabDet").checked = "";
		}
		var s = null;
		if(res.savDate){
			s = "Last saved " + escapeHTML(res.savDate);
		}else{
			s = "Defaults from 2130 03 Aug 16";
		}
		s = s + "(Status show :" + e1 + ")"
		document.querySelector("#saveStat").innerHTML = s;
		if(e1){
			document.querySelector("#stat").innerHTML = escapeHTML(res.status) || "Status : (not yet used)(status not set).";
		}else{
			document.querySelector("#stat").innerHTML = "Status disabled";
		}
		document.querySelector("#dbg2").innerHTML += "( res.atabDet :" + escapeHTML(res.atabDet) + ")<br>";

		if(res.ehist === false){
			document.querySelector("#hst1").innerHTML = "Disabled";
			document.querySelector("#dbg2").innerHTML += "History disabled<br>";
		}else if(res.histAr === null || (res.histAr + "") == "undefined" ){
			document.querySelector("#dbg2").innerHTML += "Hist arr null<br>";
			document.querySelector("#hst1").innerHTML = "N/a";
		}else{
			document.querySelector("#dbg2").innerHTML += "Hist enabled<br>";
			var h =res.histAr;
			document.querySelector("#dbg2").innerHTML += " ar len :" + h.length + "<br>";
			document.querySelector("#hst1").innerHTML = "Hist " + "<br>";
			for(var i =0; i < h.length; i++){
				document.querySelector("#hst1").innerHTML += (i + 1) + " " + escapeHTML(h[i]) + "<br><br>";
			}
		}
		

	});

}

function clearStorage(){
	chrome.storage.local.clear();
	chrome.storage.clear();
	chrome.storage.local.set({
		histAr : []
	});
	restoreOptions();
}
function do2(){
	setTimeout(restoreOptions, 300)
}
document.addEventListener('DOMContentLoaded', do2);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#reLoad").addEventListener("click", restoreOptions);
document.querySelector("#clr").addEventListener("click", clearStorage);
//--end
