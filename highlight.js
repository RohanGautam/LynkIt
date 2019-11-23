/*
Inspect console of page it's currently deployed in.
Run `example.html` to see a bare-bones action
*/

// $("#start_select").click(function () {
//     $("#select_canvas").show();
// });

// $('*').bind('selectstart', false);

// var start = null;
// var ctx = $("#select_canvas").get(0).getContext('2d');
// ctx.globalAlpha = 0.5;

// $("#select_canvas").mousedown(function (e) {
//     start = [e.offsetX, e.offsetY];

// }).mouseup(function (e) {
//     end = [e.offsetX, e.offsetY];

//     var x1 = Math.min(start[0], end[0]),
//         x2 = Math.max(start[0], end[0]),
//         y1 = Math.min(start[1], end[1]),
//         y2 = Math.max(start[1], end[1]);

//     var grabbed = [];
//     $('*').each(function () {
//         if (!$(this).is(":visible")) return;

//         var o = $(this).offset(),
//             x = o.left,
//             y = o.top,
//             w = $(this).width(),
//             h = $(this).height();

//         console.log(this, x, x + w, y, y + h);
//         console.log(x1, x2, y1, y2);
//         if (x > x1 && x + w < x2 && y > y1 && y + h < y2) {
//             grabbed.push(this);
//         }
//     });
//     console.log(grabbed);

//     start = null;

//     $(this).hide();

// }).mousemove(function (e) {
//     if (!start) return;

//     ctx.clearRect(0, 0, this.offsetWidth, this.offsetHeight);
//     ctx.beginPath();

//     var x = e.offsetX,
//         y = e.offsetY;

//     ctx.rect(start[0], start[1], x - start[0], y - start[1]);
//     ctx.fill();
// });



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
    
    $('*').each(function () {
        if (!$(this).is(":visible")) return;    
        var o = $(this).offset(),
            x = o.left,
            y = o.top,
            w = $(this).width(),
            h = $(this).height();
        var topLeft = [x,y]
        var topRight = [x+w,y]
        var bottomLeft = [x,y+h]
        var bottomRight = [x+w, y+h]
        if ($(this).is("a")) { 
            partInCircle =  inCircle(X,Y,topLeft) || inCircle(X,Y,topRight) || inCircle(X,Y,bottomLeft) || inCircle(X,Y,bottomRight)
            // console.log(this, "left:",x, "right",x + w,"top", y, "bottom",y + h);
            console.log(this, "in circle:", partInCircle)
        }
    });    
}


// var html = document.body

// var $html = jQuery(html);

// var links = [];
// $html.find('a').each(function(){
//     console.log(this);      
//     console.log(this.href);
//     //links.push(this.href); 
// });