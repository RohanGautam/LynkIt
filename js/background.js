chrome.browserAction.onClicked.addListener();

function main(tab) {
  chrome.tabs.executeScript(null, { file: "../external/jquery-3.4.1.min.js" }, function () {
        chrome.tabs.executeScript(tab.id, { file: "highlight.js" });
      });
}