const fs = require('fs')
const requestIp = require('request-ip')
const ClaimTypes = require('../config/claimtypes')

const errorHandler = (err, req, res, next) => {
    let defaultMessage = 'No se ha podido procesar la petición. Inténtelo de nuevo más tarde'
    const statusCode = err.statusCode || 500

    const ip = requestIp.getClientIp(req)

    let email = 'Anónimo'
    if (req.decodedToken) {
        email.req.decodedToken[ClaimTypes.Name];
    }

    fs.appendFile('log/log.txt', new Date() + ` - ${statusCode} - ${ip} - ${email} - ${(err.message || defaultMessage)}\n`, err => {
        if (err) {
            console.error(err)
        }
    })

    if(process.env.NODE_ENV === 'development') {
        res.status(statusCode).json({
            status: statusCode,
            mensaje: err.message || defaultMessage,
            stack: err.stack
        })
    } else {
        res.status(statusCode).send({ mensaje: defaultMessage })
    }

    module.exports = errorHandler
}