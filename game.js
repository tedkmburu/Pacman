let gridSize = 40

let pacman
let pacmanRadius = (gridSize/2) - 6
let pacmanDiameter = pacmanRadius * 2
let pacmanPosition
let stepSize = 2;

let ghosts = []

let food = []

let walls = []

let wallsLeft = []
let wallsRight = []
let wallsTop = []
let wallsBottom = []

let direction

let open = 100
let opening = false


let pivotPoints = []

let logToConsole = ""

let up = "up"
let down = "down"
let right = "right"
let left = "left"

function setup()
{
    createCanvas(1000,1100)

    pacman = {x: gridSize * 2, y: gridSize * 2}
    direction = right

    createWalls()
    createFood()
    createPivotPositions()
    createGhosts()
}

function draw()
{
    background(0)

    pacmanPosition = createVector(pacman.x, pacman.y)
    
    displayFood()
    displayGhosts()
    displayPacman()
    displayWalls()

    // push()
    // fill(255)
    //     pivotPoints.forEach(point => {
    //         fill("red")
    //         ellipse(point.point.x, point.point.y, 10, 10)
    //     })
    // pop()

    checkDeathCondition(pacmanPosition)
    checkPortals(pacmanPosition)
}

function checkPortals(pacmanPosition)
{
    let portalPosition = createVector(20 * gridSize, 10 * gridSize)
    let pacmanDistanceToPortal = p5.Vector.dist(pacmanPosition, portalPosition)
    fill("red")
    if (pacmanDistanceToPortal < pacmanRadius)
    {
        pacman.x = 1 * gridSize; 
        pacman.y = 10 * gridSize;
    }

    portalPosition = createVector(0 * gridSize, 10 * gridSize)
    pacmanDistanceToPortal = p5.Vector.dist(pacmanPosition, portalPosition)
    if (pacmanDistanceToPortal < pacmanRadius)
    {
        pacman.x = 19 * gridSize; 
        pacman.y = 10 * gridSize;
    }    
}

function checkDeathCondition(pacmanPosition) 
{
    ghosts.forEach(ghost => {
        if (p5.Vector.dist(pacmanPosition, createVector(ghost.x, ghost.y)) < pacmanDiameter) 
        {
            console.log("die");

            createFood()
            createGhosts()
        }
    })

    // let x = Math.round(mouseX/gridSize)
    // let y = Math.round(mouseY/ gridSize)
    // push()
    //     fill("blue")
    //     ellipse(x * gridSize,y * gridSize,10,10)
    // pop()
}

function keyPressed() 
{
    let canMove = getMoveDirections(pacmanPosition, pacmanRadius)

    if (keyCode == (LEFT_ARROW) && canMove.left) 
    {
        direction = left
    }
    
    if (keyCode == (RIGHT_ARROW) && canMove.right) 
    {
        direction = right
    }
    
    if (keyCode == (UP_ARROW) && canMove.up) 
    {
        direction = up
    }
    
    if (keyCode == (DOWN_ARROW) && canMove.down) 
    {
        direction = down
    }
}

function listenForKeyboardInput(canMove) 
{
    if (keyIsDown(LEFT_ARROW) && canMove.left) 
    {
        direction = left
    }
    if (keyIsDown(RIGHT_ARROW) && canMove.right) 
    {
        direction = right
    }
    if (keyIsDown(UP_ARROW) && canMove.up) 
    {
        direction = up
    }
    if (keyIsDown(DOWN_ARROW) && canMove.down) 
    {
        direction = down
    }
}

function getMoveDirections(entity, entityRadius) 
{
    let canMoveLeft = true;
    let canMoveRight = true;
    let canMoveUp = true;
    let canMoveDown = true;
    
    wallsLeft.forEach((leftWall, i) => {
        if (leftWall == entity.x + entityRadius && 
            walls[i].y < entity.y + entityRadius && 
            walls[i].y + walls[i].height > entity.y - entityRadius) 
        {
            canMoveRight = false;
        }
    })

    wallsRight.forEach((rightWall, i) => {
        if (rightWall == entity.x - entityRadius && 
            walls[i].y < entity.y + entityRadius && 
            walls[i].y + walls[i].height > entity.y - entityRadius) 
        {
            canMoveLeft = false;
        }
    })

    wallsTop.forEach((topWall, i) => {
        if (topWall == entity.y + entityRadius && 
            walls[i].x < entity.x + entityRadius && 
            walls[i].x + walls[i].width > entity.x - entityRadius) 
        {
            canMoveDown = false;
        }
    })

    wallsBottom.forEach((bottomWall, i) => {
        if (bottomWall == entity.y - entityRadius && 
            walls[i].x < entity.x + entityRadius && 
            walls[i].x + walls[i].width > entity.x - entityRadius) 
        {
            canMoveUp = false;
        }
    })

    return {up: canMoveUp, down: canMoveDown, left: canMoveLeft, right: canMoveRight}
}

function mouseClicked() 
{
    let x = Math.round(mouseX/gridSize)
    let y = Math.round(mouseY/ gridSize)

    // {up: canMoveUp, down: canMoveDown, left: canMoveLeft, right: canMoveRight}
    // let dontMove = getMoveDirections(createVector(x * gridSize, y * gridSize), gridSize)

    // let dontMove2 = []

    // if (dontMove.up) 
    // {
    //     dontMove2.push(up)
    // }
    // if (dontMove.down) 
    // {
    //     dontMove2.push(down)
    // }
    // if (dontMove.left) 
    // {
    //     dontMove2.push(left)
    // }
    // if (dontMove.right) 
    // {
    //     dontMove2.push(right)
    // }
    
    logToConsole += "oldPivot.push({x: " + x + ", y: " + y + ", dontMove: []}) \n"
    console.log(logToConsole);
    // let canMove = getMoveDirections(createVector(x, y), gridSize/2.1)
    // console.log(canMove);
}

function displayFood()
{
    food.forEach(peice => {
        if (!peice.collected) 
        {
            peice.display()
        }
    })
}

function displayGhosts()
{
    ghosts.forEach(ghost => {
        ghost.move()
        ghost.display()
    })
}

function displayWalls()
{
    walls.forEach(wall => {
        wall.display()
    })
}

function displayPacman()
{
    food.forEach(piece => {
        if (p5.Vector.dist(createVector(piece.x, piece.y), createVector(pacman.x, pacman.y)) < pacmanRadius) 
        {
            piece.collected = true
        }
    })

    let canMove = getMoveDirections(pacmanPosition, pacmanRadius)

    if (direction == left && canMove.left) 
    {
        pacman.x -= stepSize;
    }
    
    if (direction == right && canMove.right) 
    {
        pacman.x += stepSize;
    }
    
    if (direction == up && canMove.up) 
    {
        pacman.y -= stepSize;
    }
    
    if (direction == down && canMove.down) 
    {
        pacman.y += stepSize;
    }


    push()
        fill("yellow")
        open = 6
        if (direction == right) 
        {
            arc(pacman.x, pacman.y, pacmanDiameter, pacmanDiameter, PI / open, -PI / open, PIE);
        }
        if (direction == left) 
        {
            arc(pacman.x, pacman.y, pacmanDiameter, pacmanDiameter, 7 * PI / open, -7 * PI / open, PIE);
        }
        if (direction == up) 
        {
            arc(pacman.x, pacman.y, pacmanDiameter, pacmanDiameter, -2 * PI / open, 8 * PI / open, PIE);
        }
        if (direction == down) 
        {
            arc(pacman.x, pacman.y, pacmanDiameter, pacmanDiameter, -8 * PI / open, 2 * PI / open, PIE);
        }
        
        //ellipse(pacman.x, pacman.y, pacmanDiameter, pacmanDiameter)
    pop()
}

class Ghost
{
    constructor(props)
    {
        this.x = props.x * gridSize
        this.y = props.y * gridSize
        this.color = props.color
        this.direction = right;
        this.moving = true;
    }

    display = function () 
    {
        let ghost = this
        let offsetX = 14
        let offsetY = 12
        let distanceBetweenPoints = 7;
        push()

           
            noStroke()

            // fill(255)
            // rect(ghost.x - (gridSize/2), ghost.y - (gridSize/2), gridSize, gridSize)

            let wholeOffsetX = 0;
            let wholeOffsetY = 0;

            
            let ghostSize = gridSize - 4
            //ellipse(ghost.x, ghost.y, 10, 10)

            fill(ghost.color)
            ellipse(ghost.x + wholeOffsetX, ghost.y - 2 + wholeOffsetY, ghostSize/1.25, ghostSize/1.25)
            rect(ghost.x - 14 + wholeOffsetX, ghost.y + wholeOffsetY, ghostSize/1.27, ghostSize/3)

            beginShape();
                vertex(ghost.x + (distanceBetweenPoints * 0) - offsetX + wholeOffsetX, ghost.y + offsetY + wholeOffsetY);

                vertex(ghost.x + (distanceBetweenPoints * 0) - offsetX + wholeOffsetX, ghost.y + offsetY + wholeOffsetY + 5);
                vertex(ghost.x + (distanceBetweenPoints * 1) - offsetX + wholeOffsetX, ghost.y + offsetY + wholeOffsetY);
                vertex(ghost.x + (distanceBetweenPoints * 2) - offsetX + wholeOffsetX, ghost.y + offsetY + wholeOffsetY + 5);
                vertex(ghost.x + (distanceBetweenPoints * 3) - offsetX + wholeOffsetX, ghost.y + offsetY + wholeOffsetY);
                vertex(ghost.x + (distanceBetweenPoints * 4) - offsetX + wholeOffsetX, ghost.y + offsetY + wholeOffsetY + 5);

                vertex(ghost.x + (distanceBetweenPoints * 4) - offsetX + wholeOffsetX, ghost.y + offsetY + wholeOffsetY);
            endShape();

            fill(255)
            ellipse(ghost.x - 6 + wholeOffsetX, ghost.y - 4 + wholeOffsetY, 10, 10)
            ellipse(ghost.x + 7 + wholeOffsetX, ghost.y - 4 + wholeOffsetY, 10, 10)
            fill(0)
            ellipse(ghost.x - 6 + wholeOffsetX, ghost.y - 4 + wholeOffsetY, 4, 4)
            ellipse(ghost.x + 7 + wholeOffsetX, ghost.y - 4 + wholeOffsetY, 4, 4)
        pop()
    }

    move = function()
    {
        let ghost = this;

        let ghostPosition = createVector(ghost.x, ghost.y)

        let gotNewPosition = false;
        for (let i = 0; i < pivotPoints.length; i++) 
        {
            if (p5.Vector.dist(ghostPosition, pivotPoints[i].point) == 0 && !gotNewPosition) 
            {

                
                ghost.direction = getRandomDirection(pivotPoints[i].dontMove)
                gotNewPosition = true;
                //console.log("new");
            }
        }

        if (ghost.direction == left) 
        {
            ghost.x -= stepSize;
        }
        else if (ghost.direction == right) 
        {
            ghost.x += stepSize;
        }
        else if (ghost.direction == up) 
        {
            ghost.y -= stepSize;
        }
        else if (ghost.direction == down) 
        {
            ghost.y += stepSize;
        }
        else
        {
        
            
        }
    }
}

function createGhosts() 
{
    ghosts = []
    ghosts.push(new Ghost({x: 9, y: 10, color: "red"}))
    ghosts.push(new Ghost({x: 10, y: 10, color: "blue"}))
    ghosts.push(new Ghost({x: 11, y: 10, color: "orange"}))
    ghosts.push(new Ghost({x: 9, y: 8, color: "green"}))
    ghosts.push(new Ghost({x: 10, y: 8, color: "purple"}))
    ghosts.push(new Ghost({x: 11, y: 8, color: "pink"}))

    pacman = {x: gridSize * 2, y: gridSize * 2}
    direction = right
}

function getRandomDirection(notThisDirection) 
{
    let directions = [left, right, up, down] 

    // console.log(notThisDirection);

    notThisDirection.forEach(notDir => {
        
        const index = directions.indexOf(notDir);
        if (index > -1) 
        {
            directions.splice(index, 1);
        }
    })

    let randDir = directions[Math.floor(Math.random() * 4)];
    return randDir;
}

class Food
{
    constructor(props)
    {
        this.x = props.x
        this.y = props.y
        this.collected = false;
    }

    display = function () 
    {
        let peice = this;
        push()
            fill(255)
            ellipse(peice.x, peice.y, 10, 10)
        pop()
    }
}

function createFood() 
{
    for (let x = 1; x < 20; x++) 
    {
        for (let y = 1; y < 21; y++) 
        {
            food.push(new Food({x: x * gridSize, y: y * gridSize}));
        }
    }    
}

class Wall
{
    constructor(props)
    {
        this.x = (props.x * gridSize) + (gridSize / 2)
        this.y = (props.y * gridSize) + (gridSize / 2)
        this.width = props.width * gridSize
        this.height = props.height * gridSize
    }

    display = function () 
    {
        let wall = this;
        push()
            fill("rgb(0,0,155)")
            noStroke()
            rect(wall.x, wall.y, wall.width, wall.height)
        pop()
    }
}

function createWalls()
{
    walls = []

    walls.push(new Wall({x: 7, y: 9, width: 1, height: 1})) 
    walls.push(new Wall({x: 11, y: 9, width: 1, height: 1})) 
    walls.push(new Wall({x: 17, y: 16, width: 1, height: 1})) 

    walls.push(new Wall({x: 0, y: 0, width: 19, height: 1})) 
    walls.push(new Wall({x: 0, y: 6, width: 4, height: 1})) 
    walls.push(new Wall({x: 0, y: 8, width: 4, height: 1})) 
    walls.push(new Wall({x: 0, y: 10, width: 4, height: 1})) 
    walls.push(new Wall({x: 0, y: 12, width: 4, height: 1})) 
    walls.push(new Wall({x: 0, y: 16, width: 2, height: 1})) 
    walls.push(new Wall({x: 2, y: 2, width: 2, height: 1})) 
    walls.push(new Wall({x: 2, y: 4, width: 2, height: 1})) 
    walls.push(new Wall({x: 2, y: 4, width: 2, height: 1})) 
    walls.push(new Wall({x: 5, y: 2, width: 3, height: 1})) 
    walls.push(new Wall({x: 11, y: 2, width: 3, height: 1})) 
    walls.push(new Wall({x: 15, y: 2, width: 2, height: 1})) 
    walls.push(new Wall({x: 15, y: 4, width: 2, height: 1})) 
    walls.push(new Wall({x: 7, y: 4, width: 5, height: 1})) 
    walls.push(new Wall({x: 5, y: 6, width: 3, height: 1})) 
    walls.push(new Wall({x: 7, y: 8, width: 2, height: 1})) 
    walls.push(new Wall({x: 10, y: 8, width: 2, height: 1})) 
    walls.push(new Wall({x: 7, y: 10, width: 5, height: 1})) 
    walls.push(new Wall({x: 7, y: 12, width: 5, height: 1})) 
    walls.push(new Wall({x: 7, y: 16, width: 5, height: 1})) 
    walls.push(new Wall({x: 2, y: 18, width: 6, height: 1})) 
    walls.push(new Wall({x: 11, y: 18, width: 6, height: 1})) 
    walls.push(new Wall({x: 2, y: 14, width: 2, height: 1})) 
    walls.push(new Wall({x: 5, y: 14, width: 3, height: 1})) 
    walls.push(new Wall({x: 11, y: 6, width: 3, height: 1})) 
    walls.push(new Wall({x: 15, y: 6, width: 4, height: 1})) 
    walls.push(new Wall({x: 15, y: 8, width: 4, height: 1})) 
    walls.push(new Wall({x: 15, y: 10, width: 4, height: 1})) 
    walls.push(new Wall({x: 15, y: 12, width: 4, height: 1})) 
    walls.push(new Wall({x: 11, y: 14, width: 3, height: 1})) 
    walls.push(new Wall({x: 15, y: 14, width: 2, height: 1})) 
    walls.push(new Wall({x: 0, y: 20, width: 18, height: 1})) 
    





    walls.push(new Wall({x: 0, y: 0, width: 1, height: 6})) 
    walls.push(new Wall({x: 0, y: 12, width: 1, height: 8})) 
    walls.push(new Wall({x: 5, y: 4, width: 1, height: 5})) 
    walls.push(new Wall({x: 3, y: 6, width: 1, height: 3})) 
    walls.push(new Wall({x: 3, y: 10, width: 1, height: 3})) 
    walls.push(new Wall({x: 5, y: 10, width: 1, height: 3})) 
    walls.push(new Wall({x: 9, y: 0, width: 1, height: 3})) 
    walls.push(new Wall({x: 9, y: 4, width: 1, height: 3})) 
    walls.push(new Wall({x: 13, y: 4, width: 1, height: 5})) 
    walls.push(new Wall({x: 13, y: 10, width: 1, height: 3})) 
    walls.push(new Wall({x: 9, y: 12, width: 1, height: 3})) 
    walls.push(new Wall({x: 3, y: 14, width: 1, height: 3})) 
    walls.push(new Wall({x: 5, y: 16, width: 1, height: 3})) 
    walls.push(new Wall({x: 9, y: 16, width: 1, height: 3})) 
    walls.push(new Wall({x: 13, y: 16, width: 1, height: 3})) 
    walls.push(new Wall({x: 18, y: 0, width: 1, height: 6})) 
    walls.push(new Wall({x: 18, y: 12, width: 1, height: 9})) 
    walls.push(new Wall({x: 15, y: 6, width: 1, height: 3})) 
    walls.push(new Wall({x: 15, y: 10, width: 1, height: 3})) 
    walls.push(new Wall({x: 15, y: 14, width: 1, height: 3})) 


    walls.forEach(wall => {
        wallsLeft.push(wall.x)
        wallsRight.push(wall.x + wall.width)
        wallsTop.push(wall.y)
        wallsBottom.push(wall.y + wall.height)
    })
}

function createPivotPositions() 
{
    pivotPoints = []
    let oldPivot = []

    oldPivot.push({x: 9, y: 10, dontMove: [left,down,up]})
    oldPivot.push({x: 10, y: 10, dontMove: [down]})
    oldPivot.push({x: 11, y: 10, dontMove: [right,down,up]})

    oldPivot.push({x: 7, y: 8, dontMove: [up, left]}) 
    oldPivot.push({x: 10, y: 8, dontMove: [up]}) 
    oldPivot.push({x: 13, y: 8, dontMove: [up, right]}) 

    oldPivot.push({x: 9, y: 8, dontMove: [down, right]}) 
    oldPivot.push({x: 11, y: 8, dontMove: [down, left]}) 

    oldPivot.push({x: 9, y: 6, dontMove: [up, right]}) 
    oldPivot.push({x: 7, y: 6, dontMove: [down, left]}) 
    oldPivot.push({x: 7, y: 4, dontMove: [up]}) 

    oldPivot.push({x: 11, y: 6, dontMove: [up, left]}) 
    oldPivot.push({x: 13, y: 6, dontMove: [down, right]}) 
    oldPivot.push({x: 13, y: 4, dontMove: [up]})

    oldPivot.push({x: 11, y: 4, dontMove: [down]}) 
    oldPivot.push({x: 9, y: 4, dontMove: [down]}) 
    oldPivot.push({x: 11, y: 2, dontMove: [up, left]}) 
    oldPivot.push({x: 9, y: 2, dontMove: [up, right]}) 


    oldPivot.push({x: 15, y: 2, dontMove: [up]}) 
    oldPivot.push({x: 18, y: 2, dontMove: [up, right]}) 
    oldPivot.push({x: 18, y: 4, dontMove: [right]}) 
    oldPivot.push({x: 15, y: 4, dontMove: []}) 


    oldPivot.push({x: 18, y: 6, dontMove: [right, down]}) 
    oldPivot.push({x: 15, y: 6, dontMove: [left]}) 
    oldPivot.push({x: 15, y: 10, dontMove: [right]}) 

    oldPivot.push({x: 15, y: 14, dontMove: []}) 
    oldPivot.push({x: 18, y: 14, dontMove: [up, right]}) 
    oldPivot.push({x: 18, y: 16, dontMove: [right, down]}) 
    oldPivot.push({x: 17, y: 16, dontMove: [left, up]}) 
    oldPivot.push({x: 17, y: 18, dontMove: [down]}) 
    oldPivot.push({x: 18, y: 18, dontMove: [up, right]}) 
    oldPivot.push({x: 18, y: 20, dontMove: [right, down]}) 
    oldPivot.push({x: 11, y: 20, dontMove: [down]}) 
    oldPivot.push({x: 9, y: 20, dontMove: [down]}) 
    oldPivot.push({x: 2, y: 20, dontMove: [down, left]}) 



    oldPivot.push({x: 13, y: 10, dontMove: [left]}) 
    oldPivot.push({x: 13, y: 12, dontMove: [right]}) 
    oldPivot.push({x: 13, y: 14, dontMove: [down]}) 
    oldPivot.push({x: 11, y: 14, dontMove: [up, left]}) 
    oldPivot.push({x: 11, y: 16, dontMove: [down]}) 
    oldPivot.push({x: 13, y: 16, dontMove: [up]}) 
    oldPivot.push({x: 15, y: 16, dontMove: [right]}) 
    oldPivot.push({x: 15, y: 18, dontMove: [left, down]}) 
    oldPivot.push({x: 13, y: 18, dontMove: [right, down]}) 
    oldPivot.push({x: 11, y: 18, dontMove: [left, up]}) 


    oldPivot.push({x: 2, y: 18, dontMove: [left, up]}) 
    oldPivot.push({x: 3, y: 18, dontMove: [down]}) 
    oldPivot.push({x: 5, y: 18, dontMove: [right, down]}) 
    oldPivot.push({x: 7, y: 18, dontMove: [left, down]}) 
    oldPivot.push({x: 9, y: 18, dontMove: [up, right]}) 
    oldPivot.push({x: 9, y: 16, dontMove: [down]}) 
    oldPivot.push({x: 7, y: 16, dontMove: [up]}) 
    oldPivot.push({x: 5, y: 16, dontMove: [left]}) 
    oldPivot.push({x: 3, y: 16, dontMove: [up, right]}) 
    oldPivot.push({x: 2, y: 16, dontMove: [down, left]}) 

    oldPivot.push({x: 2, y: 14, dontMove: [up, left]}) 
    oldPivot.push({x: 5, y: 14, dontMove: []}) 
    oldPivot.push({x: 7, y: 14, dontMove: [down]}) 
    oldPivot.push({x: 9, y: 14, dontMove: [up, right]}) 

    oldPivot.push({x: 7, y: 12, dontMove: [left]}) 
    oldPivot.push({x: 7, y: 10, dontMove: [right]}) 
    oldPivot.push({x: 5, y: 10, dontMove: [left]}) 
    oldPivot.push({x: 5, y: 6, dontMove: [right]}) 
    oldPivot.push({x: 2, y: 6, dontMove: [left, down]}) 
    oldPivot.push({x: 2, y: 4, dontMove: [left]}) 
    oldPivot.push({x: 5, y: 4, dontMove: []}) 
    oldPivot.push({x: 5, y: 2, dontMove: [up]}) 
    oldPivot.push({x: 2, y: 2, dontMove: [up, right]})

    oldPivot.forEach(point => {
        pivotPoints.push({point: createVector(point.x * gridSize , point.y * gridSize), dontMove: point.dontMove})
    })

    console.log(pivotPoints);
}