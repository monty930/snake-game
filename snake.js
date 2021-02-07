const cvs = document.getElementById("snakeCanvas"); // canvas defined in html file
const ctx = cvs.getContext('2d'); 
const countScore = document.getElementById("score"); // used to count scores

const ROW = 20; // number of rows
const COL = COLUMN = 20; // number of columns
const SQ = squareSize = 20; // size of single square
const VACANT = "LAWNGREEN"; // canvas default colour
const SNAKESQUARE = "GREEN"; // snake colour
const APPLE = "RED"; // apple colour


// draw a square
function drawSquare (x, y, colour) { // coordinates and colour of square
  ctx.lineWidth = 0.5; // stroke width

  ctx.fillStyle = colour; // square colour
  ctx.fillRect(x*SQ, y*SQ, SQ, SQ); // draw inside of square: coordinates and size of square

  ctx.strokeStyle = "White"; // stroke colour
  ctx.strokeRect(x*SQ, y*SQ, SQ, SQ); // draw stroke: coordinates and size of square
}

let snakeArray = []; // arr - array of snake - squares (1) vacants (0) and food (2)

for (i = 0; i <ROW; i++) {
  snakeArray[i] = [];
  for (j = 0; j < COL; j++) {
      snakeArray[i][j] = 0;
  }
}

// draw the board
function drawBoard(){
  for (i = 0; i < ROW; i++) {
      for (j = 0; j < COL; j++) {
          if (snakeArray[i][j] == 0) drawSquare(i, j, VACANT);
          if (snakeArray[i][j] == 1) drawSquare(i, j, SNAKESQUARE);
          if (snakeArray[i][j] == 2) drawSquare(i, j, APPLE);
      }
  }
}

drawBoard();

let snakeLength = 1;

// generate random square number not being snake - square
function randomPiece () { 
  let r = randomN = Math.floor(Math.random() * (ROW * COL - snakeLength));
  let counter = 0;
  for (i = 0; i < ROW; i++) {
      for (j = 0; j < COL; j++) {
          if (snakeArray[i][j] == 0) {
              if (counter === r) return (i, j);
              counter++;
          }
      }
  }
  return false;
  console.log("error");
}

let dir = "EAST";

// snake's head and tail coordinates
let snakeHead = {corx: 10, cory: 10};
let snakeTail = {corx: 3, cory: 10};
snakeArray[3][10] = 1;
snakeArray[4][10] = 1;
snakeArray[5][10] = 1;
snakeArray[6][10] = 1;
snakeArray[7][10] = 1;
snakeArray[8][10] = 1;
snakeArray[9][10] = 1;
snakeArray[10][10] = 1;

// check if game is over
let gameOver = false;
function checkCollision () {
  if (snakeHead.corx >= 20 || snakeHead.corx < 0) gameOver = true; 
  else if (snakeHead.cory >= 20 || snakeHead.cory < 0) gameOver = true; 
  else if (snakeArray[snakeHead.corx][snakeHead.cory] == 1 ) {
    console.log("patrz:");
    console.log(snakeHead.corx);
    console.log(snakeHead.cory);
    gameOver = true;
  }
}

drawBoard();

// moves the snake in indicated direction
function moveSnake () {
  let move = {ver: 0, hor: 1};
  if (dir == "NORTH") {
    move.ver = -1;
    move.hor = 0;
  }
  if (dir == "SOUTH") {
    move.ver = 1;
    move.hor = 0;
  }
  if (dir == "WEST") {
    move.ver = 0;
    move.hor = -1;
  }
  snakeHead.corx = snakeHead.corx + move.hor;
  snakeHead.cory = snakeHead.cory + move.ver;
  checkCollision();
  if (!gameOver) {
    snakeArray[snakeHead.corx][snakeHead.cory] = 1;
    snakeArray[snakeTail.corx][snakeTail.cory] = 0;
    snakeTail.corx = snakeTail.corx + move.hor;
    snakeTail.cory = snakeTail.cory + move.ver;
    console.log(snakeTail.corx);
    console.log(snakeTail.cory);
    console.log("...");
    drawBoard();
  }
}

// main game loop
let loopStart = Date.now ();
function mainGameLoop () {
  let now = Date.now ();
    let dt = now - loopStart;
    if(dt > 100){
        moveSnake ();
        loopStart = Date.now ();
    }
  if( !gameOver){
    requestAnimationFrame (mainGameLoop);
  }
  else console.log("GAME OVER");
};

mainGameLoop();

document.addEventListener("keydown", CONTROL);

function CONTROL (event) {
  if (!gameOver) {
    if(event.keyCode == 37) {
        console.log(dir);
        if (dir != "EAST" || snakeLength == 1) dir = "WEST";
    }
    if(event.keyCode == 38) {
        console.log(dir);
        if (dir != "SOUTH" || snakeLength == 1) dir = "NORTH";
    }
    if(event.keyCode == 39) {
        console.log(dir);
        if (dir != "WEST" || snakeLength == 1) dir = "EAST";
    }
    if(event.keyCode == 40) {
        console.log(dir);
        if (dir != "NORTH" || snakeLength == 1) dir = "SOUTH";
    }
  }
};

mainGameLoop ();