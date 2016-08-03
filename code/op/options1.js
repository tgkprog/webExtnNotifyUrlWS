
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
	document.querySelector("#stat").innerHTML = res.status || "Status : (not yet used)(restore).";
	if(res.ehist ===null || res.ehist === false){
			document.querySelector("#hst").innerHTML = "Disabled";
	}else if(res.histAr === null){
		document.querySelector("#hst").innerHTML = "N/a";
	}else{
		var h =res.histAr;
		document.querySelector("#hst").innerHTML = "Hist " + h.length + "<br>";
		for(var i =0; i < h.length; i++){
				document.querySelector("#hst").innerHTML += i + " " + h[i] + "<br>";
		}
	}
	document.querySelector("#stat").innerHTML = res.status || "Status : (not yet used).";
  });

}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
