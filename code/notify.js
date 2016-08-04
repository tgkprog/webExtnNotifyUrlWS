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
	console.log("send1 request" );
		var t = true;
		if(oCurrCheck !=  currentTab){
				chrome.storage.local.set({
					status : "Starting at " + new Date() + "."
					});
				oCurrCheck = currentTab;
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("load", load1);
				oReq.addEventListener("progress", updateProgress);
				oReq.addEventListener("load", transferComplete);
				oReq.addEventListener("error", transferFailed);
				oReq.addEventListener("abort", transferCanceled);
				
				//oReq.open("GET", "http://localhost:8080/urlConsumer/" + "?p=" + encodeURI(currentTab.url) + "&w=" +  + encodeURI(new Date()) + "&g=" + JSON.stringify(currentTab)
				//+ "&v=6" +  opts.url);
				var ss = opts.url + "?p=" + encodeURI(currentTab.url) + "&w=" +  + encodeURI(new Date());
				if(opts.atabDet){
					ss += "&g=" + JSON.stringify(currentTab);
				}
				ss += "&v=9_atabDet_" + opts.atabDet + "_url_" + opts.url + "_ehist_" + opts.ehist + ". " + (opts.ehist === false) + ". dbg1 " +  dbg1  + "." ;
				oReq.open("GET", ss );
				oReq.send(null);
				//console.log(debugCnt + " send1 " + window.location.href);
				histAdd("Starting at " + new Date());
				//document.write(" " + new Date())
			}    
	}catch(e){
		console.log("send1 err" + e);
	        
	}
}
	
	
	function load1(s){
		console.log("load done:" + s);
}

// progress on transfers from the server to the client (downloads)
function updateProgress (oEvent) {
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
    // ...
  } else {
    // Unable to compute progress information since the total size is unknown
  }
}

function transferComplete(evt) {
  console.log("The transfer is complete.");
  var ss = "" + evt;
  if(ss.indexOf("ProgressEvent") < 0){
	histAdd("Complete at " + new Date());
  }  
  
}

function transferFailed(evt) {
  console.log("An error occurred while transferring the file." + evt);
  var ss = "" + evt;
  if(ss.indexOf("ProgressEvent") < 0){
	histAdd("Failed at " + new Date() + " " + evt);
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
  console.log("send1 request" );
  //alert("sd22e");
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

// TODO listen for bookmarks.onCreated and bookmarks.onRemoved once Bug 1221764 lands

// listen to tab URL changes
chrome.tabs.onUpdated.addListener(updateTab);

// listen to tab switching
chrome.tabs.onActivated.addListener(updateTab);

// update when the extension loads initially
updateTab();


function fillHerUp() {
 try{
		//opts= {};
	chrome.storage.local.get(null, (res) => {
    opts.url = res.url || 'http://localhost:8080/urlConsumer/';
	hist = res.histAr;
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
	//(res.savDate)
  });
 
		
 }catch(e){
		console.log("err filler her up:" + e);
		var oReq1 = new XMLHttpRequest();								
	    oReq1.open("GET", "http://localhost:8080/urlConsumer/?p=" + e);
		oReq1.send(null);
 }
 
  opts.url = "" + opts.url  
  if(opts.url === "undefined" || opts.url === "aurl" ){
	  opts.url = 'http://localhost:8080/urlConsumer/';
	  opts.ehist = 1;
	  opts.estat = 1;
	  opts.atabDet = 1;
  }
}

function histAdd(ss) {
	console.log("e hist add 1");
	if(opts.ehist === false){
		hist = [];
		dbg1 = "hist false";	
	}else{
		hist.push(oCurrCheck.url + " "  + ss);
		while(hist.length > 16){
			hist.shift();
		}
		//hist.push("last");
		dbg1 = "hist true len " + hist.length;
	}
	
	chrome.storage.local.set({
		histAr : hist
	});
	console.log("e hist add end");
}