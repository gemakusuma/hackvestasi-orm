const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.listCompany)
router.get('/:id', Controller.detailCompany)
// router.get('/', Controller.tes)


module.exports = router




