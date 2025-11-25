const bcrypt = require('bcrypt')
const { usuario, rol, Sequelize } = require('../models')
const { GeneraToken, TiempoRestanteToken } = require('../services/jwttoken.service')
const { body, validationResult } = require('express-validator')

let self = {}
self.validator = [
    body('email')
        .notEmpty().withMessage('El correo es necesario')
        .isLength({ max: 255 }).withMessage('El correo excede los 255 caracteres')
        .isEmail().withMessage('El correo no tiene el formato correcto'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ max: 255 }).withMessage('La contraseña excede los 255 caracteres')
    //    .isStrongPassword().withMessage('La contrasña no es suficientemente segura')
]

//POST: api/auth
self.login = async function (req, res, next) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).send()
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