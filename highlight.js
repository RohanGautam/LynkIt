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

/* Move the div to the mouse */
function mhHandleMouseMove(event) {
    newX = event.pageX - circleRadius;
    newY = event.pageY - circleRadius;
    console.log("X: "+newX+" Y:"+newX)
    mhNewPointer.style.left = newX + 'px';
    mhNewPointer.style.top = newY + 'px';
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
    mhNewPointer.style.zIndex = '-1';
    mhNewPointer.style.pointerEvents = 'none';
}