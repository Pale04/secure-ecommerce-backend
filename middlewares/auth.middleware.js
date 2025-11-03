const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const ClaimTypes = require('../config/claimtypes')
const { GeneraToken } = require('../services/jwttoken.service')

const Authorize = (rol) => {
    return async (req, res, next) => {
        const authHeader = req.header('Authorization')
        const error = new Error('Acceso denegado')
        error.statusCode = 401

        if(!authHeader || !authHeader.startsWith('Bearer')) {
            return next(error)
        }

        const token = authHeader.split(' ')[1]
        let decodedToken
        try {
            decodedToken = jwt.verify(token, jwtSecret)
        } catch(error) {
            return next(error)
        }

        if(rol.split(',').indexOf(decodedToken[ClaimTypes.Role]) == -1) {
            return next(error)
        }
        req.decodedToken = decodedToken
        
        const minutosRestantes = (decodedToken.exp - (new Date().getTime() / 1000)) / 60
        if (minutosRestantes < 5) {
            const nuevoToken = GeneraToken(decodedToken[ClaimTypes.Name], decodedToken[ClaimTypes.GivenName], decodedToken[ClaimTypes.Role])
            res.header('Set-Authorization', nuevoToken)
        }

        next()
    }
}

module.exports = Authorize