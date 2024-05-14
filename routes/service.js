const express = require('express');
const router = express.Router();

// Example service data or fetch from a database
const services = [{ name: "Service One", price: 100 }];

router.get('/services', (req, res) => {
    res.json(services);
});

module.exports = router;
