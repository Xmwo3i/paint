/**
 * Author: Mostafa Faghani (faghanim), Stephanie Li (li3424)
 * Date Created: February 27, 2025
 * This is the JS script for a Microsoft Paint app replica
 */

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

    // initialize/declare variables
    let colourSelected;
    let buttonSelected = "brush";
    let sizeX;
    let sizeY;
    let isDrawing = false;
    let currentRectangle = null;
    let currentCircle;
    let currentTriangle;
    let currentLine;
    let currentBrush;
    let startX, startY;
    let endX, endY;
    let shapesArray = [];

    // Shape class (parent)
    class Shape {
        constructor(colour, borderColor = "black") {
            this.colour = colour;
            this.borderColor = borderColor;
        }
    }

    // Rectangle class
    class Rectangle extends Shape {
        constructor(x, y, width, height, colour = "transparent", borderColor, type = "rectangle") {
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

    // Circle class
    class Circle extends Shape {
        constructor(x, y, radius, colour = "transparent", borderColor, type = "circle") {
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

    // Triangle class
    class Triangle extends Shape {
        constructor(x, y, width, height, colour = "transparent", borderColor, type = "triangle") {
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

    // Line class
    class Line extends Shape {
        constructor(xStart, yStart, xEnd, yEnd, strokeWidth, colour, borderColor, type = "line") {
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

    // Brush class
    class Brush {
        constructor(x, y, thickness, colour, type = "brush") {
            this.colour = colour
            this.x = x;
            this.y = y;
            this.thickness = thickness;
        }
        draw(previousX, previousY) {
            if (previousX === null || previousY === null){
                return;
            }
            ctx.beginPath(); 
            ctx.moveTo(previousX, previousY);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.colour; 
            ctx.lineWidth = this.thickness; 
            ctx.lineCap = "round"; 
            ctx.stroke();
        }

    }

    // retrieve shapes from previous session from local storage
    retrieveLocalStorage();

    // add event listeners to each button to change selection
    shapeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            buttonSelected = e.target.id;
            //console.log(buttonSelected);
        });
    });

    // add event listener to clear button
    clear.addEventListener("click", (e) => {
        shapesArray = [];
        ctx.clearRect(0, 0, c.width, c.height);
    });

    // add event listener to undo button
    undo.addEventListener("click", (e) => {
        shapesArray.pop();
        ctx.clearRect(0, 0, c.width, c.height);
        previousLayers();
    });

    // add event listener to fill/paint button
    paint.addEventListener("click", (e)=>{
        colour.click();
    })

    // add event listener to colour picker when the colour is changed
    colour.addEventListener("change", (e) => {
        colourSelected = e.target.value;
    });
    shapeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            shapeButtons.forEach(buttons => buttons.style.backgroundColor = "");
            shapeSelected = e.target.id;
            e.target.style.backgroundColor = "green";
        });
    });

    // on mousedown: create a new shape
    c.addEventListener("mousedown", (e) => {
        isDrawing = true;
        // position of mouse on canvas
        startX = e.offsetX;
        startY = e.offsetY;
        //create new rectangle
        if (buttonSelected === "rectangle") {
            currentRectangle = new Rectangle(startX, startY, 0, 0);
        }
        // create new circle 
        else if (buttonSelected === "circle") {
            currentCircle = new Circle(startX, startY, 0);
        }
        // create new triangle
        else if (buttonSelected === "triangle") {
            currentTriangle = new Triangle(startX, startY, 0, 0);
        }
        // create new Line 
        else if (shapeSelected === "line") {
            currentLine = new Line(startX, startY, startX, startY, 5);
        }
        else if (shapeSelected === "brush"){
            currentBrush = new Brush(startX , startY, 5, colourSelected);
        }
    });

    // on mousemove: update the current shape preview when dragging
    c.addEventListener("mousemove", (e) => {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        sizeX = currentX - startX;
        sizeY = currentY - startY;
        if (isDrawing) {
            // update rectangle 
            if (currentRectangle) {
                currentRectangle.width = sizeX;
                currentRectangle.height = sizeY;
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentRectangle.draw();
            }
            // update circle 
            else if (currentCircle) {
                const radius = Math.sqrt(sizeX ** 2 + sizeY ** 2)
                currentCircle.radius = radius;
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentCircle.draw();
            }
            // update triangle
            else if (currentTriangle) {
                currentTriangle.width = sizeX * 2;
                currentTriangle.height = sizeY;
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentTriangle.draw();
            }
            // update line 
            else if (currentLine) {
                currentLine.xEnd = currentX;
                currentLine.yEnd = currentY;
                ctx.clearRect(0, 0, c.width, c.height);
                previousLayers();
                currentLine.draw();
            }
            // update brush
            else if (currentBrush){
                let previousX = startX;
                let previousY = startY;
                startX = currentX; 
                startY = currentY;
                let currentBrush = new Brush(startX, startY, 5, colourSelected); 

                currentBrush.draw(previousX, previousY);
                shapesArray.push(currentBrush); 
            }
        }
    });

    // on mouseup: draw the new shape and add it to the shapes array
    c.addEventListener("mouseup", (e) => {
        //console.log("mouse up");
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

    // on click: when fill tool selected, fill the clicked shape
    c.addEventListener("click", (e)=>{
        const clickedX = e.offsetX; 
        const clickedY = e.offsetY; 
        // loop through shapes 
        for (let i = shapesArray.length - 1; i>= 0; i--){
            if (buttonSelected==="paint" && shapeClicked(shapesArray[i], clickedX, clickedY)){
                //console.log("clicked " + i);
                shapesArray[i].colour = colourSelected; 
                ctx.clearRect(0, 0, c.width, c.height); 
                previousLayers();
                this.localStorage.setItem("shapes", JSON.stringify(shapesArray));
                break;
            }
        }
    });

    /**
     * Retrieve and draw shapes from local storage
     * @return
     */
    function retrieveLocalStorage() {
        if (this.localStorage.getItem("shapes")) {
            let stringShapesArray = JSON.parse(this.localStorage.getItem("shapes"));
            for (let i = 0; i < stringShapesArray.length; i++) {
                //console.log(stringShapesArray[i]);
                if (stringShapesArray[i].type === "rectangle") { // height, width, x, y
                    let tempX = stringShapesArray[i].x;
                    let tempY = stringShapesArray[i].y;
                    let tempHeight = stringShapesArray[i].height;
                    let tempWidth = stringShapesArray[i].width;
                    let tempColour = stringShapesArray[i].colour;
                    let tempRectangle = new Rectangle(tempX, tempY, tempWidth, tempHeight, tempColour);
                    shapesArray.push(tempRectangle);
                }
                else if (stringShapesArray[i].type === "circle") {
                    let tempX = stringShapesArray[i].x;
                    let tempY = stringShapesArray[i].y;
                    let tempRadius = stringShapesArray[i].radius;
                    let tempColour = stringShapesArray[i].colour;
                    let tempCircle = new Circle(tempX, tempY, tempRadius, tempColour);
                    shapesArray.push(tempCircle);
                }
                else if (stringShapesArray[i].type === "triangle") {
                    let tempX = stringShapesArray[i].x;
                    let tempY = stringShapesArray[i].y;
                    let tempHeight = stringShapesArray[i].height;
                    let tempWidth = stringShapesArray[i].width;
                    let tempColour = stringShapesArray[i].colour;
                    let tempTri = new Triangle(tempX, tempY, tempWidth, tempHeight, tempColour);
                    shapesArray.push(tempTri);
                }
                else if (stringShapesArray[i].type === "line") {
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
    }
    
    /**
     * Draws all the shapes that were previously created (all the shapes in the array)
     * @return
     */
    function previousLayers() {
        for (let i = 0; i < shapesArray.length; i++) {
            shapesArray[i].draw();
        }
    }

    /**
     * Detects whether a shape was clicked
     * @return true or false, depending on whether the shape was clicked
     */
    function shapeClicked(shape, x, y) {
        if (shape instanceof Rectangle) {
            return x >= shape.x && x <= shape.x + shape.width &&
                y >= shape.y && y <= shape.y + shape.height;
        }
        else if (shape instanceof Circle) {
            const dx = x - shape.x;
            const dy = y - shape.y;
            return Math.sqrt(dx ** 2 + dy ** 2) <= shape.radius;
        }
        else if (shape instanceof Triangle) {
            return (x >= shape.x - shape.width / 2 && x <= shape.x + shape.width / 2 &&
                y >= shape.y && y <= shape.y + shape.height);
        }
        else if (shape instanceof Line) {
            const distance = Math.abs((shape.yEnd - shape.yStart) * x - 
                                     (shape.xEnd - shape.xStart) * y +
                                     shape.xEnd * shape.yStart - shape.yEnd * shape.xStart) /
                            Math.sqrt((shape.yEnd - shape.yStart) ** 2 + (shape.xEnd - shape.xStart) ** 2);
            return distance < 4; // allow small error margin for line clicks
        }
        return false;
    }
});