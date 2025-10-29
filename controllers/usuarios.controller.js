const { usuario, rol, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

let self = {}

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
    const email = req.params.email
    let data = null

    try {
        data = await usuario.findOne({
            where: { email: email },
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
    let rolUsuario = null
    let data = null
    //TODO: valida rol que viene en el body

    try {
        rolUsuario = await rol.findOne({ where: { nombre: req.body.rol } })
        data = await usuario.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolUsuario.id
        })
    } catch (error) {
        return next(error)
    }

    if(data) {
        req.bitacora('usuarios.crear', data.email)
        res.status(201).json({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            rolid: rolUsuario.nombre
        })
    }
}

//PUT: api/usuarios/{email}
self.update = async function (req, res, next) {
    const email = req.params.email
    let data = null
    //TODO: validar rol del body
    
    try {
        const rolUsuario = await rol.findOne({ where: { nombre: req.body.rol } })
        req.body.rolid = rolUsuario.id
        data = await usuario.update(
            req.body, 
            { where: { email: email} }
        ) 
    } catch(error) {
        return next(error)
    }

    if (data[0] === 0) {
        return res.status(404).send()
    }

    req.bitacora('usuarios.editar', email)
    res.status(204).send()
}

//DELETE: api/usuarios/{email}
self.getAll = async function (req, res, next) {
    const email = req.params.email
    let data = null

    try {
        data = await usuario.findOne({ where: { email: email } })
        if(data.protegido) {
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
        res.status(403).send()
    }
}

module.export = self