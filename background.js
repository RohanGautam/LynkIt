chrome.browserAction.onClicked.addListener();

function main(tab) {
    chrome.tabs.executeScript(null, { file: "external/jquery-3.4.1.min.js" }, function() {
        chrome.tabs.executeScript(tab.id, {file: "highlight.js"});
    });
}

// Do first-time setup to gain access to webcam, if necessary.
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason.search(/install/g) === -1) {
      return;
    }
    chrome.tabs.create({
      url: chrome.extension.getURL('welcome.html'),
      active: true
    });
  });