const router = require('express').Router();
const ctrl = require('../controllers/carrito.controller');
const val = require('../validators/carrito.validators');
const { validationResult } = require('express-validator');
const Auth = require('../middlewares/auth.middleware'); // middleware que pone req.user

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/actual', Auth('Usuario'), ctrl.getActual);
//router.get('/historial', Auth('Usuario'), ctrl.historial);

router.post('/:idcarrito/productos', Auth('Usuario'), val.agregarProducto, handleValidation, ctrl.agregaProducto);
router.put('/:idcarrito/productos/:idproducto', Auth('Usuario'), val.modificarCantidad, handleValidation, ctrl.modificarCantidad);
router.delete('/:idcarrito/productos/:idproducto', Auth('Usuario'), val.eliminarProducto, handleValidation, ctrl.quitarProducto);

router.put('/comprar/:id', Auth('Usuario'), ctrl.comprar);

module.exports = router;
