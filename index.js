const express = require('express');
const app = express();

// Define services as a constant since it doesn't seem to be modified
let services = [
    {
        "id": 1,
        "service": "Laptop Cleaning",
        "time": "1.5 hours",
        "cost": 180
    },
    {
        "id": 2,
        "service": "Network Troubleshooting",
        "time": "2 hours",
        "cost": 240
    },
    {
        "id": 3,
        "service": "Data Transfer",
        "time": "1.5 hours",
        "cost": 180
    }
];

// Middleware for logging requests
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
}

// Middleware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

// Function to generate a new ID for a service
const generateId = () => {
    const maxId = services.length > 0 ? Math.max(...services.map(n => n.id)) : 0;
    return maxId + 1;
};

// Use express.json() middleware to parse JSON bodies
app.use(express.json());

// Use requestLogger middleware
app.use(requestLogger);

// Route to get all services
app.get('/api/services', (req, res) => {
    res.json(services);
});

// Route to add a new service
app.post('/api/services', (request, response) => {
    const body = request.body;

    if (!body.service || !body.time || !body.cost) {
        return response.status(400).json({
            error: 'Missing service details'
        });
    }

    const service = {
        service: body.service,
        time: body.time,
        cost: body.cost,
        id: generateId(),
    };

    services = services.concat(service);

    response.json(service);
});

// Use unknownEndpoint middleware
app.use(unknownEndpoint);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});