const router = require('express').Router()
const archivos = require('../controllers/archivos.controller')
const Authorize = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware')

//GET: api/archivos
router.get('/', Authorize('Administrador'), archivos.getAll)

//GET: api/archivos/{id}
router.get('/:id', Authorize('Administrador'), archivos.validator, archivos.get)

//GET: api/archivos/{id}/detalle
router.get('/:id/detalle', Authorize('Administrador'), archivos.validator, archivos.getDetalle)

//POST: api/archivos
router.post('/', Authorize('Administrador'), upload.single('file'), archivos.create)

//PUT: api/archivos/{id}
router.put('/:id', Authorize('Administrador'), upload.single('file'), archivos.validator, archivos.update)

//DELETE: api/archivos/{id}
router.delete('/:id', Authorize('Administrador'), archivos.validator, archivos.delete)

module.exports = router