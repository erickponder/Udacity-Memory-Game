/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//GLOBAL
var deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8;

deck.addEventListener('click', function(event) {
    var clickTarget = event.target;
    if (isClickValid(clickTarget)) {
         if(clockOff) {
             startClock();
             clockOff = false;
         }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggledCards.length === 2) {
            checkForMatch(clickTarget);
            addMove();
            checkScore();
        }
        
        if (matched === TOTAL_PAIRS) {
            gameOver();
        }
    }
});
 
function toggleCard(card){
        card.classList.toggle('open');
        card.classList.toggle('show');
}

function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
    console.log(toggledCards);
}


function checkForMatch() {
    if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className){
        toggledCards[0].classList.toggle('match');
        toggledCards[1].classList.toggle('match');
        toggledCards = [];
        matched++;
    } else {
        setTimeout(function(){
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = []; 
        }, 500);
    }
}

/*function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}
*/


function isClickValid(clickTarget) {
    return (
        clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)
    );
}


/********************************************
    SHUFFLE DECK
********************************************/

function shuffleDeck() {
    var cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    var shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}
shuffleDeck();


//HOW MANY MOVES
function addMove() {
    moves++;
    var movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function checkScore() {
    if (moves === 10 || moves === 20) {
        hideStar();
    }
}

function hideStar() {
    var starList = document.querySelectorAll('.stars li'); for (star of starList) {
        if (star.style.display !== 'none'){
            star.style.display = 'none';
            break;
        }
    }
}
//hideStar();
//hideStar();


/**************************************************
******************** CLOCK *******************
**************************************************/

function startClock() {
    let clockId = setInterval(function(){
        time++;
        displayTime();
    }, 1000);
}

  function displayTime() {
           const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            const clock = document.querySelector(".clock");
            clock.innerHTML = time;
            if (seconds < 10) {
                clock.innerHTML = `${minutes}:0${seconds}`;
            }  else {
                clock.innerHTML = `${minutes}:${seconds}`;
         }  

    }




function stopClock() {
    clearInterval(clockId);
}


/**********************************************
    TOGGLE MODAL
********************************************/

function toggleModal() {
    var modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}

toggleModal()
toggleModal()

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

/*
//Modal tests
time = 121;
displayTime(); // 201
moves = 16;
checkScore(); //2 stars
toggleModal();
*/

function writeModalStats() {
    var timeStat = document.querySelector('.modal_time');
    var clockTime = document.querySelector('.clock').innerHTML;
    var movesStat = document.querySelector('.modal_moves');
    var starsStat = document.querySelector('.modal_stars');
    var stars = getStars();
    
    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
}

writeModalStats();

document.querySelector('.modal_cancel').addEventListener('click', () => {
  toggleModal();
});

document.querySelector('.modal_replay').addEventListener('click', () => {
toggleModal();
resetGame();
});

document.querySelector('.restart').addEventListener('click', resetGame);

document.querySelector('.modal_close').addEventListener('click', toggleModal);


/**********************RESET**********************/
function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
}

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}


/*****************CHECK FOR MATCH ****************************/


function gameOver() {
    stopClock();
    writeModalStats();
    toggleModal();
    resetMatch();
    resetCards();
    toggledCards = [];
}

/*
function replayGame() {
    resetGame();
    toggleModal();
}
*/

function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

function resetMatch() {
    matched = 0;
}