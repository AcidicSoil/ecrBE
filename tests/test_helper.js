const Service = require('../models/service');
const User = require('../models/user');

const initialServices = [
    {
        content: 'Laptop Cleaning',
        time: '1.5 hours',
        cost: 180
    },
    {
        content: 'Virus Removal',
        time: '2 hours',
        cost: 200
    }
];

const nonExistingId = async () => {
    const service = new Service({ content: 'willremovethissoon', time: '1 hour', cost: 100 });
    await service.save();
    await service.remove();

    return service._id.toString();
};

const servicesInDb = async () => {
    const services = await Service.find({});
    return services.map(service => service.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(u => u.toJSON());
};

module.exports = {
    initialServices,
    nonExistingId,
    servicesInDb,
    usersInDb,
};
