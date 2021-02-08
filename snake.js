const cvs = document.getElementById("snakeCanvas"); // canvas defined in html file
const ctx = cvs.getContext('2d'); 
const countScore = document.getElementById("score"); // used to count scores
const errors = document.getElementById("errors"); // used to report errors

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

let snakeArray = []; // array of snake - squares (1) vacants (0) and food (2)
let liveArray = []; //array of live duration of each snake - squares

function zeroArray () {
  for (i = 0; i <ROW; i++) {
    snakeArray[i] = [];
    for (j = 0; j < COL; j++) {
        snakeArray[i][j] = 0;
    }
  }
}

zeroArray ();

for (i = 0; i <ROW; i++) {
  liveArray[i] = [];
  for (j = 0; j < COL; j++) {
    liveArray[i][j] = 0;
  }
}

function actualizeBoard (mode) {
  for (i = 0; i < ROW; i++) {
    for (j = 0; j < COL; j++) {
        if (liveArray[i][j] == 1 && mode == -1) snakeArray[i][j] = 0;
        if (liveArray[i][j] > 0) liveArray[i][j] = liveArray[i][j] + mode;
    }
  }
}

// draw the board
function drawBoard () {
  for (i = 0; i < ROW; i++) {
      for (j = 0; j < COL; j++) {
          if (snakeArray[i][j] == 0) drawSquare(i, j, VACANT);
          if (snakeArray[i][j] == 1) drawSquare(i, j, SNAKESQUARE);
          if (snakeArray[i][j] == 2) drawSquare(i, j, APPLE);
      }
  }
}

drawBoard();

let snakeLength = 8;

// generate random square number not being snake - square
function randomSquare () { 
  let r = randomN = Math.floor(Math.random() * (ROW * COL - snakeLength));
  let counter = 0;
  for (i = 0; i < ROW; i++) {
      for (j = 0; j < COL; j++) {
          if (snakeArray[i][j] == 0) {
              if (counter === r) return {corx: i, cory: j};
              counter++;
          }
      }
  }
  console.log("error");
  errors.innerHTML = "generate random numbers error!!!";
  return {corx: 0, cory: 0};
}

let dir = "EAST";

// snake's head coordinates
let snakeHead = {corx: 10, cory: 10};
snakeArray[3][10] = 1;
snakeArray[4][10] = 1;
snakeArray[5][10] = 1;
snakeArray[6][10] = 1;
snakeArray[7][10] = 1;
snakeArray[8][10] = 1;
snakeArray[9][10] = 1;
snakeArray[10][10] = 1;

liveArray[3][10] = 1;
liveArray[4][10] = 2;
liveArray[5][10] = 3;
liveArray[6][10] = 4;
liveArray[7][10] = 5;
liveArray[8][10] = 6;
liveArray[9][10] = 7;
liveArray[10][10] = 8;

// check if game is over
let gameOver = false;
function checkCollision () {
  if (snakeHead.corx >= 20 || snakeHead.corx < 0) gameOver = true; 
  else if (snakeHead.cory >= 20 || snakeHead.cory < 0) gameOver = true; 
  else if (snakeArray[snakeHead.corx][snakeHead.cory] == 1 ) {
    gameOver = true;
  }
}

drawBoard();

let score = 0;

function checkApple (isInit) {
  if (snakeArray[snakeHead.corx][snakeHead.cory] == 2 || isInit) {
    let apple = randomSquare();
    snakeArray[apple.corx][apple.cory] = 2;
    snakeLength = snakeLength + 3;
    actualizeBoard(3);
    if (!isInit) {
      score += snakeLength - 3;
      countScore.innerHTML = score;
    }
  }
}

checkApple (true);

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
    checkApple(false);
    snakeArray[snakeHead.corx][snakeHead.cory] = 1;
    liveArray[snakeHead.corx][snakeHead.cory] = snakeLength;
    actualizeBoard (-1);
    drawBoard();
  }
}

let gameOverAnimation = 0;

// main game loop
let loopStart = Date.now ();
function mainGameLoop () {
  let now = Date.now ();
  let dt = now - loopStart;
  if(dt > 100){
    if (!gameOver) moveSnake ();
    else if (gameOverAnimation < 7) {
      handleGameOver (gameOverAnimation % 2);
      gameOverAnimation = gameOverAnimation + 1;
    }
    loopStart = Date.now ();
  }
  requestAnimationFrame (mainGameLoop);
};

mainGameLoop();

function handleGameOver (mode) {
  if (mode === 1) zeroArray ();
  else {
    for (i = 0; i <ROW; i++) {
      for (j = 0; j < COL; j++) {
        snakeArray[i][j] = tempArray[i][j];
      }
    }
  }
  drawBoard();
}

document.addEventListener("keydown", CONTROL);

function CONTROL (event) {
  if (!gameOver) {
    if(event.keyCode == 37) {
        if (dir != "EAST" || snakeLength == 1) dir = "WEST";
    }
    if(event.keyCode == 38) {
        if (dir != "SOUTH" || snakeLength == 1) dir = "NORTH";
    }
    if(event.keyCode == 39) {
        if (dir != "WEST" || snakeLength == 1) dir = "EAST";
    }
    if(event.keyCode == 40) {
        if (dir != "NORTH" || snakeLength == 1) dir = "SOUTH";
    }
  }
};

mainGameLoop ();