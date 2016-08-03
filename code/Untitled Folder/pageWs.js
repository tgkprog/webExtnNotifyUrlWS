/*
 * 
 * about:debugging#addons
 * */
var debugCnt = 8;
if(debugCnt %3 ==1){
	document.body.style.border = "5px solid pink";
}else if(debugCnt %3 == 2){
	document.body.style.border = "5px solid blue";
}else if(debugCnt %3 ==0){
	document.body.style.border = "5px solid green";
}
var currentTab=0;
console.log(debugCnt + " B3 " + window.location.href);


//send1() ;
function send1(request, sender, sendResponse) {
	try{
			console.log("send1 request" + request);
		var t = true;
		if(t || currentTab !=  window.location.href){
				currentTab = window.location.href;
				
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("load", load1);
				oReq.addEventListener("progress", updateProgress);
				oReq.addEventListener("load", transferComplete);
				oReq.addEventListener("error", transferFailed);
				oReq.addEventListener("abort", transferCanceled);
				oReq.open("GET", "http://localhost:8080/pageNotify/?p=" + encodeURI(currentTab) + "&w=" +  + encodeURI(new Date()) + "&fg");
				oReq.send(null);
				console.log(debugCnt + " send1 " + window.location.href);
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

try{
	console.log(debugCnt + " B4 " + window.location.href);
	chrome.runtime.onMessage.addListener(send1);
	//chrome.browserAction.onClicked.addListener(send1);
	console.log(debugCnt + " B5 " + window.location.href);
}catch(e){
	console.log("C3 err" + e);
	
}
function updateTab() {
	try{
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  console.log("updateTab :" + tabs[0]);
		if (tabs[0]) {
			if(currentTab != tabs[0]){
				currentTab = tabs[0];
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("load", load1);
				oReq.open("GET", "http://localhost:8080/pageNotify/?p=" + encode(currentTab));
				oReq.send();
				console.log("a " + window.location.href);
			}

		  chrome.bookmarks.search({url: currentTab.url}, (bookmarks) => {
			
		  });
		}
	  });
  
  }catch(e){
	console.log("udate tab err" + e);
	
  }
}


console.log("C 1 " + window.location.href);
// TODO listen for bookmarks.onCreated and bookmarks.onRemoved once Bug 1221764 lands
try{
	// listen to tab URL changes
	chrome.tabs.onUpdated.addListener(updateTab);
	// listen to tab switching
	chrome.tabs.onActivated.addListener(updateTab);
	console.log("C 3" + window.location.href);

	// update when the extension loads initially

	updateTab();
	console.log("C " + window.location.href);

}catch(e){
	console.log("C2 err" + e);
}
console.log("C2 " + window.location.href);

