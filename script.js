const scoreCounter = document.querySelector('.score-counter');
const grid = document.querySelector('.grid');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');

let columns = 10;
let rows = 10;
let totalCells = columns * rows;
const totalBombs = Math.floor(totalCells / 5);
const maxScore = totalCells - totalBombs;
const bombsList = [];
const allCells = [];
const flagContainer = [totalCells];
const bombContainer = [totalCells];
let score = 0;
let flagCounter = 0;
let zerosCounter = [];
scoreCounter.innerText = String(totalBombs).padStart(3, 0);

for (let i = 0; i < columns * rows; i++) {
    flagContainer[i] = 0;
}
//posizione delle bombe
while (bombsList.length < totalBombs) {
    const x = Math.floor(Math.random() * totalCells) + 1;
    if (!bombsList.includes(x)) {
        bombsList.push(x);
    }
    //console.log(x);
};
for (let i = 0; i < columns * rows; i++) {
    if (bombsList.includes(i + 1)) {
        bombContainer[i] = 1;
    }
}

//console.log(bombsList);
// griglia

for (let i = 1; i <= totalCells; i++) {
    let j = i - 1;
    const cell = document.createElement('div');
    cell.classList.add('cell');

    if ( j % 2 ^ Math.floor(j / columns) % 2 ) cell.classList.add('cell-dark');

    grid.appendChild(cell);
    allCells.push(cell);
    //click destro

    cell.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();
        if (cell.classList.contains('cell-flag')) {
            cell.classList.remove('cell-flag');
            flagContainer[j] = 0;
            flagCounter--;
            scoreCounter.innerText = String(totalBombs - flagCounter).padStart(3, 0);
        }
        else {
            if (!cell.classList.contains('cell-clicked')) {
                cell.classList.add('cell-flag');
                flagContainer[j] = 1;
                flagCounter++;
                scoreCounter.innerText = String(totalBombs - flagCounter).padStart(3, 0);
            }
            else {
                return;
            }
        }
    });
    //click della cella
    cell.addEventListener('click', function () {
        clickCells(cell, i, true);
    });


    //console.log(i);
}

function count(cellPosition, container) {
    let counter = 0;
    let neighbour = cellPosition - columns - 1;
    let corner;
    if (cellPosition % columns === 1) {
        corner = 1;
    }
    else if (cellPosition % columns === 0) {
        corner = 2;
    }
    else {
        corner = 0;
    }

    while (neighbour < cellPosition + columns + 2) {
        if (corner === 1) {
            if (neighbour === cellPosition - columns - 1) {
                neighbour++;
            }
        }
        if (container[neighbour - 1] === 1) counter++;
        if (neighbour <= cellPosition - columns) {

            if (corner === 2 & neighbour === cellPosition - columns) {
                neighbour = neighbour + columns - 1;
            }
            else {
                neighbour++;
            }

        }
        else if (neighbour === cellPosition - columns + 1) {
            if (corner === 1) {
                neighbour = neighbour + columns;
            }
            else {
                neighbour = neighbour + columns - 2;
            }
        }
        else if (neighbour === cellPosition - 1) {
            if (corner === 2) {
                neighbour = neighbour + columns;
            }
            else {
                neighbour = neighbour + 2;
            }

        }
        else if (neighbour === cellPosition + 1) {
            if (corner === 1) {
                neighbour = neighbour + columns - 1;
            }
            else {
                neighbour = neighbour + columns - 2;
            }
        }
        else if (neighbour > cellPosition + columns - 2) {
            if (corner === 2 & neighbour === cellPosition + columns) {
                neighbour = cellPosition + columns + 2;
            }
            else {
                neighbour++;
            }
        }
        else {
            neighbour = cellPosition + columns + 2;
        }
    }
    return counter;
}
function clickCells(cell, position, handClicked) {
    //console.log(count(position, flagContainer));
    if (cell.classList.contains('cell-flag')) {
        return;
    }
    else {

        if (bombsList.includes(position)) {
            cell.classList.add('cell-bomb');
            endGame(false);
        }
        else {
            if (cell.classList.contains('cell-clicked')) {
                if (count(position, bombContainer) !== 0) {
                    if (count(position, bombContainer) === count(position, flagContainer) & handClicked === true) {
                        clickSurroundingCells(cell, position);
                        //console.log(count(position, flagContainer));
                    }
                }

                return;
            }
            else {
                cell.classList.add('cell-clicked');
                updateScore();
                //numero

                if (count(position, bombContainer) === 0) {
                    zerosCounter.push(position);
                    //console.log(zerosCounter);
                    clickSurroundingCells(cell, position);

                }
                else {
                    cell.innerText = count(position, bombContainer);
                }
            }
        }
    }

}

function clickSurroundingCells(cell, position) {
    let neighbour = position - columns - 1;
    let tb;
    let corner;
    if (position % columns === 1) {
        corner = 1;
    }
    else if (position % columns === 0) {
        corner = 2;
    }
    else {
        corner = 0;
    }
    if (position <= columns) {
        tb = 1;
    }
    else if (position > columns * (rows - 1)) {
        tb = 2;
    }
    else tb = 0;
    while (neighbour < position + columns + 2) {
        if (tb === 1 & neighbour === position - columns - 1) {
            if (corner === 1) {
                neighbour = neighbour + columns + 2;
            }
            else {
                neighbour = neighbour + columns;
            }

        }
        if (corner === 1 & tb !== 1) {
            if (neighbour === position - columns - 1) {
                neighbour++;
            }
        }
        const cellToClick = allCells[neighbour - 1];
        clickCells(cellToClick, neighbour, false);
        if (neighbour <= position - columns) {

            if (corner === 2 & neighbour === position - columns) {
                neighbour = neighbour + columns - 1;
            }
            else {
                neighbour++;
            }
        }
        else if (neighbour === position - columns + 1) {
            if (corner === 1) {
                neighbour = neighbour + columns;
            }
            else {
                neighbour = neighbour + columns - 2;
            }
        }
        else if (neighbour === position - 1) {
            if (corner === 2) {
                if (tb === 2) {
                    neighbour = position + columns + 2;
                }
                else {
                    neighbour = neighbour + columns;
                }
            }
            else {
                neighbour = neighbour + 2;
            }
        }
        else if (neighbour === position + 1) {
            if (tb === 2) {
                neighbour = position + columns + 2;
            }
            else {
                if (corner === 1) {
                    neighbour = neighbour + columns - 1;
                }
                else {
                    neighbour = neighbour + columns - 2;
                }
            }
        }
        else if (neighbour > position + columns - 2) {
            if (corner === 2 & neighbour === position + columns) {
                neighbour = position + columns + 2;
            }
            else {
                neighbour++;
            }
        }
        else {
            neighbour = position + columns + 2;
        }
    }
}


//console.log(zerosCounter)

function updateScore() {
    score++;
    if (score === maxScore) endGame(true);
}

function endGame(isVictory) {
    if (isVictory === true) {
        endGameScreen.classList.add('win');
        endGameText.innerHTML = 'hai<br>vinto';
        scoreCounter.innerText = String('000').padStart(3, 0);
    }
    showBombs(isVictory);

    endGameScreen.classList.remove('hidden');
}

playAgainButton.addEventListener('click', function () {
    location.reload();
})
function showBombs(isVictory) {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
        if (bombsList.includes(i + 1)) {
            const cellToReveal = cells[i];
            if (isVictory === false) cellToReveal.classList.add('cell-bomb');
            else cellToReveal.classList.add('cell-flag');
        }
    }
}