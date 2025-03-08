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
    let currentCircle;
    let startX, startY;
    let endX, endY;
    let shapesArray = [];



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
        // position of mouse 
        startX = e.offsetX;
        startY = e.offsetY;

        //rectangle
        if (shapeSelected === "rectangle") {

            isDrawing = true;



            //create new rec 
            currentRectangle = new Rectangle(startX, startY, 0, 0, colourSelected);


        }
        else if (shapeSelected === "circle") {
            isDrawing = true;

            // create new circle 
            currentCircle = new Circle(startX, startY, 0, colourSelected);

        }

    });

    c.addEventListener("mousemove", (e) => {
        const currentX = e.offsetX;
        const currentY = e.offsetY;

        // width and height 
        sizeX = currentX - startX;
        sizeY = currentY - startY;

        // rectangle 
        if (isDrawing){

            if (currentRectangle) {


                currentRectangle.width = sizeX;
                currentRectangle.height = sizeY;
    
                // clear the canvas and redraw new one
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentRectangle.draw();
    
            }
            //circle 
            if (currentCircle) {
                const radius = Math.sqrt(sizeX ** 2 + sizeY ** 2)
                currentCircle.radius = radius;
    
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
    
                currentCircle.draw();
            }
        }

    });
    c.addEventListener("mouseup", (e) => {
        endX = e.offsetX;
        endY = e.offsetY;


        sizeX = endX - startX;
        sizeY = endY - startY;

        if (isDrawing) {

 
            isDrawing = false;
 
            //rectangle
            if (currentRectangle) {

                currentRectangle.draw();
                shapesArray.push(currentRectangle);
                //console.log(shapesArray);


                currentRectangle = null;

                // push new rectangle to shapes array
            }

            //circle 
            if(currentCircle){
                currentCircle.draw();
                shapesArray.push(currentCircle);

                currentCircle = null; 

            }
        }









    });



    // add event listeners to buttons

    function previousLayers() {
        for (let i = 0; i < shapesArray.length; i++) {
            console.log(shapesArray[i]);
            shapesArray[i].draw();
        }
    }



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