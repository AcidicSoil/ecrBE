const router = require('express').Router()
const Service = require('../models/service')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
    await Service.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = router