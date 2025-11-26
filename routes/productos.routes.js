const router = require('express').Router()
const productos = require('../controllers/productos.controller')
const Authorize = require('../middlewares/auth.middleware')

//GET: api/productos
router.get('/', Authorize('Usuario,Administrador'), productos.queryValidator, productos.getAll)

//GET api/productos/{id}
router.get('/:id', Authorize('Usuario,Administrador'), productos.productoParamValidator, productos.get)

//POST: api/productos
router.post('/', Authorize('Administrador'), productos.productoBodyValidator, productos.create)

//PUT: api/productos/{id}
router.put('/:id', Authorize('Administrador'), [...productos.productoParamValidator, ...productos.productoBodyValidator], productos.update)

//DELETE api/productos/{id}
router.delete('/:id', Authorize('Administrador'), productos.productoParamValidator, productos.delete)

//POST: api/productos/{id}/categoria
router.post('/:id/categoria', Authorize('Administrador'), [...productos.productoParamValidator, ...productos.categoriaBodyValidator],  productos.asignaCategoria)

//DELETE: api/productos/{id}/categoria/{id}
router.delete('/:id/categoria/:categoriaid', Authorize('Administrador'), [...productos.productoParamValidator, ...productos.categoriaParamValidator], productos.eliminaCategoria)

module.exports = router