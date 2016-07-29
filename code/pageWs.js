document.body.style.border = "5px solid red";
var currentTab;
console.write("a " + window.url);

function load(s){
		console.write("load :" + s);
}

function updateTab() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
		if(currentTab != tabs[0]){
            currentTab = tabs[0];
            var oReq = new XMLHttpRequest();
			oReq.addEventListener("load", reqListener);
			oReq.open("GET", "http://localhost:8080/pageNotify/?p=" + encode(currentTab));
			oReq.send();
		}

      chrome.bookmarks.search({url: currentTab.url}, (bookmarks) => {
        
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
