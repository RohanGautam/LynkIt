chrome.browserAction.onClicked.addListener();
//todo: this is not used as of now
// todo: make it follow into clicked links
function main(tab) {
  chrome.tabs.executeScript(null, { file: "external/jquery-3.4.1.min.js" }, function () {
    chrome.tabs.executeScript(tab.id, { file: "js/highlight.js" });
  });
}