// operations/add_user.js
const User = require('../models/User'); // Assuming you have a User model defined

const addUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

module.exports = addUser;
