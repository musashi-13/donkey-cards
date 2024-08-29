const cardOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function getCardValue(card) {
    return cardOrder.indexOf(card.value);
}

function getHighestCard(cards) {
    return cards.reduce((highest, card) => {
        if (!highest || getCardValue(card) > getCardValue(highest)) {
            return card;
        }
        return highest;
    }, null);
}

function determineStartingPlayer(players, hands) {
    // Find the player with the Ace of Spades
    for (let player of players) {
        if (hands[player].some(card => card.value === 'ACE' && card.suit === 'SPADES')) {
            return player;
        }
    }
    return null;
}

function playRound(room, currentSuit, players) {
    let highestCard = null;
    let highestPlayer = null;
    let punishmentCard = null;

    for (let player of players) {
        const hand = room.hands[player];
        const card = hand.find(c => c.suit === currentSuit);
        if (card) {
            hand.splice(hand.indexOf(card), 1); // Remove the card from the player's hand
            if (!highestCard || getCardValue(card) > getCardValue(highestCard)) {
                highestCard = card;
                highestPlayer = player;
            }
        } else {
            punishmentCard = hand.shift(); // Punish by playing the first card
            if (!highestCard) {
                highestCard = punishmentCard;
                highestPlayer = player;
            }
            break;
        }
    }

    if (punishmentCard) {
        room.hands[highestPlayer].push(...players.flatMap(p => room.hands[p])); // Give all round cards to highest card holder
    }

    return highestPlayer;
}

function checkEndCondition(room) {
    const playersWithCards = Object.keys(room.hands).filter(player => room.hands[player].length > 0);
    if (playersWithCards.length === 1) {
        return playersWithCards[0]; // Return the loser
    }
    return null; // Game continues
}

module.exports = { determineStartingPlayer, playRound, checkEndCondition };
