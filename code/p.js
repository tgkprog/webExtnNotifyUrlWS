//send1() ;
var currentTab;
var oCurrCheck = null;
function send1() {
 try{
			console.log("send1 request" );
		var t = true;
		if(oCurrCheck !=  currentTab){
				
				oCurrCheck = currentTab;
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("load", load1);
				oReq.addEventListener("progress", updateProgress);
				oReq.addEventListener("load", transferComplete);
				oReq.addEventListener("error", transferFailed);
				oReq.addEventListener("abort", transferCanceled);
				oReq.open("GET", "http://localhost:8080/pageNotify/?p=" + encodeURI(currentTab.url) + "&w=" +  + encodeURI(new Date()) + "&g=" + JSON.stringify(currentTab));
				oReq.send(null);
				console.log(debugCnt + " send1 " + window.location.href);
				document.write(" " + new Date())
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
}

function transferFailed(evt) {
  console.log("An error occurred while transferring the file." + evt);
}

function transferCanceled(evt) {
  console.log("The transfer has been canceled by the user."+ evt);
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
