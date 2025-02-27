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
    

    // triangle, circle, rectangle, line, brush
    class Shape {
        constructor(colour) {
            this.colour = colour;
        }
        draw() {
            
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
        drawRect() {
            ctx.fillStyle = colour;
            ctx.strokeRect(this.x, this.y, width, height);
        }
    }

    class Circle extends Shape  {
        constructor(x, y, radius, colour) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            super(colour);
        }
        drawCircle() {
            ctx.fillStyle = colour; 
        }
    }

    class Line extends Shape {
        constructor(x, y, colour) {
            this.x = x;
            this.y = y;
            super(colour);
        }
        drawLine() {
            ctx.strokeStyle = colour;
        }
    }

    class Brush {
        constructor(brushShape) {
            this.brushShape = brushShape;
        }
    }

})