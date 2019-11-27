document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('clickIt');
    checkPageButton.addEventListener('click', function () {
        var background = chrome.extension.getBackgroundPage();
        var query = { active: true, currentWindow: true };
        chrome.tabs.query(query, function(tabs){
            background.main(tabs[0]);
        });
        window.close(); // to close the popup on click of this button - dont do it if using popup window for something.
    }, false);
}, false);