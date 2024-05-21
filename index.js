const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const serviceRoutes = require('./routes/serviceRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const userRoutes = require('./routes/userRoutes');
const logger = require('./logger');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 5000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AyaNova Clone API',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

app.use(bodyParser.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('Error connecting to MongoDB', err));

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.use('/services', serviceRoutes);
app.use('/pdf', pdfRoutes);
app.use('/users', userRoutes);

app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send('Something went wrong!');
});

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
