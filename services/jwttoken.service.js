const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const ClaimTypes = require('../config/claimtypes')

const GeneraToken = (email, nombre, rol) => {
    const token = jwt.sign({
        [ClaimTypes.Name]: email,
        [ClaimTypes.GivenName]: nombre,
        [ClaimTypes.Role]: rol,
        'iis': 'ServidorFeiJWT',
        'aud': 'ClientesFeiJWT'
    },
    jwtSecret, 
    { expiresIn: '20m' })

    return token
}

const TiempoRestanteToken = (req) => {
    const authHeader = req.header('Authorization')
    if (!authHeader) {
        return null
    }

    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, jwtSecret)
    } catch (error) {
        return null
    }

    const time = (decodedToken.exp - (new Date().getTime() / 1000))
    const minutos = Math.floor(time / 60)
    const segundos = Math.floor(time - minutos * 60)
    return `00:${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`
}

module.exports = { GeneraToken, TiempoRestanteToken }