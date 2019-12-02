var vid = document.getElementById('videoElement');
var vid_width = vid.width;
var vid_height = vid.height;
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');

document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('clickIt');
    $(document).ready(function () {
        // For the video feed
        setupCam() // delay in ms
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
    }).then(gumSuccess).catch((error) => {
        console.warn(error);
        gumFail();
    });
}

vid.addEventListener('canplay', enablestart, false);
document.getElementById("startbutton").addEventListener("click", startVideo);

/*********** Code for face tracking *********/
var ctrack = new clm.tracker();
ctrack.init();
var trackingStarted = false;

function enablestart() {
    var startbutton = document.getElementById('startbutton');
    startbutton.value = "start";
    startbutton.disabled = null;
}

function adjustVideoProportions() {
    // resize overlay and video if proportions of video are not 4:3
    // keep same height, just change width
    var proportion = vid.videoWidth / vid.videoHeight;
    vid_width = Math.round(vid_height * proportion);
    vid.width = vid_width;
    overlay.width = vid_width;
}

function gumSuccess(stream) {
    // add camera stream if getUserMedia succeeded
    if ("srcObject" in vid) {
        vid.srcObject = stream;
    } else {
        vid.src = (window.URL && window.URL.createObjectURL(stream));
    }
    vid.onloadedmetadata = function () {
        adjustVideoProportions();
        vid.play();
    }
    vid.onresize = function () {
        adjustVideoProportions();
        if (trackingStarted) {
            ctrack.stop();
            ctrack.reset();
            ctrack.start(vid);
        }
    }
}

function gumFail() {
    alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
}

function startVideo() {
    console.log("starting video");
    // start video
    vid.play();
    // start tracking
    ctrack.start(vid);
    trackingStarted = true;
    // start loop to draw face
    drawLoop();
}

function drawLoop() {
    requestAnimFrame(drawLoop);
    overlayCC.clearRect(0, 0, vid_width, vid_height);
    if (ctrack.getCurrentPosition()) {
        // get points
        var positions = ctrack.getCurrentPosition();
        ctrack.draw(overlay);

        var pupilLeft = positions[27];
        var pupilRight = positions[32];

        // draw circles over eyes
        overlayCC.fillStyle = '#faa732';
        overlayCC.beginPath();
        overlayCC.arc(pupilLeft[0], pupilLeft[1], 20, 0, Math.PI * 2, true);
        overlayCC.arc(pupilRight[0], pupilRight[1], 20, 0, Math.PI * 2, true);
        overlayCC.closePath();
        overlayCC.fill();
    }
}