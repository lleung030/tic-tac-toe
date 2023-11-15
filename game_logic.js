let currentPlayerElement = document.getElementById('currentPlayer');
let playerText = document.getElementById('playerText');
let restartBtn = document.getElementById('restartBtn');
let boxes = Array.from(document.getElementsByClassName('box'));
let scoreXElement = document.getElementById('scoreX');
let scoreOElement = document.getElementById('scoreO');

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks');

const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);
let gameInProgress = true;

let scoreX = 0;
let scoreO = 0;

const startGame = () => {
    boxes.forEach(box => box.addEventListener('click', boxClicked));
}

function boxClicked(e) {
    if (!gameInProgress) {
        return;
    }

    const id = e.target.id;

    if (!spaces[id]) {
        spaces[id] = currentPlayer;
        e.target.innerText = currentPlayer;

        if (playerHasWon() !== false) {
            playerText.innerHTML = `${currentPlayer} has won!`;
            let winning_blocks = playerHasWon();

            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);

            updateScore(); // Update the score when someone wins
            gameInProgress = false;
            return;
        }

        if (isBoardFull()) {
            playerText.innerHTML = "It's a draw!";
            gameInProgress = false;
            return;
        }

        switchPlayer();

        if (currentPlayer === O_TEXT && gameInProgress) {
            setTimeout(makeComputerMove, 500);
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT;
    currentPlayerElement.textContent = currentPlayer;
}

function isBoardFull() {
    return spaces.every(space => space !== null);
}

const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function playerHasWon() {
    for (const condition of winningCombos) {
        let [a, b, c] = condition;

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a, b, c];
        }
    }
    return false;
}

function makeComputerMove() {
    if (!gameInProgress) {
        return;
    }

    let emptyCells = spaces.reduce((acc, val, index) => {
        if (val === null) {
            acc.push(index);
        }
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        let computerMove = emptyCells[randomIndex];

        spaces[computerMove] = O_TEXT;
        boxes[computerMove].innerText = O_TEXT;

        if (playerHasWon() !== false) {
            playerText.innerHTML = `${O_TEXT} has won!`;
            let winning_blocks = playerHasWon();
            winning_blocks.map(box => boxes[box].style.backgroundColor = winnerIndicator);

            updateScore(); // Update the score when someone wins
            gameInProgress = false;
            return;
        }

        if (isBoardFull()) {
            playerText.innerHTML = "It's a draw!";
            gameInProgress = false;
            return;
        }

        switchPlayer();
    }
}

function updateScore() {
    if (currentPlayer === X_TEXT) {
        scoreX++;
        scoreXElement.textContent = scoreX;
    } else if (currentPlayer === O_TEXT) {
        scoreO++;
        scoreOElement.textContent = scoreO;
    }
}

restartBtn.addEventListener('click', restart);

function restart() {
    spaces.fill(null);

    boxes.forEach(box => {
        box.innerText = '';
        box.style.backgroundColor = '';
    });

    playerText.innerHTML = 'Tic Tac Toe';

    currentPlayer = X_TEXT;
    currentPlayerElement.textContent = currentPlayer;

    gameInProgress = true;

    if (currentPlayer === O_TEXT) {
        setTimeout(makeComputerMove, 500);
    }
}

startGame();
