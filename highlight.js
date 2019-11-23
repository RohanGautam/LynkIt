/*
Inspect console of page it's currently deployed in.
Run `example.html` to see a bare-bones action
*/



document.onmousemove = mhHandleMouseMove;

/* Draw a div */
var mhNewPointer = document.createElement('div');
mhNewPointer.id = 'mouse';
mhStyleMouseHighlight();
document.getElementsByTagName('body')[0].appendChild(mhNewPointer);

/* Move the div to the mouse */
function mhHandleMouseMove(event) {
    newX = event.pageX - 25;
    newY = event.pageY - 25;
    console.log("X: "+newX+" Y:"+newX)
    mhNewPointer.style.left = newX + 'px';
    mhNewPointer.style.top = newY + 'px';
}

/* Style the mouse div */
function mhStyleMouseHighlight() {
    mhNewPointer.style.position = 'absolute';
    mhNewPointer.style.backgroundColor = '#000000';
    mhNewPointer.style.width = '50px';
    mhNewPointer.style.height = '50px';
    mhNewPointer.style.opacity = 0.25;
    mhNewPointer.style.borderRadius = '100px';
    mhNewPointer.style.borderColor = "#000000"
    mhNewPointer.style.zIndex = '2147483647';
    mhNewPointer.style.pointerEvents = 'none';
}