"use strict";

let flag = "pen-flag"; // Initial turn: Penguins (Player)
let counter = 9; // Number of moves left in the game
let winningLine = null; // To store the winning line (if any)

const squares = document.getElementsByClassName("square");
const squareArray = Array.from(squares);
const newGameBtnDisplay = document.getElementById("newgame-btn");
const newGameBtn = document.getElementById("btn90");

const gameSounds = [
    "sound/click_sound1.mp3", // Player's click
    "sound/click_sound2.mp3", // Computer's click
    "sound/penwin_sound.mp3", // Penguins win
    "sound/bearwin_sound.mp3", // Bear win
    "sound/draw_sound.mp3"    // Draw
];

const lineArray = [
    ["a_1", "a_2", "a_3"],
    ["b_1", "b_2", "b_3"],
    ["c_1", "c_2", "c_3"],
    ["a_1", "b_1", "c_1"],
    ["a_2", "b_2", "c_2"],
    ["a_3", "b_3", "c_3"],
    ["a_1", "b_2", "c_3"],
    ["a_3", "b_2", "c_1"]
];

const msgText = {
    "pen-turn": '<p class="image"><img src="img/penguins.jpg" width="61" height="61"></p><p class="text">Penguins Attack!(your turn)</p>',
    "bear-turn": '<p class="image"><img src="img/whitebear.jpg" width="61" height="61"></p><p class="text">Whitebear Attack!(computer turn)</p>',
    "pen-win": '<p class="image"><img src="img/penguins.jpg" width="61" height="61"></p><p class="text animate__animated animate__lightSpeedInRight">Penguins Win!!</p>',
    "bear-win": '<p class="image"><img src="img/whitebear.jpg" width="61" height="61"></p><p class="text animate__animated animate__lightSpeedInLeft">WhiteBear Win!!</p>',
    "draw": '<p class="image"><img src="img/penguins.jpg" width="61" height="61"><img src="img/whitebear.jpg" width="61" height="61"></p><p class="text animate__bounceIn">Draw!!</p>'
};

function setMessage(id) {
    const msgTextElement = document.getElementById("msgtext");
    if (msgTextElement) {
        msgTextElement.innerHTML = msgText[id] || msgText["pen-turn"];
    }
}

function isWinner(symbol) {
    return lineArray.some(line => {
        if (line.every(id => document.getElementById(id).classList.contains(symbol))) {
            winningLine = line;
            return true;
        }
        return false;
    });
}

function isSelect(selectSquare) {
    if (winningLine) return true; // If there's already a winner, stop further actions.

    let gameOverFlg = false;
    let currentClass = flag === "pen-flag" ? "js-pen-checked" : "js-bear-checked";
    let nextFlag = flag === "pen-flag" ? "bear-flag" : "pen-flag";
    let message = flag === "pen-flag" ? "bear-turn" : "pen-turn";

    let sound = new Audio(gameSounds[flag === "pen-flag" ? 0 : 1]);
    sound.currentTime = 0;
    sound.play();

    selectSquare.classList.add(currentClass, "js-unclickable");
    selectSquare.classList.remove("js-clickable");

    if (isWinner(currentClass)) {
        setMessage(flag === "pen-flag" ? "pen-win" : "bear-win");
        gameOver(flag === "pen-flag" ? "penguins" : "bear");
        return true; // Game over
    }

    setMessage(message);
    flag = nextFlag;
    counter--;

    if (counter === 0) {
        setMessage("draw");
        gameOver("draw");
        return true; // Game over
    }

    return gameOverFlg;
}

function gameOver(status) {
    const soundMap = {
        "penguins": gameSounds[2],
        "bear": gameSounds[3],
        "draw": gameSounds[4]
    };

    let music = new Audio(soundMap[status]);
    music.currentTime = 0;
    music.play();

    document.getElementById("squaresBox").classList.add("js-unclickable");
    newGameBtnDisplay.classList.remove("js-hidden");

    if (status === "penguins") {
        highlightWinningSquares("pen");
        $(document).snowfall({ flakeColor: "rgb(255,240,245)", maxSpeed: 3, minSpeed: 1, maxSize: 20, minSize: 10, round: true });
    } else if (status === "bear") {
        highlightWinningSquares("bear");
        $(document).snowfall({ flakeColor: "rgb(175,238,238)", maxSpeed: 3, minSpeed: 1, maxSize: 20, minSize: 10, round: true });
    }
}

function highlightWinningSquares(symbol) {
    if (!winningLine) return;

    for (let squareId of winningLine) {
        document.getElementById(squareId).classList.add(`js-${symbol}_highLight`);
    }
}

function bearTurn() {
    if (winningLine || counter === 0) {
        return; // Stop if the game is over
    }

    if (isReach("bear")) return; // Bear's turn logic to block or win
    if (isReach("penguins")) return; // Check if the player has a chance to win

    const availableSquares = squareArray.filter(square => square.classList.contains("js-clickable"));

    setTimeout(() => {
        const randomSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
        isSelect(randomSquare);
    }, 2000); // 2-second delay for bear's move
}

function isReach(status) {
    let bearTurnEnd = false;

    lineArray.some(line => {
        let bearCheckCnt = 0;
        let penCheckCnt = 0;
        let emptySquare = null;

        line.forEach(id => {
            const square = document.getElementById(id);
            if (square.classList.contains("js-bear-checked")) {
                bearCheckCnt++;
            } else if (square.classList.contains("js-pen-checked")) {
                penCheckCnt++;
            } else if (square.classList.contains("js-clickable")) {
                emptySquare = square;
            }
        });

        if ((status === "bear" && bearCheckCnt === 2 && penCheckCnt === 0 && emptySquare) ||
            (status === "penguins" && penCheckCnt === 2 && bearCheckCnt === 0 && emptySquare)) {
            isSelect(emptySquare); // Use isSelect instead of square.click()
            bearTurnEnd = true;
            return true;
        }
    });

    return bearTurnEnd;
}

function startNewGame() {
    flag = "pen-flag";
    counter = 9;
    winningLine = null;

    for (let square of squareArray) {
        square.classList.remove("js-pen-checked", "js-bear-checked", "js-unclickable", "js-pen_highLight", "js-bear_highLight");
        square.classList.add("js-clickable");
    }

    document.getElementById("squaresBox").classList.remove("js-unclickable");
    setMessage("pen-turn");
    newGameBtnDisplay.classList.add("js-hidden");
    $(document).snowfall("clear");
}

window.addEventListener("DOMContentLoaded", function () {
    setMessage("pen-turn"); // Show initial message for penguin's turn
    for (let square of squareArray) {
        square.classList.add("js-clickable");
    }

    for (let square of squareArray) {
        square.addEventListener('click', () => {
            if (flag === "bear-flag") return; // Ignore clicks during bear's turn
            let gameOverFlg = isSelect(square);
            if (!gameOverFlg && flag === "bear-flag") {
                setTimeout(() => bearTurn(), 2000); // Delay bear's turn by 2 seconds
            }
        });
    }

    newGameBtn.addEventListener("click", startNewGame);
});