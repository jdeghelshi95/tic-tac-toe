var board = [ [' ', ' ', ' '] , [' ', ' ', ' '] , [' ', ' ', ' ']];
let computer = false;
let thinking = false;
let gameActive = true;
let currentPlayer = "X";
let xwins = 0;
let owins = 0;
let draws = 0;

const drawMessage = () => { 
    draws++;
    document.getElementById('draws').innerHTML = draws;
    return `Game ended in a draw!` 
};
const winningMessage = () => {
    if(currentPlayer == 'X') {
        xwins++;
        document.getElementById('xwins').innerHTML = xwins;
    }
    else {

        owins++;
        document.getElementById('owins').innerHTML = owins;
    }
   return `Player ${currentPlayer} has won!`; 
}

const currentPlayerTurn = () => {


   return  `It's ${currentPlayer}'s turn`;
}

function getWinner(board) {
    if(board[0][0] != ' ') {
        if(board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            return board[0][0];
        }
    }
    if(board[0][2] != ' ') {
        if(board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
            return board[0][2];
        }
    }

    for(let row = 0 ; row < 3 ; row ++) {
        if(board[row][0] != ' ') {
            if(board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
                return board[row][0];
            }
        }
    }

    for(let col = 0 ; col < 3 ; col ++) {
        if(board[0][col] != ' ') {
            if(board[0][col] == board[1][col] && board[1][col] == board[2][col]) {
                return board[0][col];
            }
        }
    }

    return ' ';
}

function test() {
    if(getWinner(board) != ' ') {
        console.log('Wrong');
    }

    let b2 = [...board];
    b2[0][0] = 'X';
    b2[0][1] = 'X';
    b2[0][2] = 'X';

    if(getWinner(b2) != 'X') {
        console.log('WRONG!');
    }

    b2 = [...board];
    b2[0][0] = 'O';
    b2[1][0] = 'O';
    b2[2][0] = 'O';

    if(getWinner(b2) != 'O') {
        console.log('WRONG!');
    }

    b2 = [...board];
    b2[0][0] = 'X';
    b2[1][1] = 'X';
    b2[2][2] = 'X';
    if(getWinner(b2) != 'X') {
        console.log('WRONG!');
    }
}

const statusDisplay = document.querySelector('.gamestatus');

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gStatus[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function isFilled(board) {
    for(let row = 0 ; row < 3 ; row++) {
        for(let col = 0 ; col < 3 ; col++) {
        
            if(board[row][col] == ' ') {
                return false;
            }
        }
    }
    return true;
}

function isTerminal(board) {
    return getWinner(board) != ' ' || isFilled(board);

}

function aiMove() {
    let value = -10;
    let best = [];
    let b2 = [...board];
    for(let row = 0 ; row < 3 ; row++) {
        for(let col = 0 ; col < 3 ; col++) {
            if(b2[row][col] == ' ') {
                b2[row][col] = currentPlayer;
                let nextValue = minimax(b2, 9, false);
                if(nextValue > value) {
                    value = nextValue;
                    best = [row, col];
                }
                b2[row][col] = ' ';
            }
        }
    }

    return best;
}
function minimax(board, depth, maximizing) {
    
    let winner = getWinner(board);
    if(depth == 0) {
        return 0;
    }
    
    if(winner == currentPlayer)
    {
        if(maximizing) return depth + 1;
        return -1;   
    }
    if(winner != ' ') {
        if(maximizing) return - (depth + 1);
        return 1;
    }
    if(isFilled(board)) {
        return 0;
    } 

    if(maximizing) {
        let value = -10;
        let b2 = [...board];
        for(let row = 0 ; row < 3 ; row++) {
            for(let col = 0 ; col < 3 ; col++) {
                if(b2[row][col] == ' ') {
                    b2[row][col] = currentPlayer;
                    let nextValue = minimax(b2, depth -1, false);
                    if(nextValue > value) {
                        value = nextValue;
                    }
                    b2[row][col] = ' ';
                }
            }
        }
        return value;
    }
    else {
        let value = 10;
        let b2 = [...board];
        for(let row = 0 ; row < 3 ; row++) {
            for(let col = 0 ; col < 3 ; col++) {
                if(b2[row][col] == ' ') {
                    if(currentPlayer == 'O') {
                        b2[row][col] = 'X';
                    }
                    else {
                        b2[row][col] = 'O';
                    }
                    let nextValue = minimax(b2, depth -1, true);
                    if(nextValue < value) {
                      
                        value = nextValue;
                    }
                    b2[row][col] = ' ';
                }
            }
        }
        return value;
    }
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
    const row = parseInt(clickedCellIndex / 3);
    const col = clickedCellIndex % 3;

    if (board[row][col] != ' ' || !gameActive || ( computer && thinking)) {
        return;
    }
   
    clickedCell.innerHTML = currentPlayer;
    board[row][col] = currentPlayer;
    if(getWinner(board) == currentPlayer) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
    }
    else if(isFilled(board)) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = true;
    }
    else {
        handlePlayerChange();
        if(computer) {
            let b2 = [...board];
            let move = aiMove();
            board[move[0]][move[1]] = currentPlayer;
            let cells = document.querySelectorAll('.cell');
            let pos = move[0] * 3 + move[1];
            cells[pos].innerHTML = currentPlayer;
            
            if(getWinner(board) == currentPlayer) {
                statusDisplay.innerHTML = winningMessage();
            }
            else if(isFilled(board)) {
                statusDisplay.innerHTML = drawMessage();
            }
            else {
                thinking = false;
                handlePlayerChange();
            }
        }
    }
}

function inProgress() {
    if(gameActive) {
        for(let i = 0 ; i < 3 ; i ++) {
            for(let j = 0 ; j < 3 ; j++) {
                if(board[i][j] != ' ') {
                    return true;
                }
            }
        }
    }

    return false;
}
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    for(let i = 0 ; i < 3 ; i ++) {
        for(let j = 0 ; j < 3 ; j++) {
            board[i][j] = ' ';
        }
    }
    
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

function playHuman() {
    if(inProgress()) {
        if(!confirm("Game in progress do you want to Reset?")) {
            return;
        }
    }
    handleRestartGame();
    computer = false;
}

function playAi() {
    if(inProgress()) {
        if(!confirm("Game in progress do you want to Reset?")) {
            return;
        }
    }
    handleRestartGame();
    computer = true;
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.playHuman').addEventListener('click', playHuman);
document.querySelector('.playAi').addEventListener('click', playAi);

