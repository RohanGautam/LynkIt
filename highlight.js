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
    // console.log("X: "+newX+" Y:"+newX)
    mhNewPointer.style.left = newX + 'px';
    mhNewPointer.style.top = newY + 'px';

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
    linkViewer.style.backgroundColor = '#000000';
    linkViewer.style.width = `${circleDiameter}px`;
    linkViewer.style.height = `${circleDiameter}px`;
    linkViewer.style.opacity = 0.35;
    linkViewer.style.borderRadius = `2px`;
    linkViewer.style.borderColor = "#000000"
    linkViewer.style.zIndex = '999999';
    linkViewer.style.pointerEvents = 'none';
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
    // remove all children from link viewer
    while (linkViewer.firstChild) {
        linkViewer.removeChild(linkViewer.firstChild);
    }
    // TODO : optimise this! this makes it very slow since were calculating it every time.
    jQuery.each(elements,function (index,item) {
        if (!$(item).is(":visible")) return;    
        var o = $(item).offset(),
            x = o.left,
            y = o.top,
            w = $(item).width(),
            h = $(item).height();
        var topLeft = [x,y]
        var topRight = [x+w,y]
        var bottomLeft = [x,y+h]
        var bottomRight = [x+w, y+h]

        if ($(item).is("a")) { 
            partInCircle =  inCircle(X,Y,topLeft) || inCircle(X,Y,topRight) || inCircle(X,Y,bottomLeft) || inCircle(X,Y,bottomRight)
            // console.log(this, "left:",x, "right",x + w,"top", y, "bottom",y + h);
            console.log($(item).text(), "in circle:", partInCircle)
            
            if(partInCircle){
                var container = document.createElement("span");
                var text = document.createTextNode($(item).text());
                container.appendChild(text);
                container.appendChild(document.createElement("br")); // adding a line break
                container.style.color = "red";
                linkViewer.appendChild(container);
            }
        }
    });    
}