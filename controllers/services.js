const servicesRouter = require('express').Router();
const Service = require('../models/service');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
};

servicesRouter.get('/', async (request, response) => {
    const services = await Service.find({}).populate('user', { username: 1, name: 1 });
    response.json(services);
});

servicesRouter.post('/', async (request, response) => {
    const body = request.body;

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const service = new Service({
        content: body.content,
        user: user._id
    });

    const savedService = await service.save();
    user.services = user.services.concat(savedService._id);
    await user.save();

    response.json(savedService);
});

servicesRouter.get('/:id', async (request, response) => {
    const service = await Service.findById(request.params.id);
    if (service) {
        response.json(service);
    } else {
        response.status(404).end();
    }
});

servicesRouter.delete('/:id', async (request, response) => {
    await Service.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

servicesRouter.put('/:id', (request, response, next) => {
    const body = request.body;

    const service = {
        content: body.content
    };

    Service.findByIdAndUpdate(request.params.id, service, { new: true })
        .then(updatedService => {
            response.json(updatedService);
        })
        .catch(error => next(error));
});

module.exports = servicesRouter;
