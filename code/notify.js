//send1() ; about:addons
var opts = {};
var currentTab;
var oCurrCheck = null;
var updateLvl = 0;
var hist = [];

function send1() {
 try{
		fillHerUp();
		console.log("send1 request" );
		var t = true;
		if(oCurrCheck !=  currentTab){
				  chrome.storage.local.set({
					status : "Starting at " + new Date() + ", " + evt;
					});
				updateLvl = 0;
				oCurrCheck = currentTab;
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("progress", updateProgress);
				oReq.addEventListener("load", transferComplete);
				oReq.addEventListener("error", transferFailed);
				oReq.addEventListener("abort", transferCanceled);
				var ss = opts.url + "?p=" + encodeURI(currentTab.url) + "&w=" +  + encodeURI(new Date());
				if(opts.atabDet){
					ss += "&g=" + JSON.stringify(currentTab);
				}
				oReq.open("GET", ss );
				oReq.send(null);
				console.log(debugCnt + " send1 " + window.location.href);
				document.write(" " + new Date())
			}    
	}catch(e){
		console.log("send1 err" + e);
	        
	}
}
	
// progress on transfers from the server to the client (downloads)
function updateProgress (oEvent) {
var ss = "Sending ...";
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
	ss += percentComplete + "%"

    // ...
  } else {
    // Unable to compute progress information since the total size is unknown
	ss += " " + (++updateLvl); 
  }
  	chrome.storage.local.set({
		status : ss
	});
	histAdd(ss);
}

function transferComplete(evt) {
  console.log("The transfer is complete.");
  chrome.storage.local.set({
		status : "Last send complete at " + new Date();
	});
	histAdd("Complete at " + new Date());
}

function transferFailed(evt) {
  console.log("An error occurred while transferring the file." + evt);
  chrome.storage.local.set({
		status : "Last send failed at " + new Date() + ", " + evt;
	});
	histAdd("Failed at " + new Date() + ", " + evt );
}

function transferCanceled(evt) {
  console.log("The transfer has been canceled by the user."+ evt);
  chrome.storage.local.set({
		status : "Last send canceled at " + new Date() + ", " + evt;
	});
	histAdd("Canceled at " + new Date() + ", " + evt );
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
	opts.ehist = res.ehist || 1;
	opts.estat = res.estat || 1;
	opts.atabDet = res.atabDet || 1;	
	//(res.savDate)
  });		
		
 }catch(e){
		console.log("err filler her up:" + e);
 }
}

function histAdd(ss) {
	if(!opts.ehist){
		hist = ["disabled"];		
	}else{
		hist.push(oCurrCheck.url + " "  + ss);
		while(hist.length > 10){
			hist.shift();
		}
		hist.push("last");
	}
	
	chrome.storage.local.set({
		histAr : hist
	});
}