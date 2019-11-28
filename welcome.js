navigator.mediaDevices.getUserMedia({
    video: true
}).then(stream => {
    document.querySelector('#status').innerHTML =
        'Webcam access granted for extension, closing tab..';

    // chrome.storage.local.remove(["camAccess"], function () {
    //     var error = chrome.runtime.lastError;
    //     if (error) {
    //         console.error(error);
    //     }
    // })
    // chrome.storage.local.clear() // TODO : clear storage for testing , these dont work. At the moment, it automatically gets permission
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