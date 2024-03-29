// chrome.storage.sync.clear();
disableButton = document.getElementById("disablebutton");
disableButton.addEventListener("click", disableExtension);

function showDisableButton() {
    disableButton.style.display = "inline"; 
    document.getElementById("extensionTitle").innerHTML = "LynkIt enabled!"; 
    
}
function hideDisableButton() {
    disableButton.style.display = "none";
    document.getElementById("extensionTitle").innerHTML = "LynkIt disabled"; 
    document.getElementById("selectPrompt").innerHTML = "Select input mechanism:"; 
}

document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('clickIt');
    $(document).ready(function () {
        //initially hide disable button
        hideDisableButton()
        //For the radio buttons
        chrome.storage.sync.get("selectionMechanism", function (items) {
            console.log(items);            
            // alert('changing type')
            if (items.selectionMechanism == "keyboard") {
                $('input[type="radio"]').prop('checked', true);                      
                showDisableButton()
            }
        });
        // var firstVal = $('input:radio[name=selectionMechanism]:checked').val();
        // console.log(firstVal);
        // if (firstVal == 'keyboard') {            
        //     keyboardUseHandler();
        // }
        $('input:radio[name=selectionMechanism]').change(function () {
            showDisableButton()
            if (this.value == 'keyboard') {
                keyboardUseHandler()
            }
        });
    });
}, false);


function keyboardUseHandler() {
    storeUserSelectionChoice('keyboard');
    // alert('sending message')
    // chrome.tabs.query({}, function(tabs) {
    //     var message = {"checkChoice": true};
    //     for (var i=0; i<tabs.length; ++i) {
    //         chrome.tabs.sendMessage(tabs[i].id, message);
    //     }
    // });
    // var background = chrome.extension.getBackgroundPage();
    // var query = { active: true, currentWindow: true };
    // chrome.tabs.query(query, function (tabs) {
    //     background.main(tabs[0]);
    // });
    // setTimeout(function () {
    //     window.close();// to close the popup on click of this button - dont do it if using popup window for something.
    // }, 400); // delay in ms
}

function storeUserSelectionChoice(choice) {
    chrome.storage.sync.clear(); // for testing, clearing prev storage
    var key = "selectionMechanism",
        val = choice
    var jsonfile = {};
    jsonfile[key] = val;
    chrome.storage.sync.set(jsonfile, function () {
        console.log('Saved', key, val);
        chrome.tabs.query({}, function(tabs) {
            var message = {"checkChoice": true};
            for (var i=0; i<tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, message);
            }
        });
    });
}

function disableExtension() {
    $('input[type="radio"]').prop('checked', false); 
    hideDisableButton()   
    storeUserSelectionChoice("null")
}