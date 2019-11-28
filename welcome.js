navigator.mediaDevices.getUserMedia({
    video: true
}).then(stream => {
    document.querySelector('#status').innerHTML =
        'Webcam access granted for extension, closing tab..';

    chrome.storage.local.set({
        'camAccess': true
    }, () => { });

    setTimeout(function () {
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.remove(tab.id, function () { });
        });
    }, 400); // delay in ms
}).catch(err => {
    document.querySelector('#status').innerHTML =
        'Error getting webcam access for extension: ' + err.toString();
    console.error(err);
});