// /index.js
const http = require('http');
const app = require('./app'); // Import the Express app
const config = require('./utils/config');
const logger = require('./utils/logger');
const socketIo = require('socket.io');

// Create an HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // React dev server URL
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});

module.exports = { io }; // Export io instance
