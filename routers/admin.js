const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller')


router.get('/', Controller.adminListCompany)
router.get('/create', Controller.adminCreateCompany)
router.post('/create', Controller.adminPostCreateCompany)
router.get('/:id/delete', Controller.adminDeleteCompany)
router.get('/:id/edit', Controller.adminEditCompany)
router.post('/:id/edit', Controller.adminUpdateCompany)


module.exports = router




