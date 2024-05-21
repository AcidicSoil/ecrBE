const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Retrieve a list of services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: A list of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The service ID
 *                     example: 605c72ef8e31f500174e6d6c
 *                   service:
 *                     type: string
 *                     description: The service name
 *                     example: Laptop Cleaning
 *                   time:
 *                     type: string
 *                     description: The time required for the service
 *                     example: 1.5 hours
 *                   cost:
 *                     type: number
 *                     description: The cost of the service
 *                     example: 180
 */

router.get('/', serviceController.getAllServices);
router.post('/', serviceController.createService);
router.patch('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
