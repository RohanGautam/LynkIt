document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('clickIt');
    $(document).ready(function () {
        //For the radio buttons
        var firstVal = $('input:radio[name=selectionMechanism]:checked').val();
        console.log(firstVal);
        if (firstVal == 'keyboard') {
            keyboardUseHandler()
        }
    });
}, false);


function keyboardUseHandler() {
    var background = chrome.extension.getBackgroundPage();
    var query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function (tabs) {
        background.main(tabs[0]);
    });
    // setTimeout(function () {
    //     window.close();// to close the popup on click of this button - dont do it if using popup window for something.
    // }, 400); // delay in ms
}