const { body, param } = require('express-validator');

module.exports = {
  crearCarrito: [ body('usuarioid').isUUID().withMessage('usuarioid debe ser UUID') ],
  agregarProducto: [
    param('idcarrito').isUUID().withMessage('carritoid inválido'),
    body('idproducto').isInt({ min: 1 }),
    body('cantidad').isInt({ min: 1 })
  ],
  modificarCantidad: [
    param('idcarrito').isUUID(),
    param('idproducto').isInt({ min: 1 }),
    body('cantidad').isInt({ min: 1 })
  ],
  eliminarProducto: [
    param('idcarrito').isUUID(),
    param('idproducto').isInt({ min: 1 })
  ]
};
