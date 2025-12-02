const { body, param, query, validationResult } = require('express-validator')
const { usuario, carrito, productocarrito, producto } = require('../models');

let self = {}

//GET api/pedido
self.getAll = async function (req, res, next) {
    let data = []
    try {
        data = await carrito.findAll({
            attributes: ['id', 'updatedAt'],
            include: [{
                model: productocarrito,
                as: 'productocarritos',
                attributes: ['id', 'cantidad', 'subtotal'],
                include: {
                    model: producto,
                    as: 'producto',
                    attributes: ['titulo', 'precio'],
                }
            }, {
                model: usuario,
                as: 'usuario',
                attributes: ['email']
            }
            
            ]
        })
    } catch (error) {
        return next(error)
    }

    const pedidos = data.map((carrito) => {
        return {
            id: carrito.id,
            cliente: carrito.usuario.email,
            fecha: carrito.updatedAt,
            productos: carrito.productocarritos.map((producto) => {
                return {
                    id: producto.id,
                    titulo: producto.producto.titulo,
                    cantidad: producto.cantidad,
                    precio: producto.producto.precio,
                    subtotal: producto.subtotal
                }
            })
        }
    })
    return res.status(200).json(pedidos)
}

//GET api/pedido/{userid}
self.getByUser = async function (req, res, next) {
    //TODO:Verificar que el userid haga match con el decoded token
}

module.exports = self