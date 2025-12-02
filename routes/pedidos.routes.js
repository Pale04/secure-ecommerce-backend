const router = require('express').Router()
const pedidos = require('../controllers/pedidos.controller')
const Authorize = require('../middlewares/auth.middleware')

//GET api/pedido
router.get('/', Authorize('Administrador'), pedidos.getAll)

module.exports = router