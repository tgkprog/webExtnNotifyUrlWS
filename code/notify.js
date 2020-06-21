//about:debugging
//send1() ; about:addons
var opts = {url : "aurl"};
var currentTab;
var oCurrCheck = null;
var updateLvl = 0;
var hist = [];
var dbg1 = "";

function send1() {
	try{
		fillHerUp();
		// console.log("send1 request" );
		var t = true;
		if(oCurrCheck !=  currentTab){
			chrome.storage.local.set({
				status : "Starting at " + new Date() + "."
			});
			oCurrCheck = currentTab;
			var oReq = new XMLHttpRequest();
			oReq.timeout = 8000;			
			oReq.addEventListener("progress", updateProgress);
			//oReq.addEventListener("load", transferComplete);
			oReq.addEventListener("error", transferFailed);
			oReq.addEventListener("abort", transferCanceled);
			oReq.ontimeout = ontimeout;
			
			oReq.onreadystatechange = function (aEvt) {
				  if (oReq.readyState == 4) {
				     if(oReq.status == 200){
				    	 histAdd("Completed at " + new Date());
				     }
				     else{
				    	 histAdd("Error " + oReq.status + ", Txt: " + oReq.statusText +  
				 				", at "  + new Date());
				     }
				  }
				};
		
			var p1 = encodeURI(opts.p1);
			var p2 = encodeURI(opts.p2);
			var ss =  "p=" + encodeURI(escapeHTML(currentTab.url)) + "&dt=" + encodeURI(new Date());
			if(opts.atabDet){
				ss += "&dbg=" + encodeURI(escapeHTML(JSON.stringify(currentTab)));
			}
			ss += "&p1=" + p1 + "&p2=" + p2;
			ss += "&v=10_atabDet_" + opts.atabDet + "_url_" + opts.url + "_ehist_" + opts.ehist + ". " + (opts.ehist === false) 
			+ "._dbg2_" + encodeURI(dbg1)  + "." ;
			ss += "_p1_" +  p1 + "_p2_" +  p2; 
			
			oReq.open("GET", opts.url + "?" + ss);
			oReq.send();
			//console.log(ss);
			histAdd("At " + new Date());
		}    
	}catch(e){
		console.log("send1 err" + e);

	}
}

//progress on transfers from the server to the client (downloads)
function updateProgress (oEvent) {
	if (oEvent.lengthComputable) {
		var percentComplete = oEvent.loaded / oEvent.total;
		// ...
	} else {
		// Unable to compute progress information since the total size is unknown
	}
}

function transferComplete(evt) {
	// console.log("The transfer is complete.");
	var ss = "" + evt;
	//if(evt.lengthComputable && evt.loaded === evt.total)
	{
		histAdd("Complete at " + "comp  " + evt.lengthComputable + ", loaded " + evt.loaded + 
				", total " +  evt.total + new Date());
	}  

}

function transferFailed(evt) {
	console.log("An error occurred while transferring the file." + evt);
	var ss = "" + evt;
	if(ss.indexOf("ProgressEvent") < 0){
		histAdd("Failed at " + new Date() + " " + evt);
	}
}

function ontimeout(evt) {
	console.log("timed out. "+ evt);
	var ss = "" + evt;
	if(ss.indexOf("ProgressEvent") < 0){
		histAdd("Timeout at " + new Date() + " " + evt);
	}  
}

function transferCanceled(evt) {
	console.log("The transfer has been canceled by the user."+ evt);
	var ss = "" + evt;
	if(ss.indexOf("ProgressEvent") < 0){
		histAdd("Canceled at " + new Date() + " " + evt);
	}  
}

chrome.browserAction.onClicked.addListener(send1);

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function updateTab() {
	// console.log("send1 request" );
	// alert("sd22e");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if (tabs[0]) {
			currentTab = tabs[0];

			chrome.bookmarks.search({url: currentTab.url}, (bookmarks) => {
				currentBookmark = bookmarks[0];
				updateIcon();
			});
		}
	});
}

//TODO listen for bookmarks.onCreated and bookmarks.onRemoved once Bug 1221764
//lands ??

//listen to tab URL changes
chrome.tabs.onUpdated.addListener(updateTab);

//listen to tab switching
chrome.tabs.onActivated.addListener(updateTab);

//update when the extension loads initially
updateTab();

function get1(s, d){
	if(s === null || !s || s === "undefined"){
		return d;
	}else{
		var ss = escapeHTML(s);
		return ss;
	}
}

// Params from options or defaults
function fillHerUp() {
	try{
		
		chrome.storage.local.get(null, (res) => {
			opts.url = get1(res.url, 'http://localhost:8080/urlConsumer/');
			opts.p1 = get1(res.p1, 'def1');
			opts.p2 = get1(res.p2 , 'def2');
			
			if(res.ehist ===null || res.ehist || res.ehist == 'true'){
				opts.ehist = true;
			}else{
				opts.ehist = false;
			}
			if(res.estat ===null || res.estat || res.estat == 'true'){
				opts.estat = true;
			}else{
				opts.estat = false;
			}	
			if(res.atabDet ===null || res.atabDet || res.atabDet == 'true'){
				opts.atabDet = true;
			}else{
				opts.atabDet = false;
			}
			
		});
		
		
	}catch(e){
		console.log("err filler her up:" + e);
		// sendReqGetQuiet("fillher up err ", e)

	}

	opts.url = "" + opts.url  
	if(opts.url === "undefined" || opts.url === "aurl" ){
		opts.url = 'http://localhost:8080/urlConsumer/';
		opts.ehist = 1;
		opts.estat = 1;
		opts.atabDet = 1;
		if(errCnt < 10){
			console.log("Err filler her up defaults. (This msg will display few times only)");	
			errCnt++;
		}
	}
}

var errCnt = 1;
function histAdd(ss) {
	// console.log("e hist add 1");
	if(opts.ehist === false){
		hist = [];
		dbg1 = "hist false";	
	}else{
		hist.push(oCurrCheck.url + " "  + ss);
		while(hist.length > 16){
			hist.shift();
		}
		// hist.push("last");
		dbg1 = "hist true len :" + hist.length + ".";
	}

	chrome.storage.local.set({
		histAr : hist
	});
	// console.log("e hist add end");
}
