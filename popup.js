document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('clickIt');
    $(document).ready(function () {
        // For the video feed
        setupCam()
        //For the radio buttons
        var firstVal = $('input:radio[name=selectionMechanism]:checked').val();
        console.log(firstVal);
        // TODO: face selected every time clicked again... how do I remember what it was before?
        $('input:radio[name=selectionMechanism]').change(function () {
            if (this.value == 'keyboard') {
                keyboardUseHandler()
            }
            else if (this.value == 'face') {
                console.log("face pressed");
            }
        });
    });
    // checkPageButton.addEventListener('click', function () {        
    // }, false);
}, false);


function keyboardUseHandler() {
    var background = chrome.extension.getBackgroundPage();
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function (tabs) {
        background.main(tabs[0]);
    });
    setTimeout(function () {
        window.close();// to close the popup on click of this button - dont do it if using popup window for something.
    }, 400); // delay in ms
}

function setupCam() {
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then(mediaStream => {
        document.querySelector('#videoElement').srcObject = mediaStream;
    }).catch((error) => {
        console.warn(error);
    });
}