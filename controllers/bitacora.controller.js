const { bitacora } = require('../models')

let self = {}

//GET api/bitacore
self.getAll = async function (req, res, next) {
    const data = await bitacora.findAll({
        attributes: [['id', 'bitacoraId'], 'accion', 'elementoid', 'ip', 'usuario','fecha'],
        oder: [['id', 'DESC']]
    })
    res.status(200).json(data)
}

module.exports = self