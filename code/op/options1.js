
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
  document.querySelector("#saveStat").innerHTML = "Last saved (now) " + d1 + " (Status show :" + e1 + ")";
}

function restoreOptions() {
	var e1 = 'true';
  chrome.storage.local.get(null, (res) => {
    document.querySelector("#url").value = res.url || 'http://localhost:8080/urlConsumer/';
	if(res.ehist ===null || res.ehist || res.ehist == 'true'){
		document.querySelector("#ehist").checked = true;
	}else{
		document.querySelector("#ehist").checked = "";
	}
	
	e1 = res.estat === null ? 'true' : res.estat;
	
	if(e1 == false) {		
		document.querySelector("#estat").checked = "";
	}else{
		document.querySelector("#estat").checked = "checked"; 
	}
	if(res.atabDet ===null || res.atabDet || res.atabDet == 'true'){
		document.querySelector("#atabDet").checked = "checked";
	}else{
		document.querySelector("#atabDet").checked = "";
	}
	var s = null;
	if(res.savDate){
		s = "Last saved " + res.savDate;
	}else{
		s = "Defaults from 2130 03 Aug 16";
	}
	s = s + "(Status show :" + e1 + ")"
	document.querySelector("#saveStat").innerHTML = s;
	document.querySelector("#stat").innerHTML = res.status || "Status : (not yet used)(status not set).";
	/*var t = [];
	t.push("as test value 1");
	for(var i =0; i < t.length; i++){
				document.querySelector("#hst1").innerHTML += i + " " + t[i] + "<br>";
	}*/
	if(res.histAr ===null || res.ehist === false){
			document.querySelector("#hst1").innerHTML = "Disabled";
			document.querySelector("#stat").innerHTML += "0";
	}else if(res.histAr === null || (res.histAr + "") == "undefined" ){
		document.querySelector("#stat").innerHTML += "1";
		document.querySelector("#hst1").innerHTML = "N/a";
	}else{
		document.querySelector("#stat").innerHTML += "2";
		var h =res.histAr;
		document.querySelector("#stat").innerHTML += " a";
		document.querySelector("#hst1").innerHTML = "Hist " + h + "<br>";
		document.querySelector("#stat").innerHTML += " c";
		for(var i =0; i < h.length; i++){
				document.querySelector("#hst1").innerHTML += i + " " + h[i] + "<br>";
		}
	}
	
  });

}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
