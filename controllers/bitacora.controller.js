const { bitacora } = require('../models')

let self = {}

//GET api/bitacore
self.getAll = async function (req, res, next) {
    let data
    try {
        data = await bitacora.findAll({
            attributes: [['id', 'bitacoraId'], 'accion', 'elementoid', 'ip', 'usuario','fecha'],
            oder: [['id', 'DESC']]
        })
    } catch (error) {
        return next(error)
    }
    
    res.status(200).json(data)
}

module.exports = self