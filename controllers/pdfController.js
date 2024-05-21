const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const Service = require('../models/service');

const uploadPDF = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    const dataBuffer = fs.readFileSync(filePath);

    pdf(dataBuffer).then(data => {
        const lines = data.text.split('\n');
        lines.forEach(line => {
            const [service, time, cost] = line.split(',');
            if (service && time && cost) {
                const newService = new Service({ service, time, cost: parseFloat(cost) });
                newService.save();
            }
        });
        res.status(200).send('File uploaded and data extracted successfully.');
    }).catch(err => {
        res.status(500).send('Error processing PDF: ' + err.message);
    });
};

module.exports = {
    uploadPDF,
};
