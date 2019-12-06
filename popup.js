var vid = document.getElementById('videoElement');
var vid_width = vid.width;
var vid_height = vid.height;
// tracker canvas and context
var trackerCanvas = document.getElementById('trackerCanvas');
var trackerContext = trackerCanvas.getContext('2d');
// eye canvas and context
var eyeCanvas = document.getElementById('eyeCanvas');
var eyeContext = eyeCanvas.getContext('2d');
// black and white canvas and context
var bwCanvas = document.getElementById('bwCanvas');
var bwContext = bwCanvas.getContext('2d');
// threshold canvas and context
var thCanvas = document.getElementById('thCanvas');
var thContext = thCanvas.getContext('2d');
// old canvas and context
oldCanvas = document.getElementById('oldCanvas');
oldContext = oldCanvas.getContext('2d');
// cur canvas and context
curCanvas = document.getElementById('curCanvas');
curContext = curCanvas.getContext('2d');

var eyeRect, interval, oldData, curData;
var settings = {
    contrast: 3,
    brightness: 0.5,
    threshold: 80,
};

document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('clickIt');
    $(document).ready(function () {
        // For the video feed
        initialSetup() // delay in ms
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

function initialSetup() {
    // Set up the camera
    setupCam();
    // initialize eye rect
    eyeRect = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    };
    interval = setInterval(correlation, 100);
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
    startVideo() // TODO: remove this, it's for debugging
}

function adjustVideoProportions() {
    // resize overlay and video if proportions of video are not 4:3
    // keep same height, just change width
    var proportion = vid.videoWidth / vid.videoHeight;
    vid_width = Math.round(vid_height * proportion);
    vid.width = vid_width;
    trackerCanvas.width = vid_width;
}

function correlation() {
    if (curData) {
        oldData = curData;
    }

    curData = thContext.getImageData(0, 0, thContext.canvas.width, thContext.canvas.height);
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
    trackerContext.clearRect(0, 0, vid_width, vid_height);
    eyeContext.clearRect(0, 0, eyeContext.canvas.width, eyeContext.canvas.height);
    bwContext.clearRect(0, 0, bwContext.canvas.width, bwContext.canvas.height);
    thContext.clearRect(0, 0, thContext.canvas.width, thContext.canvas.height);
    oldContext.clearRect(0, 0, oldContext.canvas.width, oldContext.canvas.height);
    curContext.clearRect(0, 0, curContext.canvas.width, curContext.canvas.height);

    if (ctrack.getCurrentPosition()) {
        // get points
        var positions = ctrack.getCurrentPosition();
        ctrack.draw(trackerCanvas);

        eyeRect.x = positions[23][0];
        eyeRect.y = positions[24][1];
        eyeRect.w = positions[25][0] - positions[23][0];
        eyeRect.h = positions[26][1] - positions[24][1];

        eyeContext.drawImage(trackerCanvas, eyeRect.x, eyeRect.y, eyeRect.w, eyeRect.h, 0, 0, eyeContext.canvas.width, eyeContext.canvas.height)

        // black and white
        var data = CanvasFilters.getPixels(eyeCanvas);
        var grayscale = CanvasFilters.grayscale(data, settings.contrast, settings.brightness);
        bwContext.putImageData(grayscale, 0, 0);
        
        // threshold
        var data = CanvasFilters.getPixels(eyeCanvas);
        var grayscale = CanvasFilters.grayscale(data, settings.contrast, settings.brightness);
        var threshold = CanvasFilters.threshold(grayscale, settings.threshold);
        thContext.putImageData(threshold, 0, 0);
        
        // draw old data set
        if (oldData) {
            oldContext.putImageData(oldData, 0, 0);
        }

        // draw cur data set
        if (curData) {
            curContext.putImageData(curData, 0, 0);
        }
    }
}