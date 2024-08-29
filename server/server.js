const axios = require('axios');
const io = require('socket.io')(3000, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const { determineStartingPlayer, playRound, checkEndCondition } = require('./gameLogic');
const rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', async (roomName, userName) => {
        console.log('joinRoom: ' + roomName + ' ' + userName);
        socket.username = userName;
        if (!rooms[roomName]) {
            rooms[roomName] = { players: [], deckId: null, hands: {}, currentSuit: null };
        }
        rooms[roomName].players.push(userName);
        socket.join(roomName);
        io.to(roomName).emit('updatePlayers', rooms[roomName].players);
    });

    socket.on('startGame', async (roomName) => {
        console.log("game started for " + roomName);
        const room = rooms[roomName];
        if (room && room.players.length > 0) {
            // Create a new deck if not already created
            if (!room.deckId) {
                const deckResponse = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                room.deckId = deckResponse.data.deck_id;
            }
            const deckId = room.deckId;
            const players = room.players;
            const cardsPerPlayer = Math.floor(52 / players.length);
            const extraCards = 52 % players.length;

            for (let i = 0; i < players.length; i++) {
                const numCards = i < extraCards ? cardsPerPlayer + 1 : cardsPerPlayer;
                const drawResponse = await axios.get("https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numCards}");
                room.hands[players[i]] = drawResponse.data.cards;
            }

            const startingPlayer = determineStartingPlayer(players, room.hands);
            if (startingPlayer) {
                room.currentSuit = 'SPADES'; // Start with Spades
                io.to(roomName).emit('roundStart', startingPlayer, room.currentSuit);
            }
        }
    });

    socket.on('playCard', (roomName, player, card) => {
        const room = rooms[roomName];
        const players = room.players;
        if (room && players.includes(player)) {
            const nextPlayer = playRound(room, room.currentSuit, players);
            const loser = checkEndCondition(room);
            if (loser) {
                io.to(roomName).emit('gameEnd', loser);
            } else {
                room.currentSuit = card.suit; // Set the current suit for the next round
                io.to(roomName).emit('roundStart', nextPlayer, room.currentSuit);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

console.log('Server-side code running');