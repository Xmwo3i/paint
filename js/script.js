window.addEventListener("load", function(event){
    // get context from canvas
    const c = this.document.getElementById("canvas");
    let ctx = c.getContext("2d");

    // retrieve DOM elements
    const trianglebutton = this.document.getElementById("triangle");
    const rectanglebutton = this.document.getElementById("rectangle");
    const circlebutton = this.document.getElementById("circle");
    const linebutton = this.document.getElementById("line");
    const colour = this.document.getElementById("colour");
    let colourSelected;
    const shapeButtons = this.document.querySelectorAll("button"); 
    let shapeSelected; 

    // add event listener to the canvas
    c.addEventListener("click", function(event){

    })
    colour.addEventListener("change", (e)=>{
        colourSelected = colour.value; 
    })
    shapeButtons.addEventListener("click", (e)=>{
        if (shapeSelected === "rectangle"){
            c.addEventListener("click", (e)=>{
                
            })
        }
        if (shapeSelected === "triangle"){

        }
        if (shapeSelected === "circle"){}

        if (shapeSelected === "line"){
        }

        
    })

    // add event listeners to buttons

    rectanglebutton.addEventListener("click", (e)=>{
        let rectangle = new Rectangle(10, 10, 10, 10, colourSelected);
        rectangle.draw();
        shapeSelected = "rectangle"; 
    });

    circlebutton.addEventListener("click", (e)=>{
        Circle.draw();
        shapeSelected = "circle"
    }); 
    trianglebutton.addEventListener("click",(e)=>{
        Triangle.draw(); 
        shapeSelected = "triangle"
    });
    linebutton.addEventListener("click", (e)=>{
        Line.draw();
        shapeSelected = "line"; 
    })

    // triangle, circle, rectangle, line, brush
    class Shape{
        constructor(colour){
            this.colour = colour;
        }
    }

    class Rectangle extends Shape {
        constructor(x, y, width, height, colour) {
            super(colour);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        draw() {
            ctx.fillStyle = this.colour;
            ctx.fillRect(this.x, this.y, this.width, this.height); 
        }
    }

    class Circle extends Shape  {
        constructor(x, y, radius, colour) {
            super(colour);
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = this.colour;
            ctx.arc(this.x, this.y, 0, this.radius, Math.PI*2);
            ctx.closePath();
        }
    }

    class Line extends Shape {
        constructor(xStart, yStart, xEnd, yEnd, strokeWidth, colour) {
            super(colour);
            this.xStart = xStart;
            this.yStart = yStart;
            this.xEnd = xEnd;
            this.yEnd = yEnd;
            this.strokeWidth = strokeWidth;

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