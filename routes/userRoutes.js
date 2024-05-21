const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.getUsers);

module.exports = router;
