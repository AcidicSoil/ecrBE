// services.js

const express = require('express');
const servicesRouter = express.Router();

const Service = require('../models/service');

// Get all services
servicesRouter.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific service
servicesRouter.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service == null) {
            return res.status(404).json({ message: 'Cannot find service' });
        }
        res.json(service);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Add a new service
servicesRouter.post('/', async (req, res) => {
    const service = new Service({
        service: req.body.service,
        time: req.body.time,
        cost: req.body.cost,
    });
    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a service
servicesRouter.put('/:id', async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a service
servicesRouter.delete('/:id', async (req, res) => {
    try {
        await Service.findByIdAndRemove(req.params.id);
        res.json({ message: 'Deleted Service' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = servicesRouter;