const playButton = document.getElementById('playbutton');
const hitButton = document.getElementById('hitbutton');
const standButton = document.getElementById('standbutton');
const titleImage = document.getElementById('title-image');
const playerHand = document.getElementById('playerhand');
const dealerHand = document.getElementById('dealerhand');
const playerValueDisplay = document.getElementById('playerhandvalue');
const dealerValueDisplay = document.getElementById('dealerhandvalue');
const resetButton = document.getElementById('resetbutton');

let gameDeck, deckNumber, playerCardValue, dealerCardValue, playerAceCount, dealerAceCount, playerHandCode, dealerHandCode;

playButton.addEventListener('click', function () {
    playButton.style.display = 'none';
    titleImage.style.display = 'none';
    playerValueDisplay.style.display = 'block';
    dealerValueDisplay.style.display = 'block';
    hitButton.style.visibility = 'visible';
    standButton.style.visibility = 'visible';
    playerHand.style.display = 'block';
    dealerHand.style.display = 'block';

    newGame();
});

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }
    toString() {
        return `${this.suit}${this.value}`;
    }
}

class Deck {
    constructor() {
        this.deck = [];
        this.suits = ['&#x1F0B', '&#x1F0C', '&#x1F0D', '&#x1F0A'];
        this.values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'D', 'E'];
    }

    createDeck() {
        for (let suit of this.suits) {
            for (let value of this.values) {
                this.deck.push(new Card(suit, value));
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[i]];
        }
    }
}

resetButton.addEventListener('click', function () {
    resetGame();
});

function resetGame() {
    resetButton.style.display = 'none';
    hitButton.disabled = false;
    standButton.disabled = false;
    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';
    playerValueDisplay.innerHTML = '';
    dealerValueDisplay.innerHTML = '';
    newGame();
}

function getCardValue(card) {
    //A = 10
    //B = Jack
    //D = Queen
    //E = King
    if (card === '1') return 11; // Ace
    else if (card === 'A' || card === 'B' || card === 'D' || card === 'E') return 10; // Face cards
    else // For Cards that are their own number
        return parseInt(card);
}

function newGame() {
    gameDeck = new Deck();
    gameDeck.createDeck();
    gameDeck.shuffleDeck();

    deckNumber = 0;
    playerCardValue = 0;
    dealerCardValue = 0;
    playerAceCount = 0;
    dealerAceCount = 0;
    playerHandCode = '';
    dealerHandCode = '';
    backofCard = '&#x1F0A0'; // Hidden card emoji

    // Deal the dealer's first card (shown) and a hidden card
    let dealerCard = gameDeck.deck[deckNumber++];
    dealerCardValue = getCardValue(dealerCard.value);
    if (dealerCard.value === '1') dealerAceCount++;
    dealerHandCode = dealerCard.toString(); // First card shown
    dealerHand.innerHTML = `${dealerHandCode} ${backofCard}`;
    dealerValueDisplay.textContent = `Dealer's Hand Value: ${getCardValue(dealerCard.value)}`;

    // Deal two cards to the player
    for (let i = 0; i < 2; i++) {
        let playerCard = gameDeck.deck[deckNumber++];
        playerCardValue += getCardValue(playerCard.value);
        if (playerCard.value === '1') playerAceCount++;
        playerHandCode += `${playerCard.toString()} `;
    }

    //Display player's hand and values
    playerHand.innerHTML = playerHandCode;
    playerValueDisplay.textContent = `Player's Hand Value: ${playerCardValue}`;

    //Check for blackjack
    if (playerCardValue === 21 && dealerCardValue === 21) {
        gameOutcome("tied", "You both got BlackJack!");
    } else if (playerCardValue === 21) {
        gameOutcome("won", "You got BlackJack!");
    }
}


hitButton.addEventListener('click', function () {
    let playerCard = gameDeck.deck[deckNumber++];
    
    if (playerCard.value === '1') playerAceCount++;
    playerHandCode += `${playerCard.toString()} `;
    playerHand.innerHTML = playerHandCode;
    playerCardValue += getCardValue(playerCard.value);
    while (playerCardValue > 21 && playerAceCount > 0) {
        playerCardValue -= 10;
        playerAceCount--;
    }
    playerValueDisplay.textContent = `Player's Hand Value: ${playerCardValue}`;
    if (playerCardValue > 21) {
        gameOutcome("lost", "You busted!");
    }
});

standButton.addEventListener('click', function () {
    let hiddenCard = gameDeck.deck[deckNumber++];
    dealerCardValue += getCardValue(hiddenCard.value);
    if (hiddenCard.value === '1') dealerAceCount++;
    dealerHandCode += ` ${hiddenCard.toString()}`;
    dealerHand.innerHTML = dealerHandCode;
    dealerValueDisplay.textContent = `Dealer's Hand Value: ${dealerCardValue}`;

    while (dealerCardValue < 17) {
        let dealerCard = gameDeck.deck[deckNumber++];
        dealerCardValue += getCardValue(dealerCard.value);
        if (dealerCard.value === '1') dealerAceCount++;
        dealerHandCode += ` ${dealerCard.toString()}`;
        dealerHand.innerHTML = dealerHandCode;
        dealerValueDisplay.textContent = `Dealer's Hand Value: ${dealerCardValue}`;

        while (dealerCardValue > 21 && dealerAceCount > 0) {
            dealerCardValue -= 10;
            dealerAceCount--;
            dealerValueDisplay.textContent = `Dealer's Hand Value: ${dealerCardValue}`;
        }
    }

    
    if (dealerCardValue > 21) {
        gameOutcome("won", "Dealer Busted!");
    } else if (playerCardValue > dealerCardValue) {
        gameOutcome("won", "You Beat the Dealer!");
    } else if (playerCardValue < dealerCardValue) {
        gameOutcome("lost", "Dealer Wins!");
    } else {
        gameOutcome("tied", "It's a Tie!");
    }
});
function gameOutcome(result, message) {
    const resultMessageBox = document.getElementById('resultmessage');
    const resultText = document.getElementById('resulttext');

    resultMessageBox.style.display = 'block';
    resultText.textContent = message;
    if (result === 'won') {
        resultMessageBox.style.backgroundColor = 'green';
    } else if (result === 'lost') {
        resultMessageBox.style.backgroundColor = 'red';
    } else {
        resultMessageBox.style.backgroundColor = 'grey';
    }
    resetButton.style.display = 'block';
    hitButton.disabled = true;
    standButton.disabled = true;
    resetButton.addEventListener('click', function () {
        resultMessageBox.style.display = 'none';
    });
}
