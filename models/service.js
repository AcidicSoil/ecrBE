const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    service: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
})

serviceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Service', serviceSchema)