import Cell from './cell.js';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');


//Global variables
const rows = 8;
const cols = 8;
const boardHeight = 400;
const boardWidth = 400;
const size = 50;

// Game Variables
let grid;
let mousePos = [0,0];
let mouseX;
let mouseY;
let selectedPiece;
let jumpedPiece;
let selectedCol;
let selectedRow;



// pieces
let empty = 0;
let black = 1;
let white = 2;
let king = 3;

let pieces = [
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [2,0,2,0,2,0,2,0],
  [0,2,0,2,0,2,0,2],
  [2,0,2,0,2,0,2,0]
];


// initial Render
render();


 export function make2DArray(cols,rows){
  let arr = new Array(cols);
  for(let i = 0; i < arr.length; i++){
    arr[i] = new Array(rows);
  }
  return arr;
}


// make a new cell for each
function setupBoard(){
  grid = make2DArray( cols, rows );

  // initialize new cell in each spot
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j] = new Cell(i* size, j* size,  size);
    }
  }
}

function drawBoard(){
  setupBoard();
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      if(j%2 == 0){
        if(i % 2 == 0 && j % 2 == 0){
          grid[i][j].show("#000");
        } else{
          grid[i][j].show("#8b0000");
        }
      }
      if(j % 2 !== 0){
        if(i % 2 == 0){
          grid[i][j].show("#8b0000");
        } else {
          grid[i][j].show("#000");
        }
      }
    }
  }
}


function DrawPieces(){

  // loop over Pieces
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){

      // if 1 draw black piece
      if(pieces[j][i] === black){
        context.beginPath();
        context.arc(i*size + size/2, j*size + size/2, size/3 , 0, 2*Math.PI);
        context.fillStyle = '#000';
        context.fill();
        context.closePath();
      }

      if(pieces[j][i] === white){
        context.beginPath();
        context.arc(i*size + size/2, j*size + size/2, size/3 , 0, 2*Math.PI);
        context.fillStyle = '#fff';
        context.fill();
        context.closePath();
      }

      if(pieces[j][i] === king) {
        context.beginPath();
        context.arc(i*size + size/2, j*size + size/2, size/3 , 0, 2*Math.PI);
        context.fillStyle = '##FFCC00';
        context.fill(); 
        context.closePath();
      }
    }
  }
}


function getMousePos(mouse) {
  var mouseX = mouse.clientX - document.getElementById('canvas').getBoundingClientRect().left;
  var mouseY = mouse.clientY - document.getElementById('canvas').getBoundingClientRect().top;

  mousePos = [Math.floor(mouseX/size),Math.floor(mouseY/size)];
}


canvas.addEventListener('mousedown', selectPiece, false);


function selectPiece(){

  getMousePos(event);


  for(let i = 0; i < pieces.length; i++){
    for(let j = 0; j < pieces.length; j++){

      //check if i and j are same as mousePos
      if(i == mousePos[0] && j == mousePos[1]){

        // set pieceRow and Piece col so i have the position of the startPiece
        selectedCol = mousePos[0];
        selectedRow = mousePos[1];

        // set selectedPiece
        selectedPiece = pieces[j][i];

        console.log(selectedPiece);

        // set the value to 0
        pieces[j][i] = 0;
      }
    }
  }

  // add eventlistener for mousedrag
  canvas.addEventListener('mousemove', pieceDrag,  false);
  // add eventlistner for pieceDrop
  canvas.addEventListener('mouseup', pieceDrop, false);
}


function pieceDrag(){
  getMousePos(event);

  // render the new board
  render();

  // draw piece on mousePosition
  context.beginPath();
  context.arc(mousePos[0]*size + size/2, mousePos[1]*size + size/2, size/3 , 0, 2*Math.PI);
  // check for the piececolor
  if(selectedPiece == 1)
  {
    context.fillStyle = '#000';
  }
   else if( selectedPiece == 2)
  {
    context.fillStyle = '#fff';
  }
  context.fill();
  context.closePath();
}


function pieceDrop(){

  getMousePos(event);

  // check if the position to drop already has a piece
  let isPiece = hasPiece();

  // check if the position to drop is a legal diagonal move
  let isDiagonal = isDiagonalMove();

  // check if position to drop is a legal jump move
  let isJump = isJumpMove();

  if(!isPiece){

    if(isJump && !isDiagonal){

      if( selectedPiece == 1){
        // draw selected piece at mouse Position
        pieces[mousePos[1]][mousePos[0]] = selectedPiece;

        // set jumped Piece to 0
        pieces[mousePos[1] - 1][(mousePos[0] + selectedCol)/2] = 0;
      }

      if(selectedPiece == 2){

        // draw selected piece at mouse Position
        pieces[mousePos[1]][mousePos[0]] = selectedPiece;

        // set jumped Piece to 0
        pieces[mousePos[1] + 1][(mousePos[0] + selectedCol)/2] = 0;
      }
    }

    if(isDiagonal && !isJump){
      // set new position to selected Piece
      pieces[mousePos[1]][mousePos[0]] = selectedPiece;
    }
  }

  // If Illegal Move Set position Back to start Position
  if(!isDiagonal && !isJump || isPiece) {
    pieces[selectedRow][selectedCol] = selectedPiece;
  }

  // render the new board
  render();

  // remove the mousedrag listner
  canvas.removeEventListener('mousemove', pieceDrag, false);
}


function hasPiece(){
  let hasPiece = false;
    if(pieces[mousePos[1]][mousePos[0]] != 0){
      hasPiece = true;
    }
  return hasPiece;
}


function isDiagonalMove(){

  getMousePos(event);

  let isValidDiagonal = false;

  let isPiece = hasPiece();

  if(selectedPiece == 1){
    if((mousePos[1] == selectedRow + 1 && mousePos[0] == selectedCol + 1) ||
       (mousePos[1] == selectedRow + 1 && mousePos[0] == selectedCol - 1) && 
       (!isPiece)){

        isValidDiagonal = true;
    }
  }

  if(selectedPiece == 2){
    if((mousePos[1] == selectedRow - 1 && mousePos[0] == selectedCol + 1) ||
       (mousePos[1] == selectedRow - 1 && mousePos[0] == selectedCol - 1)){

        isValidDiagonal = true;
    }
  }

  return isValidDiagonal;
}


function isJumpMove(){

  getMousePos(event);

  let isValidJump = false;

  if(selectedPiece == 1){
    
    if((mousePos[1] == selectedRow + 2 && mousePos[0] == selectedCol + 2) ||
      (mousePos[1] == selectedRow + 2 && mousePos[0] == selectedCol - 2)){

      if((pieces[mousePos[1] - 1][mousePos[0] + 1] == 2) ||
        (pieces[mousePos[1] - 1][mousePos[0] - 1] == 2)){

          isValidJump = true;
      }
      else {
        isValidJump = false;
      }
    }
    else {
      isValidJump = false;
    }
  }

  if(selectedPiece == 2){
    
    if((mousePos[1] == selectedRow - 2 && mousePos[0] == selectedCol + 2) ||
      (mousePos[1] == selectedRow - 2 && mousePos[0] == selectedCol - 2)){

      if((pieces[mousePos[1] + 1][mousePos[0] + 1] == 1) ||
        (pieces[mousePos[1] + 1][mousePos[0] - 1] == 1)){

          isValidJump = true;
      }
      else {
        isValidJump = false;
      }
    }
    else {
      isValidJump = false;
    }
  }
  return isValidJump;
}


function render(){
  context.clearRect(0, 0, boardWidth, boardHeight);
  drawBoard();
  DrawPieces();
}