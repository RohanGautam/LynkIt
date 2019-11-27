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
    linkViewer.style.backgroundColor = '#000000'; // FF for transparency
    // linkViewer.style.width = `${circleDiameter}px`;
    // linkViewer.style.height = `${circleDiameter}px`;
    linkViewer.style.opacity = 1;
    linkViewer.style.borderRadius = `2px`;
    // linkViewer.style.borderColor = "#000000"
    linkViewer.style.zIndex = '999999';
    linkViewer.style.pointerEvents = 'none';
}

function clearLinkViewerNodes() {
    // remove all children from link viewer
    while (linkViewer.firstChild) {
        linkViewer.removeChild(linkViewer.firstChild);
    }
}

function addTextToLinkViewer(text_str) {
    // create a textnode and container, as can't modify properties of textnode directly
    var container = document.createElement("span");
    var text = document.createTextNode(text_str);
    //style the container, and thus the text with it
    container.style.fontSize = 40+"px";
    container.appendChild(text);
    container.appendChild(document.createElement("br")); // adding a line break
    container.style.color = "red";
    // add it to the link viewer
    linkViewer.appendChild(container);
}

function getCoordsToCheck(x, y, w, h) {
    // basic points to check
    var topLeft = [x,y];
    var topRight = [x+w,y];
    var bottomLeft = [x,y+h];
    var bottomRight = [x+w, y+h];
    coords = [topLeft, topRight, bottomLeft, bottomRight];
    return coords;
}

function coordsInCircle(X, Y, coords) {
    for (var  i = 0; i< coords.length; i+=1){
        coord = coords[i];
        // if any point is in the circle:
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
            console.log($(item).text(), "in circle:", partInCircle, " coords : ", coords)
            
            if(partInCircle){
                text_str = $(item).text();

                // //example of programatic clicking
                // if(text_str=="Link 1"){
                //     item.click();
                // }
                addTextToLinkViewer(text_str);
            }
        }
    });    
}