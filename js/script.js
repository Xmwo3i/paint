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
    const shapeButtons = this.document.querySelectorAll("button"); 

    let colourSelected;
    let shapeSelected; 
    let sizeX;
    let sizeY; 


    // add event listener to the canvas
    colour.addEventListener("change", (e)=>{
        colourSelected = e.target.value; 
    });
    shapeButtons.forEach(button=>{
        button.addEventListener("click", (e)=>{
            shapeSelected = e.target.id;
        });
    });
    c.addEventListener("mousedown", (e)=>{
        sizeX = e.offsetX;
        sizeY = e.offsetY; 
    });
    c.addEventListener("mouseup" , (e)=>{
        sizeX = Math.abs(sizeX - e.offsetX);
        sizeY = Math.abs(sizeY - e.offsetY); 
     
        console.log(sizeX);
        console.log(sizeY);
    });

    c.addEventListener("click", (e)=>{
        
        let xCoordinate = e.offsetX;
        let yCoordinate = e.offsetY;

        if (shapeSelected === "rectangle"){
            let rectangle = new Rectangle(xCoordinate, yCoordinate, sizeX, sizeY, colourSelected);
            rectangle.draw();
        }
        if (shapeSelected === "triangle"){
            let triangle = new Triangle(); 
            triangle.draw();
        }
        if (shapeSelected === "circle"){
            let circle = new Circle(xCoordinate, yCoordinate, 5, colourSelected); 
            circle.draw();
        }
        if (shapeSelected === "line"){
            let line = new Line(); 
            line.draw();
        }

    });

    // add event listeners to buttons

 

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
            ctx.arc(this.x, this.y, this.radius,0, Math.PI*2);
            ctx.closePath();
            ctx.fill();
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