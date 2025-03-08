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
    const clear = this.document.getElementById("clear");
    const undo = this.document.getElementById("undo");

    let colourSelected;
    let shapeSelected;
    let sizeX;
    let sizeY;
    let isDrawing = false;
    let currentRectangle = null;
    let currentCircle;
    let currentTriangle;
    let currentLine;
    let startX, startY;
    let endX, endY;
    let shapesArray = [];

    if (this.localStorage.getItem("shapes")) {
        shapesArray= JSON.parse(this.localStorage.getItem("shapes"));
        console.log(shapesArray);
        previousLayers(); 
    }


    //add event listener to buttons 
    clear.addEventListener("click", (e) => {
        shapesArray = [];
        ctx.clearRect(0, 0, c.width, c.height);

    });
    undo.addEventListener("click", (e) => {
        shapesArray.pop();
        ctx.clearRect(0, 0, c.width, c.height);

        previousLayers();
    })

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
        isDrawing = true;
        // position of mouse on canvas
        startX = e.offsetX;
        startY = e.offsetY;
        //rectangle
        if (shapeSelected === "rectangle") {
            //create new rec 
            currentRectangle = new Rectangle(startX, startY, 0, 0, colourSelected);
        }
        else if (shapeSelected === "circle") {
            // create new circle 
            currentCircle = new Circle(startX, startY, 0, colourSelected);
        }
        else if (shapeSelected === "triangle") {
            //testing traingle
            currentTriangle = new Triangle(startX, startY, 0, 0, colourSelected);
        }
        else if (shapeSelected === "line") {
            // create new Line 
            currentLine = new Line(startX, startY, 0, 0, 5, colourSelected);
        }
    });

    c.addEventListener("mousemove", (e) => {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        // width and height 
        sizeX = currentX - startX;
        sizeY = currentY - startY;


        if (isDrawing) {
            // rectangle 
            if (currentRectangle) {
                currentRectangle.width = sizeX;
                currentRectangle.height = sizeY;
                // clear the canvas and redraw new one
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentRectangle.draw();
            }
            //circle 
            else if (currentCircle) {
                const radius = Math.sqrt(sizeX ** 2 + sizeY ** 2)
                currentCircle.radius = radius;
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentCircle.draw();
            }
            //triangle
            else if (currentTriangle) {
                currentTriangle.width = sizeX * 2;
                currentTriangle.height = sizeY;
                // clear the canvas and redraw new one
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentTriangle.draw();
            }
            // line 
            else if (currentLine) {
                currentLine.xEnd = currentX;
                currentLine.yEnd = currentY;

                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentLine.draw();
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
                currentRectangle = null;
            }
            //circle 
            else if (currentCircle) {
                currentCircle.draw();
                shapesArray.push(currentCircle);
                currentCircle = null;

            }
            //triangle
            else if (currentTriangle) {
                currentTriangle.draw();
                shapesArray.push(currentTriangle);
                currentTriangle = null;

            }
            // line 
            else if (currentLine) {
                currentLine.draw();
                shapesArray.push(currentLine);
                currentLine = null;

            }
        }

        this.localStorage.setItem("shapes", JSON.stringify(shapesArray));


    });

    // add event listeners to buttons

    function previousLayers() {
        for (let i = 0; i < shapesArray.length; i++) {
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

    class Triangle extends Shape {
        constructor(x, y, width, height, colour) {
            super(colour);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        draw() {
            ctx.fillStyle = this.colour;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.width / 2, this.y + this.height);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
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
            ctx.strokeWidth = this.strokeWidth;
            ctx.strokeStyle = this.colour;
            ctx.stroke();
        }
    }

    class Brush {
        constructor(brushShape) {
            this.brushShape = brushShape;
        }

    }

    //local storage
    // function storage() {
    //     let storage = JSON.stringify(shapesArray);
    //     this.localStorage.this.shape = storage;
    // }

    // function retrieved() {
    //     //retrieved 
    //     let retrieved = JSON.parse(this.localStorage.storage);
    //     console.log(retrieved);
    //     shapesArray = retrieved;
    //     previousLayers();
    // }

});