/*
Inspect console of page it's currently deployed in.
Run `example.html` to see a bare-bones action
*/

document.onmousemove = mhHandleMouseMove;

var circleRadius = 50; // adjust this to set radius of region
var circleDiameter = circleRadius*2;
/* Draw a div */
var mhNewPointer = document.createElement('div');
mhNewPointer.id = 'mouse';
mhStyleMouseHighlight();
document.getElementsByTagName('body')[0].appendChild(mhNewPointer);

var linkViewer = document.createElement('div');
linkViewer.id = 'tooltip';
linkViewerStyling();
document.getElementsByTagName('body')[0].appendChild(linkViewer);
var linkViewerItems = []

/** Block of code below to capture keystrokes and follow that link */
window.addEventListener('keyup', doKeyPress, false); //add the keyboard handler
var keycodes = {1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57};
function doKeyPress(e){
    var linkViewerLen = linkViewer.childElementCount // return index based len
    // do something only if linkviewer is currently showing stuff
	if ( linkViewerLen != 0 ){
        // TODO : what if >9 links in the region? hmmmmmm
		for (key in keycodes){
            if(key<=linkViewerLen && (e.keyCode == keycodes[key])){
                var item = linkViewerItems[key-1];
                // alert($(item).text() + " clicked"); // clicking takes to new instance of page, so console.log cant be seen. Hence, I used alert here for debugging
                item.click();                
            }
        }
	}
}

elements=[]
$(document).ready(function(){
    $('*').each(function () {
        if (!$(this).is(":visible")) return;    
        if ($(this).is("a")) { 
            elements.push(this)        
        }
    });
    // console.log(elements)  
})

/* Move the div to the mouse */
function mhHandleMouseMove(event) {
    X = event.pageX;
    Y = event.pageY;
    newX = X - circleRadius;
    newY = Y - circleRadius;
    mhNewPointer.style.left = newX + 'px';
    mhNewPointer.style.top = newY + 'px';
    // for the link viewer:
    newX = X + circleRadius;
    newY = Y + circleRadius;
    linkViewer.style.left = newX + 'px';
    linkViewer.style.top = newY + 'px';

    printLinks(X, Y);
}

/* Style the mouse div */
function mhStyleMouseHighlight() {
    mhNewPointer.style.position = 'absolute';
    mhNewPointer.style.backgroundColor = '#000000';
    mhNewPointer.style.width = `${circleDiameter}px`;
    mhNewPointer.style.height = `${circleDiameter}px`;
    mhNewPointer.style.opacity = 0.25;
    mhNewPointer.style.borderRadius = `${circleDiameter}px`;
    mhNewPointer.style.borderColor = "#000000"
    mhNewPointer.style.zIndex = '999999';
    mhNewPointer.style.pointerEvents = 'none';
}

function linkViewerStyling() {
    linkViewer.style.position = 'absolute';
    linkViewer.style.backgroundColor = '#191970'; // FF for transparency
    linkViewer.style.padding = "10px"
    // linkViewer.style.width = `${circleDiameter}px`;
    // linkViewer.style.height = `${circleDiameter}px`;
    linkViewer.style.opacity = 1;
    linkViewer.style.borderRadius = `20px`;
    // linkViewer.style.borderColor = "#000000"
    linkViewer.style.zIndex = '999999';
    linkViewer.style.pointerEvents = 'none';
}

function clearLinkViewerNodes() {
    // remove all children from link viewer
    while (linkViewer.firstChild) {
        linkViewer.removeChild(linkViewer.firstChild);
    }
    linkViewerItems = []
}

function addItemTextToLinkViewer(item) {
    text_str = $(item).text();
    linkViewerItems.push(item);
    var index  = (linkViewer.childElementCount +1) + ". ";
    text_str = index+text_str;
    // create a textnode and container, as can't modify properties of textnode directly
    var container = document.createElement("span");
    var text = document.createTextNode(text_str);
    //style the container, and thus the text with it
    container.style.fontSize = 40+"px";
    container.appendChild(text);
    container.appendChild(document.createElement("br")); // adding a line break
    container.style.color = "#FFFFFF";
    // add it to the link viewer
    linkViewer.appendChild(container);
}

function getCoordsToCheck(x, y, width, height) {
    var threshold = circleDiameter;
    // basic points to check
    var topLeft = [x,y];
    var topRight = [x+width,y];
    var bottomLeft = [x,y+height];
    var bottomRight = [x+width, y+height];
    coords = [topLeft, topRight, bottomLeft, bottomRight];

    if (width > threshold){
        //we need to add more points to check. We need only as many more points as the circle can cover in one time. 
        var extraPtsNeeded = Math.floor(width/circleDiameter);
        for (var i = 0; i<extraPtsNeeded; i+=1){
            //add points along the width, both top and bottom
            coords.push([x + circleDiameter*(i+1), y]);
            coords.push([x + circleDiameter*(i+1), y+height]);
        }
    }

    if (height > threshold){
        //we need to add more points to check. We need only as many more points as the circle can cover in one time. 
        var extraPtsNeeded = Math.floor(height/circleDiameter);
        for (var i = 0; i<extraPtsNeeded; i+=1){
            //add points along the height, both left and right
            coords.push([x, y + circleDiameter*(i+1)]);
            coords.push([x+width, y + circleDiameter*(i+1)]);
        }
    }

    return coords;
}

function coordsInCircle(X, Y, coords) {
    for (var  i = 0; i< coords.length; i+=1){
        coord = coords[i];
        // if any point is in the circle, return true
        if(inCircle(X,Y,coord)==true){
            return true;
        }
    }
    return false;    
}


function inCircle(A,B, point) {
    /**
     * A,B- coordinates of the center of the circle 
     * point = [x,y] - coordinates of another point
     * */
    x=point[0]
    y= point[1]
    return ((x-A)**2 + (y-B)**2)<(circleRadius**2);
    
}

function printLinks(X,Y) {    
    clearLinkViewerNodes()
    // TODO : optimise this! this makes it very slow since were calculating it every time.
    jQuery.each(elements,function (index,item) {
        if (!$(item).is(":visible")) return;    
        
        if ($(item).is("a")) { 
            var o = $(item).offset(),
                x = o.left,
                y = o.top,
                w = $(item).width(),
                h = $(item).height();            
            coords = getCoordsToCheck(x, y, w, h); // will include more points if longer element

            partInCircle =  coordsInCircle(X, Y, coords)
            // console.log(this, "left:",x, "right",x + w,"top", y, "bottom",y + h);
            // console.log($(item).text(), "in circle:", partInCircle, " coords : ", coords)
            if(partInCircle){
                addItemTextToLinkViewer(item);
            }
        }
    });    
}