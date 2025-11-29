const { producto, categoria, Sequelize } = require('../models')
const { body, param, query, validationResult } = require('express-validator')
const Op = Sequelize.Op
const { archivo } = require('../models')
const { DOUBLE } = require('sequelize')

let self = {}

self.queryValidator = [
    query('s').trim().escape()
]

self.productoParamValidator = [
    param('id').isInt().withMessage('El ID del producto no es valido')
]

self.productoBodyValidator = [
    body('titulo')
        .notEmpty().withMessage('El titulo es requerido')
        .isLength({ max: 255 }).withMessage('El titulo es muy largo'),
    body('descripcion')
        .notEmpty().withMessage('La descripción es requerida'),
    body('precio')
        .notEmpty().withMessage('El precio es requerido')
        .isDecimal({ force_decimal: false })
        .toFloat().custom(value => {
            if (value < 1) {
              throw new Error('El precio no es valido');
            }
            return true;
          }),
    body('archivoid')
        .optional()
        .isInt().withMessage('El ID del archivo no es válido')
]

self.categoriaBodyValidator = [
    body('categoriaid')
        .notEmpty().withMessage('El ID de la categoria es requerido')
        .isInt().withMessage('El ID de la categoria no es valido')
]

self.categoriaParamValidator = [
    param('categoriaid').isInt().withMessage('El ID de la categoria no es valido')
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        })
    }

    let data = null
    try {
        data = await producto.findByPk(req.params.id, {
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
        return res.status(400).json({
            errors: errors.array()
        })
    }
    
    let data
    try {
        let archivoId = null
        if (req.body.archivoid) {
            const file = await archivo.findByPk(req.body.archivoid)
            if (file) {
                archivoId = file.id
            } else {
                return res.status(400).send()
            }
        }
        
        data = await producto.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            archivoid: archivoId
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
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let data
    try {
        let archivoId = null
        if (req.body.archivoid) {
            const file = await archivo.findByPk(req.body.archivoid)
            if (file) {
                archivoId = file.id
            } else {
                return res.status(400).send()
            }
        }

        data = await producto.update({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            archivoid: archivoId
        }, { where: {id: req.params.id} })
    } catch (error) {
        return next(error)
    }

    if(data[0] === 0) {
        return res.status(404).send()
    }

    req.bitacora('producto.editar', req.params.id)
    res.status(204).send()
}

//DELETE: api/productos/{id}
self.delete = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const id = req.params.id
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

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