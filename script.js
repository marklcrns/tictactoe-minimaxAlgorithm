/* with easy AI generating random moves */

var origBoard;
var playerScore = (document.querySelector("#player").innerHTML = 0);
var computerScore = (document.querySelector("#computer").innerHTML = 0);
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  // horizontals
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // verticals
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6]
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  // before starting...
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    // remove background color
    cells[i].style.removeProperty("background-color");
    // get the cell id everytime a cell is clicked
    cells[i].addEventListener("click", turnClick, false);
  }
}

function restartGame() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    // remove background color
    cells[i].style.removeProperty("background-color");
    // get the cell id everytime a cell is clicked
    cells[i].addEventListener("click", turnClick, false);
  }
  document.querySelector("#player").innerHTML = 0;
  document.querySelector("#computer").innerHTML = 0;
}

function turnClick(square) {
  // prevent from selecting the same cell
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    // if not tie and huPlayer hasn't won, ai take a turn
    if (!checkTie(huPlayer) && !checkWin(origBoard, huPlayer))
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  // input marker (player) in the square
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  // win check
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  // a = accumulator, e = element, i = index
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      // stores the winning player index and marker
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  // paint all winCombos squares with color
  var winner = gameWon.player;
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      winner == huPlayer ? "rgb(104, 222, 134)" : "rgb(222, 104, 120)";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  scoreUpdate(winner);

  declareWinner(winner == huPlayer ? "You win!" : "You lose.");
}

// update scoreboard
function scoreUpdate(winner) {
  if (winner === huPlayer) {
    playerScore += 1;
    document.querySelector("#player").innerHTML = playerScore;
  } else {
    computerScore += 1;
    document.querySelector("#computer").innerHTML = computerScore;
  }
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter(s => typeof s == "number");
}

function bestSpot() {
  // generates random empty spot
  return minimax(origBoard, aiPlayer).index;
}

function checkTie(player) {
  // if no empty squares and no winner
  if (emptySquares().length === 0 && !checkWin(origBoard, player)) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "rgb(57, 159, 227)";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }
  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
