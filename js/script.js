window.addEventListener("load", function(event){
    // get context from canvas
    const c = this.document.getElementById("canvas");
    let ctx = c.getContext("2d");

    // retrieve DOM elements
    const trianglebutton = this.document.getElementById("triangle");
    const rectanglebutton = this.document.getElementById("rectangle");
    const circlebutton = this.document.getElementById("circle");
    const linebutton = this.document.getElementById("line");

    // add event listeners to buttons

    rectanglebutton.addEventListener("click", (e)=>{
        Rectangle.draw();
    });

    circlebutton.addEventListener("click", (e)=>{
        Circle.draw();
    }); 
    trianglebutton.addEventListener("click",(e)=>{
        Triangle.draw(); 
    });
    linebutton.addEventListener("click", (e)=>{
        Line.draw();
    })

    // triangle, circle, rectangle, line, brush
    class Shape {
        constructor(colour) {
            this.colour = colour;
        }
    }

    class Rectangle extends Shape {
        constructor(x, y, width, height, colour) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            super(colour);
        }
        draw() {
            ctx.fillStyle = colour;
            ctx.fillRect(this.x, this.y, this.width, this.height); 
        }
    }

    class Circle extends Shape  {
        constructor(x, y, radius, colour) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            super(colour);
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = colour;
            ctx.arc(this.x, this.y, 0, this.radius, Math.PI*2);
            ctx.closePath();
        }
    }

    class Line extends Shape {
        constructor(xStart, yStart, xEnd, yEnd, strokeWidth, colour) {
            this.xStart = xStart;
            this.yStart = yStart;
            this.xEnd = xEnd;
            this.yEnd = yEnd;
            this.strokeWidth = strokeWidth;

            super(colour);
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.xStart, this.yStart);
            ctx.lineTo(this.xEnd, this.yEnd);
            ctx.strokeWidth(this.strokeWidth);
            ctx.strokeStyle (colour);
            ctx.stroke(); 
        }
    }

    class Brush {
        constructor(brushShape) {
            this.brushShape = brushShape;
        }

    }

})