const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.listCompany)
router.get('/:id', Controller.detailCompany)


module.exports = router




