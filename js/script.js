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
    const paint = this.document.getElementById("paint");

    let colourSelected;
    let buttonSelected = "rectangle";
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

    // triangle, circle, rectangle, line, brush
    class Shape {
        constructor(colour, borderColor = "black") {
            this.colour = colour;
            this.borderColor = borderColor; 
        }
    }

    class Rectangle extends Shape {
        constructor(x, y, width, height, colour = "transparent",borderColor , type="rectangle") {
            super(colour, borderColor);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.type = type;
        }
        draw() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.colour;
            ctx.fill();
            ctx.strokeStyle = this.borderColor; 
            ctx.stroke(); 
        }
    }

    class Circle extends Shape {
        constructor(x, y, radius, colour = "transparent", borderColor,  type="circle") {
            super(colour, borderColor);
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.type = type;
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = this.colour;
            ctx.strokeStyle = this.borderColor; 
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke(); 
            ctx.fill();
        }
    }

    class Triangle extends Shape {
        constructor(x, y, width, height, colour = "transparent",borderColor, type="triangle") {
            super(colour, borderColor);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.type = type;
        }
        draw() {
            ctx.fillStyle = this.colour;
            ctx.strokeStyle = this.borderColor; 
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.width / 2, this.y + this.height);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }

    class Line extends Shape {
        constructor(xStart, yStart, xEnd, yEnd, strokeWidth, colour, borderColor, type="line") {
            super(colour, borderColor);
            this.xStart = xStart;
            this.yStart = yStart;
            this.xEnd = xEnd;
            this.yEnd = yEnd;
            this.strokeWidth = strokeWidth;
            this.type = type;

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

    if (this.localStorage.getItem("shapes")) {
        let stringShapesArray= JSON.parse(this.localStorage.getItem("shapes"));
        for (let i=0; i<stringShapesArray.length; i++) {
            console.log(stringShapesArray[i]);
            if (stringShapesArray[i].type==="rectangle") { // height, width, x, y
                let tempX = stringShapesArray[i].x;
                let tempY = stringShapesArray[i].y;
                let tempHeight = stringShapesArray[i].height;
                let tempWidth = stringShapesArray[i].width;
                let tempColour = stringShapesArray[i].colour;
                let tempRectangle = new Rectangle(tempX, tempY, tempWidth, tempHeight, tempColour);
                shapesArray.push(tempRectangle);
            }
            else if (stringShapesArray[i].type==="circle") {
                let tempX = stringShapesArray[i].x;
                let tempY = stringShapesArray[i].y;
                let tempRadius = stringShapesArray[i].radius;
                let tempColour = stringShapesArray[i].colour;
                let tempCircle = new Circle(tempX, tempY, tempRadius, tempColour);
                shapesArray.push(tempCircle);
            }
            else if (stringShapesArray[i].type==="triangle") {
                let tempX = stringShapesArray[i].x;
                let tempY = stringShapesArray[i].y;
                let tempHeight = stringShapesArray[i].height;
                let tempWidth = stringShapesArray[i].width;
                let tempColour = stringShapesArray[i].colour;
                let tempTri = new Triangle(tempX, tempY, tempWidth, tempHeight, tempColour);
                shapesArray.push(tempTri);
            }
            else if (stringShapesArray[i].type==="line") {
                let tempXstart = stringShapesArray[i].xStart;
                let tempYstart = stringShapesArray[i].yStart;
                let tempXend = stringShapesArray[i].xEnd;
                let tempYend = stringShapesArray[i].yEnd;
                let tempStroke = stringShapesArray[i].strokeWidth;
                let tempColour = stringShapesArray[i].colour;
                let tempLine = new Line(tempXstart, tempYstart, tempXend, tempYend, tempStroke, tempColour);
                shapesArray.push(tempLine);
            }
        }
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
    });
    paint.addEventListener("click", (e)=>{
        colour.click();
    })

    // add event listener to the canvas
    colour.addEventListener("change", (e) => {
        colourSelected = e.target.value;
    });
    shapeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            buttonSelected = e.target.id;
            console.log(buttonSelected);
        });
    });

    c.addEventListener("mousedown", (e) => {
        isDrawing = true;
        // position of mouse on canvas
        startX = e.offsetX;
        startY = e.offsetY;
        //rectangle
        if (buttonSelected === "rectangle") {
            //create new rec 
            currentRectangle = new Rectangle(startX, startY, 0, 0);
        }
        else if (buttonSelected === "circle") {
            // create new circle 
            currentCircle = new Circle(startX, startY, 0);
        }
        else if (buttonSelected === "triangle") {
            //testing traingle
            currentTriangle = new Triangle(startX, startY, 0, 0);
        }
        else if (buttonSelected === "line") {
            // create new Line 
            currentLine = new Line(startX, startY, startX,startY, 5);
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
        //console.log(shapesArray);
        console.log("mouse up");
        endX = e.offsetX;
        endY = e.offsetY;

        sizeX = endX - startX;
        sizeY = endY - startY;

        if (isDrawing) {
            isDrawing = false;
            //rectangle
            if (currentRectangle && currentRectangle.width!==0) {
                currentRectangle.draw();
                shapesArray.push(currentRectangle);
                currentRectangle = null;
            }
            //circle 
            else if (currentCircle && currentCircle.radius!==0) {
                currentCircle.draw();
                shapesArray.push(currentCircle);
                currentCircle = null;

            }
            //triangle
            else if (currentTriangle && currentTriangle.width!==0) {
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

    c.addEventListener("click", (e)=>{
        const clickedX = e.offsetX; 
        const clickedY = e.offsetY; 

        // loop through shapes 
        for (let i = shapesArray.length - 1; i>= 0; i--){
            if (buttonSelected==="paint" && ShapeClicked(shapesArray[i], clickedX, clickedY)){
                console.log("clicked " + i);
                shapesArray[i].colour = colourSelected; 
                ctx.clearRect(0, 0, c.width, c.height); 
                previousLayers();
                this.localStorage.setItem("shapes", JSON.stringify(shapesArray));
                break;
            }
        }
    });

    // add event listeners to buttons

    function previousLayers() {
        for (let i = 0; i < shapesArray.length; i++) {
            shapesArray[i].draw();
        }
    }

    //detect shape clicked
    function ShapeClicked(shape, x, y) {
        if (shape instanceof Rectangle) {
            // console.log("rect clicked:");
            // console.log(x >= shape.x && x <= shape.x + shape.width &&
            //     y >= shape.y && y <= shape.y + shape.height);
            return x >= shape.x && x <= shape.x + shape.width &&
                   y >= shape.y && y <= shape.y + shape.height;
        } 
        else if (shape instanceof Circle) {
            const dx = x - shape.x;
            const dy = y - shape.y;
            // console.log("circle clicked:");
            // console.log(Math.sqrt(dx ** 2 + dy ** 2) <= shape.radius);
            return Math.sqrt(dx ** 2 + dy ** 2) <= shape.radius;
        } 
        else if (shape instanceof Triangle) {
            // console.log("tri clicked:");
            // console.log(x >= shape.x - shape.width / 2 && x <= shape.x + shape.width / 2 &&
            //     y >= shape.y && y <= shape.y + shape.height);
            return (x >= shape.x - shape.width / 2 && x <= shape.x + shape.width / 2 &&
                    y >= shape.y && y <= shape.y + shape.height);
        }
        else if (shape instanceof Line) {
            const distance = Math.abs((shape.yEnd - shape.yStart) * x - 
                                     (shape.xEnd - shape.xStart) * y +
                                     shape.xEnd * shape.yStart - shape.yEnd * shape.xStart) /
                            Math.sqrt((shape.yEnd - shape.yStart) ** 2 + (shape.xEnd - shape.xStart) ** 2);
            // console.log("line clicked:");
            // console.log(distance < 2);
            return distance < 4; // Allow small error margin for line clicks
        }
        return false;
    }
});