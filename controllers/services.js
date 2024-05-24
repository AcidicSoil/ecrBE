// /controllers/services.js
const Service = require('../models/service'); // Assuming you have a Service model
const { io } = require('../index'); // Import io instance from index.js

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createService = async (req, res) => {
    try {
        const newService = new Service(req.body);
        const savedService = await newService.save();
        io.emit('FromAPI', savedService); // Emit event to Socket.io clients
        res.status(201).json(savedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        io.emit('FromAPI', updatedService); // Emit event to Socket.io clients
        res.json(updatedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
