const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    service: { type: String, required: true },
    time: { type: String, required: true },
    cost: { type: Number, required: true },
});

module.exports = mongoose.model('Service', ServiceSchema);
