const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), pdfController.uploadPDF);

module.exports = router;
