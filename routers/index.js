const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')
const {isLoggedIn, isAdmin, guestOnly, isCustomer} = require('../middlewares/auth')

const admin = require('./admin')
const companies = require('./companies')
const transactions = require('./transactions')
const balanceHistories = require('./balanceHistories')

router.get('/login', guestOnly, Controller.login)
router.post('/login', guestOnly, Controller.postLogin)

router.get('/register', guestOnly, Controller.register)
router.post('/register', guestOnly, Controller.postRegister)

router.get('/logout', isLoggedIn, Controller.logout)


router.use('/admin', isLoggedIn, isAdmin, admin)

router.use('/companies', isLoggedIn, isCustomer, companies)
router.use('/transactions', isLoggedIn, isCustomer, transactions)
router.use('/balance-histories', isLoggedIn, isCustomer, balanceHistories)


module.exports = router
