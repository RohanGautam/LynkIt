var nextTimer;

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, { file: "jquery-3.4.1.min.js" }, function() {
        chrome.tabs.executeScript(tab.id, {file: "highlight.js"});
    });
});