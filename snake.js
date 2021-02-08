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
const BLUEAPPLE = "BLUE"; // blue apple colour


// draw a square
function drawSquare (x, y, colour) { // coordinates and colour of square
  ctx.lineWidth = 0.5; // stroke width

  ctx.fillStyle = colour; // square colour
  ctx.fillRect(x*SQ, y*SQ, SQ, SQ); // draw inside of square: coordinates and size of square

  ctx.strokeStyle = "White"; // stroke colour
  ctx.strokeRect(x*SQ, y*SQ, SQ, SQ); // draw stroke: coordinates and size of square
}

let snakeArray = []; // array of snake - squares (1) vacants (0) apple (2) blueapple (3)
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

// move or extend the snake according to live board
function actualizeBoard (mode) {
  for (i = 0; i < ROW; i++) {
    for (j = 0; j < COL; j++) {
        if (liveArray[i][j] + mode == 0 && mode != 0) snakeArray[i][j] = 0;
        if (liveArray[i][j] > 0) liveArray[i][j] = liveArray[i][j] + mode;
        if (liveArray[i][j] < 0 ) {
          snakeArray[i][j] = 0;
          liveArray[i][j] = 0;
        }
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
          if (snakeArray[i][j] == 3) drawSquare(i, j, BLUEAPPLE);
      }
  }
}

drawBoard();

let snakeLength = 1;

let blueAppleProb = 0;

// generate random square number not being snake - square
function randomSquare () { 
  let r = Math.floor(Math.random() * (ROW * COL - snakeLength - 1));
  let typeRandom = Math.floor(Math.random() * 1000) + 1;
  let type = "APPLE";
  if (typeRandom < blueAppleProb) {
    type = "BLUEAPPLE";
    blueAppleProb = 0;
  }
  else blueAppleProb = blueAppleProb + 100;
  let counter = 0;
  for (i = 0; i < ROW; i++) {
    for (j = 0; j < COL; j++) {
      if (snakeArray[i][j] == 0) {
        if (counter === r) return {corx: i, cory: j, appleType: type};
        counter++;
      }
    }
  }
  console.log("error");
  errors.innerHTML = "generate random numbers error!!!";
  return {corx: 0, cory: 0, appleType: type};
}

// snake's head direction
let dir = "EAST";

// snake's head coordinates
let center = {corx: Math.floor(0.5 * COL), cory: Math.floor(0.5 * ROW)};
let snakeHead = {corx: center.corx, cory: center.cory};
snakeArray[snakeHead.corx][snakeHead.cory] = 1;
liveArray[snakeHead.corx][snakeHead.cory] = 1;

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

// score counter
let score = 0;

// checks if snake ate an apple. if so, creates new one.
function checkApple (isInit) {
  if (snakeArray[snakeHead.corx][snakeHead.cory] > 1 || isInit) {
    let apple = randomSquare();
    if (apple.appleType == "APPLE") snakeArray[apple.corx][apple.cory] = 2;
    else if (apple.appleType == "BLUEAPPLE") snakeArray[apple.corx][apple.cory] = 3;
    else {
      console.log("error");
      errors.innerHTML = "apple type error!!!";
    }
    if (!isInit && snakeArray[snakeHead.corx][snakeHead.cory] == 2) {
      snakeLength = snakeLength + 3;
      actualizeBoard(3);
      score += snakeLength - 3;
      countScore.innerHTML = score;
    }
    else if (!isInit && snakeArray[snakeHead.corx][snakeHead.cory] == 3) {
      let tmpScore = Math.floor(0.7 * snakeLength);
      let oldLength = snakeLength;
      snakeLength = Math.max(Math.floor(0.3 * snakeLength), 1);
      actualizeBoard(snakeLength - oldLength);
      score += tmpScore;
      countScore.innerHTML = score;
    }
  }
}

// init apple
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
    liveArray[snakeHead.corx][snakeHead.cory] = snakeLength+1;
    actualizeBoard (-1);
    drawBoard();
  }
}

// counter of game-over graphics
let gameOverAnimation = 0;

// handle arrow press frequency
let arrowPress = true;
let arrowQueue = -1;

// main game loop
let loopStart = Date.now ();
function mainGameLoop () {
  let now = Date.now ();
  let dt = now - loopStart;
  if(dt > 100){
    if (arrowQueue != -1 && arrowPress == true) {
      CONTROL ({keyCode: (-1) * arrowQueue})
    }
    arrowPress = true;
    if (!gameOver) moveSnake ();
    else if (gameOverAnimation < 7) {
      handleGameOver (gameOverAnimation % 2);
      gameOverAnimation = gameOverAnimation + 1;
    }
    loopStart = Date.now ();
  }
  requestAnimationFrame (mainGameLoop);
};

// shows game-over graphics
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

// arrow control handle
document.addEventListener("keydown", CONTROL);

function CONTROL (event) {
  if (!gameOver) {
    if(arrowPress == false && arrowQueue == -1) {
      arrowQueue = event.keyCode;
    }
    else if (arrowPress == true) {
      arrowPress = false;
      if (event.keyCode < 0) arrowQueue = -1;
      if(event.keyCode == 37 || event.keyCode == -37) {
        if (dir != "EAST" || snakeLength == 1) dir = "WEST";
      }
      if(event.keyCode == 38 || event.keyCode == -38) {
        if (dir != "SOUTH" || snakeLength == 1) dir = "NORTH";
      }
      if(event.keyCode == 39 || event.keyCode == -39) {
        if (dir != "WEST" || snakeLength == 1) dir = "EAST";
      }
      if(event.keyCode == 40 || event.keyCode == -40) {
        if (dir != "NORTH" || snakeLength == 1) dir = "SOUTH";
      }
    }
    else {
      console.log("uwaga, nacisnieto wiecej strzalek:");
      console.log(arrowQueue);
      console.log(event.keyCode);
    }
  }
};

mainGameLoop ();