const { error } = require('console')
const { usuario, rol, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { body, param, validationResult } = require('express-validator')
const { where } = require('sequelize')

let self = {}

self.paramValidator = [
    param('email').isEmail().withMessage('El correo no es valido'),
]

self.bodyValidator = [
    body('email')
        .notEmpty().withMessage('El correo es necesario')
        .isLength({ max: 255 }).withMessage('El correo es muy largo')
        .isEmail().withMessage('El correo no es valido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        //.isStrongPassword()
        .isLength({ max: 255 }).withMessage('La contraseña es muy larga'),
    body('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 255 }).withMessage('El nombre es muy largo'),
    body('rol')
        .notEmpty().withMessage('El rol es requerido')
]

//GET: api/usuarios
self.getAll = async function (req, res, next) {
    try {
        const data = await usuario.findAll({
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: []}
        })
        res.status(200).json(data)
    } catch(error) {
        next(error)
    }
}

//GET: api/usuarios/{email}
self.get = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errrors: errors.array()
        })
    }

    let data = null
    try {
        data = await usuario.findOne({
            where: { email: req.params.email },
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: []}
        })
    } catch (error) {
        return next(error)
    }

    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).send()
    }
}

//POST: api/usuarios
self.create = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let rolUsuario = null
    let data = null
    try {
        if (await usuario.findOne({ where: { email: req.body.email } })) {
            return res.status(409).json({
                msg: 'Correo en uso'
            })
        }
        rolUsuario = await rol.findOne({ where: { nombre: req.body.rol } })
        if (rolUsuario) {
            data = await usuario.create({
                id: crypto.randomUUID(),
                email: req.body.email,
                passwordhash: await bcrypt.hash(req.body.password, 10),
                nombre: req.body.nombre,
                rolid: rolUsuario.id
            })
        } else {
            return res.status(400).send()
        }
    } catch (error) {
        return next(error)
    }

    if(data) {
        req.bitacora('usuarios.crear', data.email)
        res.status(201).json({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            rol: rolUsuario.nombre
        })
    }
}

//PUT: api/usuarios/{email}
self.update = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let data = null
    try {
        const rolUsuario = await rol.findOne({ where: { nombre: req.body.rol } })
        if (!rolUsuario) {
            return res.status(400).send()
        }

        data = await usuario.update({
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolUsuario.id
        }, { where: { email: req.params.email} }) 
    } catch(error) {
        return next(error)
    }

    if (data[0] === 0) {
        return res.status(404).send()
    }

    req.bitacora('usuarios.editar', req.params.email)
    res.status(204).send()
}

//DELETE: api/usuarios/{email}
self.delete = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const email = req.params.email
    let data = null
    try {
        data = await usuario.findOne({ where: { email: email } })
        if(data && data.protegido) {
            return res.status(403).send()
        }
        data = await usuario.destroy({ where: { email: email } })
    } catch(error) {
        return next(error)
    }

    if (data === 1) {
        req.bitacora('usuarios.eliminar', email)
        res.status(204).send()
    } else {
        res.status(404).send()
    }
}

module.exports = self