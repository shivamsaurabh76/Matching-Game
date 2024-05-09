/*
 * Create a list that holds all of your cards
 */
var cards = ['fa-diamond', 'fa-diamond',
             'fa-paper-plane-o','fa-paper-plane-o',
             'fa-anchor',  'fa-anchor',
             'fa-bolt',    'fa-bolt',
             'fa-cube',    'fa-cube',
             'fa-leaf' ,   'fa-leaf',
             'fa-bomb'  ,  'fa-bomb',
             'fa-bicycle'  ,  'fa-bicycle',
            ];

var maxMoves = 3; // Maximum moves (lives) allowed
var moves = maxMoves; // Initialize moves counter
var gameover = false; // Flag to track game over state

function generateCard(card){
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`
}

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

function initGame(){
    var deck = document.querySelector('.deck');
    var cardHTML = shuffle(cards).map(function(card){
        return generateCard(card);
    });

    deck.innerHTML = cardHTML.join('');
    attachCardListeners(); // Attach event listeners to the cards
}

initGame();

var allCards = document.querySelectorAll('.card');
var openCards = [];

function attachCardListeners() {
    allCards = document.querySelectorAll('.card'); // Re-select all cards
    allCards.forEach(function(card) {
        card.addEventListener('click', cardClick);
    });
}

function cardClick(e) {
    if (!gameover) {
        var card = e.target;

        if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
            openCards.push(card);
            card.classList.add('open', 'show');

            if (openCards.length == 2) {
                if (openCards[0].dataset.card == openCards[1].dataset.card) {
                    openCards[0].classList.add('match');
                    openCards[1].classList.add('match');
                    openCards = [];
                } else {
                    setTimeout(function() {
                        openCards.forEach(function(card) {
                            card.classList.remove('open', 'show');
                        });
                        openCards = [];
                        decrementMoves(); // Decrement moves/lives
                    }, 1000);
                }
            }
        }
    }
}

// Restart button functionality
var restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', resetGame);

// Reset game state
function resetGame() {
    moves = maxMoves; // Reset moves counter
    gameover = false; // Reset game over flag
    updateMoveCounter();

    openCards = [];
    allCards.forEach(function(card) {
        card.classList.remove('open', 'show', 'match');
    });

    initGame(); // Regenerate the card deck and reattach event listeners
}

// Update move counter on the UI
function updateMoveCounter() {
    document.querySelector('.moves').textContent = moves;

    // Update star colors based on remaining moves
    var stars = document.querySelectorAll('.stars .fa');
    if (moves == 3) {
        stars.forEach(function(star) {
            star.style.color = 'lightgreen'; // 3 stars in light green
        });
    } else if (moves == 2) {
        stars[2].style.color = 'lightgrey'; // Hide the third star
        stars[1].style.color = 'yellow';
        stars[0].style.color = 'yellow'; // 2 stars in yellow
    } else if (moves == 1) {
        stars[1].style.color = 'lightgrey'; // Hide the second star
        stars[0].style.color = 'red'; // 1 star in red
    } else if(moves == 0){
        stars[0].style.color = 'lightgrey';
    }
}

// Decrement moves (lives) and check game over condition
function decrementMoves() {
    moves--;
    updateMoveCounter();

    if (moves <= 0) {
        endGame(); // No more moves left, end the game
    }
}

// End game
function endGame() {
    gameover = true; // Set game over flag
    alert('Game Over! You have used up all your moves.'); // Replace with your end game logic
}
