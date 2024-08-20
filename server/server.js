const axios = require('axios');
const io = require('socket.io')(3000, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const rooms = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', async (roomName, userName) => {
        console.log('joinRoom: ' + roomName + ' ' + userName);
        socket.username = userName;
        if (!rooms[roomName]) {
            rooms[roomName] = { players: [], deckId: null, hands: {} };
        }
        rooms[roomName].players.push(userName);
        socket.join(roomName);
        io.to(roomName).emit('updatePlayers', rooms[roomName].players);
    });

    socket.on('startGame', async (roomName) => {
        console.log("game started for " + roomName);
        if (rooms[roomName] && rooms[roomName].players.length > 0) {
            // Create a new deck if not already created
            console.log("getting deckId for " + roomName)
            if (!rooms[roomName].deckId) {
                const deckResponse = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                rooms[roomName].deckId = deckResponse.data.deck_id;
            }
            const deckId = rooms[roomName].deckId;
            const players = rooms[roomName].players;
            const totalPlayers = (players.length > 3) ? players.length : 4;
            const cardsPerPlayer = Math.floor(52 / totalPlayers);
            const extraCards = 52 % totalPlayers;
            const shuffledPlayers = players.sort(() => 0.5 - Math.random());
            for (let i = 0; i < totalPlayers; i++) {
                // Calculate the number of cards for the current player
                const numCards = i < extraCards ? cardsPerPlayer + 1 : cardsPerPlayer;
            
                // Draw the cards for the current player
                const drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numCards}`);
                rooms[roomName].hands[shuffledPlayers[i]] = drawResponse.data.cards;
            }

            // Send cards to each player
            for (const player of rooms[roomName].players) {
                const playerSocketId = Object.keys(io.sockets.sockets).find(id => io.sockets.sockets[id].username === player);
                io.to(playerSocketId).emit('dealCards', rooms[roomName].hands[player]);
            }
            console.log("Sent cards")
        } else {
            console.log("There are no players")
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

console.log('Server-side code running');
