const Service = require('../models/service');

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createService = async (req, res) => {
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
};

const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (req.body.service != null) {
            service.service = req.body.service;
        }
        if (req.body.time != null) {
            service.time = req.body.time;
        }
        if (req.body.cost != null) {
            service.cost = req.body.cost;
        }
        const updatedService = await service.save();
        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        await service.remove();
        res.json({ message: 'Deleted Service' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllServices,
    createService,
    updateService,
    deleteService,
};
