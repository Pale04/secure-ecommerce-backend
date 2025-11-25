const { categoria } = require('../models')
const { param, body, validationResult } = require('express-validator')

let self = {}
    
self.bodyValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es necesario')
        .isLength({ max: 255}).withMessage('El nombre es muy largo')
]

self.paramValidator = [
    param('id').isInt().withMessage('El ID no es válido')
]

//GET api/categorias
self.getAll = async (req, res, next) => {
    let data
    try {
        data = await categoria.findAll({ attributes: [['id', 'categoriaId'], 'nombre', 'protegida'] })
    } catch (error) {
        return next(error)
    }
    res.status(200).json(data)
}

//GET api/categorias/{id}
self.get = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let id = req.params.id
    let data = null
    try {
        data = await categoria.findByPk(id, { attributes: [['id', 'categoriaId'], 'nombre', 'protegida'] })
    } catch (error) {
        return next(error)
    }

    if (data)
        res.status(200).json(data)
    else
        res.status(404).send()
}

//POST api/categorias
self.create = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let data 
    try {
        data = await categoria.create({ nombre: req.body.nombre })
    } catch (error) {
        return next(error)
    }

    req.bitacora('categoria.crear', data.id)
    res.status(201).json(data)
}

//PUT: api/categorias/{id}
self.update = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const id = req.params.id
    let data 
    try {
        data = await categoria.update({
            nombre: req.body.nombre
        }, { where: { id: id } })
    } catch (error) {
        return next(error)
    }

    if(data[0] === 0)
        return res.status(404).send()

    req.bitacora('categoria.editar', id)
    res.status(204).send()
}

//DELETE api/categorias/{id}
self.delete = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const id = req.params.id
    let data = null
    try {
        data = await categoria.findByPk(id)
    } catch (error) {
        return next(error)
    }

    if (!data)
        return res.status(404).send()
    else if(data.protegida)
        return res.status(400).send()

    try {
        data = await categoria.destroy({ where: {id: id} })
    } catch (error) {
        return next(error)
    }

    if(data === 1) {
        req.bitacora('categoria.eliminar', id)
        return res.status(204).send()
    }
    return res.status(404).send()
}

module.exports = self