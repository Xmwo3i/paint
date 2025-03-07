window.addEventListener("load", function (event) {
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
    let xCoordinate;
    let yCoordinate;
    let isDrawing = false;
    let currentRectangle = null;
    let startX, startY;
    let endX, endY;
    let prevX, prevY, prevWidth, prevHeight; 



    // add event listener to the canvas
    colour.addEventListener("change", (e) => {
        colourSelected = e.target.value;
    });
    shapeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            shapeSelected = e.target.id;
        });
    });
    c.addEventListener("mousedown", (e) => {
        //rectangle
        if (shapeSelected === "rectangle") {

            isDrawing = true;

            startX = e.offsetX;
            startY = e.offsetY;

            //create new rec 
            currentRectangle = new Rectangle(startX, startY, 0, 0, colourSelected);

            //previous rectangle 
            prevX = startX; 
            prevY = startY; 
            prevWidth = 0; 
            prevHeight = 0; 
        }
    });

    c.addEventListener("mousemove", (e) => {
        // rectangle 
        if (isDrawing && currentRectangle) {
            const currentX = e.offsetX;
            const currentY = e.offsetY;

            // width and height 
            sizeX = currentX - startX;
            sizeY = currentY - startY;

            currentRectangle.width = sizeX;
            currentRectangle.height = sizeY;

            // clear the canvas and redraw new one
            ctx.clearRect(prevX, prevY, prevWidth, prevHeight);
            currentRectangle.draw();

            // prev rectangle
            prevX = currentRectangle.x;
            prevY = currentRectangle.y;
            prevWidth = currentRectangle.width;
            prevHeight = currentRectangle.height;

        }
    });
    c.addEventListener("mouseup", (e) => {
        //rectangle
        if (isDrawing && currentRectangle) {
            isDrawing = false;

            endX = e.offsetX;
            endY = e.offsetY;

            sizeX = endX - startX;
            sizeY = endY - startY;

            console.log(sizeX);
            console.log(sizeY);


            currentRectangle.width = sizeX;
            currentRectangle.height = sizeY;

            ctx.clearRect(prevX, prevY, prevWidth, prevHeight);

            currentRectangle.draw();

            currentRectangle = null;
        }



    });

    c.addEventListener("click", (e) => {

        xCoordinate = e.offsetX;
        yCoordinate = e.offsetY;


        if (shapeSelected === "triangle") {
            let triangle = new Triangle();
            triangle.draw();
        }
        if (shapeSelected === "circle") {
            let circle = new Circle(xCoordinate, yCoordinate, 5, colourSelected);
            circle.draw();
        }
        if (shapeSelected === "line") {
            let line = new Line();
            line.draw();
        }

    });

    // add event listeners to buttons



    // triangle, circle, rectangle, line, brush
    class Shape {
        constructor(colour) {
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

    class Circle extends Shape {
        constructor(x, y, radius, colour) {
            super(colour);
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = this.colour;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
            ctx.strokeStyle(colour);
            ctx.stroke();
        }
    }

    class Brush {
        constructor(brushShape) {
            this.brushShape = brushShape;
        }

    }

})