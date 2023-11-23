const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.listTransaction)
router.post('/', Controller.postCreateTransaction)
router.post('/deposit', Controller.postTransactionDeposit)



module.exports = router




