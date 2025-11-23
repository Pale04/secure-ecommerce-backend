const { producto, categoria, Sequelize } = require('../models')
const { body, validationResult } = require('express-validator')
const Op = Sequelize.Op

let self = {}

self.productoValidator = [
    body('titulo', 'El campo {0} es obligatorio').not().isEmpty(),
    body('descripcion', 'El campo {0} es obligatorio').not().isEmpty(),
    body('precio', 'El campo {0} es obligatorio').not().isEmpty().isDecimal({ force_decimal: false }),
]

//GET: api/productos
self.getAll = async function (req, res, next) {
    const { s } = req.query
    const filters = {}
    
    if (s) {
        filters.titulo = {
            [Op.like]: `%${s}%`
        }
    }
    
    let data
    try {
        data = await producto.findAll({
            where: filters,
            attributes: [['id', 'productoId'], 'titulo', 'descripcion', 'precio', 'archivoid'],
            include: {
                model: categoria,
                as: 'categorias',
                attributes: [['id', 'categoriasId'], 'nombre', 'protegida'],
                through: { attributes: []}
            },
            subQuery: false
        })
    } catch (error) {
        return next(error)
    }

    return res.status(200).json(data)
}

//GET: api/productos/{id}
self.get = async function (req, res, next) {
    let id = req.params.id
    let data = null

    try {
        data = await producto.findByPk(id, {
            attributes: [['id', 'productoId'], 'titulo', 'descripcion', 'precio', 'archivoid'],
            include: {
                model: categoria,
                as: 'categorias',
                attributes: [['id', 'categoriaId'], 'nombre', 'protegida'],
                through: { attributes: [] }
            }
        })
    } catch (error) {
        return next(error)
    }

    if(data) {
        res.status(200).json(data)
    } else {
        res.status(404).send()
    }
}

//POST: api/productos
self.create = async function (req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        throw new Error(JSON.stringify(errors));
    }
    
    let data
    try {
        data = await producto.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            archivoid: req.body.archivoid || null
        })
    } catch (error) {
        return next(error)
    }

    req.bitacora('producto.crear', data.id)
    res.status(201).json(data)
}

//PUT: api/productos/{id}
self.update = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new Error(JSON.stringify(errors))
    }

    let id = req.params.id
    let data
    try {
        data = await producto.update({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            archivoid: req.body.archivoid || null
        }, { where: {id: id} })
    } catch (error) {
        return next(error)
    }

    if(data[0] === 0) {
        return res.status(404).send()
    }

    req.bitacora('producto.editar', id)
    res.status(204).send()
}

//DELETE: api/productos/{id}
self.delete = async function (req, res, next) {
    let id = req.params.id
    let data = null
   
    try {
        data = await producto.findByPk(id)
        if (data) {
            data = await producto.destroy({ where: { id: id } })
        }
    } catch (error) {
        return next(error)
    }

    if (data === 1) {
        req.bitacora('producto.eliminar', id)
        res.status(204).send()
    } else {
        res.status(404).send()
    }
}

//POST: api/productos/{id}/categoria
self.asignaCategoria = async function (req, res, next) {
    let itemToAssign = null
    let item = null

    try {
        itemToAssign = await categoria.findByPk(req.body.categoriaid)
        item = await producto.findByPk(req.params.id)
        if (item && itemToAssign) {
            await item.addCategoria(itemToAssign)
        }
    } catch (error) {
        return next(error)
    }

    if (!itemToAssign || !item) {
        res.status(404).send()
    } else {
        req.bitacora('productocategoria.agregar', `${req.params.id}:${req.body.categoriaid}`)
        res.status(204).send()
    }
}

//DELETE: api/prodcutos/{id}/categoria/{id}
self.eliminaCategoria = async function (req, res, next) {
    let itemToRemove = null
    let item = null

    try {
        itemToRemove = await categoria.findByPk(req.params.categoriaid)
        item = await producto.findByPk(req.params.id)
        if (itemToRemove && item) {
            await item.removeCategoria(itemToRemove)
        }
    } catch (error) {
        return next(error)
    }

    if (!itemToRemove || !item) {
        res.status(404).send()
    } else {
        req.bitacora('productocategoria.remover', `${req.params.id}:${req.params.categoriaid}`)
        res.status(204).send()
    }
}

module.exports = self