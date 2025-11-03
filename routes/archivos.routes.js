const router = require('express').Router()
const archivos = require('../controllers/archivos.controller')
const Authorize = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware')

//GET: api/archivos
router.get('/', Authorize('Administrador'), archivos.getAll)

//GET: api/archivos/{id}
router.get('/:id', Authorize('Administrador'), archivos.get)

//GET: api/archivos/{id}/detalle
router.get('/:id/detalle', Authorize('Administrador'), archivos.getDetalle)

//POST: api/archivos
router.post('/', upload.single('file'), Authorize('Administrador'), archivos.create)

//PUT: api/archivos/{id}
router.put('/:id', upload.single('file'), Authorize('Administrador'), archivos.update)

//DELETE: api/archivos/{id}
router.delete('/:id', Authorize('Administrador'), archivos.delete)

module.exports = router