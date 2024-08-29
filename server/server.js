const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const io = require('socket.io')(3000, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', async (roomName, userName) => {
        console.log(`${userName} has joined ${roomName}`);
        if (!rooms[roomName]) {
            rooms[roomName] = { players: [], deckId: null };
        }
        rooms[roomName].players.push({ id: socket.id, username: userName, hand: []});
        socket.join(roomName);
        io.to(roomName).emit('updatePlayers', rooms[roomName].players);
    });

    socket.on('startGame', async (roomName) => {
        console.log(`Game started for ${roomName}`);
        if (rooms[roomName] && rooms[roomName].players.length > 0) {
            // Create a new deck if not already created
            if (!rooms[roomName].deckId) {
                console.log(`Getting deckId for ${roomName}`);
                const deckResponse = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                rooms[roomName].deckId = deckResponse.data.deck_id;
            } else{
                console.log(`Reshuffling cards for ${roomName}`);
                const deckResponse = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deckId}/return/`);
                rooms[roomName].deckId = deckResponse.data.deck_id;
            }
            const deckId = rooms[roomName].deckId;
            const players = rooms[roomName].players;
            totalPlayers = totalPlayers > 3 ? totalPlayers : 4
            const totalPlayers = players.length;  // Use the actual number of players
            const cardsPerPlayer = Math.floor(52 / totalPlayers);
            const extraCards = 52 % totalPlayers;

            for (let i = 0; i < totalPlayers; i++) {
                // Calculate the number of cards for the current player
                const numCards = i < extraCards ? cardsPerPlayer + 1 : cardsPerPlayer;

                // Draw the cards for the current player
                const drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numCards}`);
                players[i].hand = drawResponse.data.cards;  // Assign hand to the player
            }

            // Send cards to each player
            for (const player of players) {
                const playerSocketId = player.id;
                console.log(`Sending cards to player: ${player.username}, Socket ID: ${playerSocketId}`);
                if (playerSocketId) {
                    io.to(playerSocketId).emit('dealCards', player.hand);  // Send hand to the player
                } else {
                    console.error(`Player ${player.username} not found in socket connections`);
                }
            }
        } else {
            console.log("There are no players in the room");
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

console.log('Server-side code running');
