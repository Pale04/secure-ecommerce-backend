const bcrypt = require('bcrypt')
const { usuario, rol, Sequelize } = require('../models')
const { GeneraToken, TiempoRestanteToken } = require('../services/jwttoken.service')
const { body, validationResult } = require('express-validator')

let self = {}
self.validator = [
    body('email')
        .notEmpty().withMessage('El correo es necesario')
        .isLength({ max: 255 }).withMessage('El correo es muy largo')
        .isEmail().withMessage('El correo no es valido'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ max: 255 }).withMessage('La contraseña es muy larga')
]

//POST: api/auth
self.login = async function (req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { email, password } = req.body
    let data
    try {
        data = await usuario.findOne({
            where: { email: email },
            raw: true,
            attributes: ['id', 'email', 'nombre', 'passwordhash', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: []}
        })
    } catch (error) {
        return next(error)
    }

    if (!data) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos'})
    }

    const passwordMatch = await bcrypt.compare(password, data.passwordhash)
    if (!passwordMatch) {
        return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos'})
    }

    token = GeneraToken(data.email, data.nombre, data.rol)

    req.bitacora('usuario.login', data.email)
    res.status(200).json({
        email: data.email,
        nombre: data.nombre,
        rol: data.rol,
        jwt: token
    })
}

//GET: api/auth/tiempo
self.tiempo = async function(req, res) {
    const tiempo = TiempoRestanteToken(req)
    if (!tiempo) {
        res.status(404).send()
    } else {
        res.status(200).send(tiempo)
    }
}

module.exports = self