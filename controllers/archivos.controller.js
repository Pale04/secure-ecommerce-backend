const {archivo} = require('../models')
const fs = require('fs')

let self = {}

//GET api/archivos
self.getAll = async function (req, res, next) {
    try {
        let data = await archivo.findAll({attributes: [['id', 'archivoId'], 'mime', 'indb', 'nombre', 'size'] })
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

//GET: api/archivos/{id}/detalle
self.getDetalle = async function (req, res, next) {
    let id = req.params.id
    let data = null

    try {
        data = await archivo.findByPk(id, { attributes: [['id', 'archivoId'], 'mime', 'indb', 'nombre', 'size'] })
    } catch (error) {
        return next(error)
    }

    if (data) {
        res.status(200).json(data)
    } else {
        res.status(404).send()
    }
}

//GET api/archivos/{id}
self.get = async function (req, res, next) {
    let id = req.params.id
    let data = null

    try {
        data = await archivo.findByPk(id)
    } catch (error) {
        return next(error)
    }

    if(!data) {
        return res.status(404).send()
    }

    let imagen
    if(!data.indb) {
        try {
            imagen = fs.readFileSync('uploads/' + data.nombre)
        } catch (error) {
            return next(error)
        }
    } else {
        imagen = data.datos
    }

    res.status(200).contentType(data.mime).send(imagen)
}

//POST api/archivos
self.create = async function (req, res, next) {
    if(!req.file) {
        return res.status(400).json('El archivo es obligatorio')
    }

    let binario = null
    let indb = false
    if (process.env.FILES_IN_BD == "true") {
        try {
            binario = fs.readFileSync('uploads/' + req.file.filename)
            fs.existsSync('uploads/' + req.file.filename) && fs.unlinkSync('uploads/' + req.file.filename)
        } catch(error) {
            return next(error, req, res)
        }
        indb = true
    }

    let data = null
    try {
        data = await archivo.create({
            mime: req.file.mimetype,
            indb: indb,
            nombre: req.file.filename,
            size: req.file.size,
            datos: binario
        })
    } catch (error) {
        return next(error, req, res)
    }

    if(data) {
        req.bitacora('archivos.crear', data.id)
        res.status(201).json({
            id: data.id,
            mime: req.file.mimetype,
            indb: indb,
            nombre: req.file.filename
        })
    }
}

//PUT: api/archivos/{id}
self.update = async function (req, res, next) {
    if(!req.file) {
        return res.status(400).json('El archivo es obligatorio')
    }

    let id = req.params.id
    let imagen = null
    try {
        imagen = await archivo.findByPk(id)
        if (!imagen) {
            fs.existsSync('uploads/' + req.file.filename) && fs.unlinkSync('uploads/' + req.file.filename)
            return res.status(404).send()
        }
    } catch(error) {
        return next(error)
    }

    let binario = false
    let indb = false
    if (process.env.FILES_IN_BD == 'true') {
        try {
            binario = fs.readFileSync('uploads/' + req.file.filename)
            fs.existsSync('uploads/' + req.file.filename) && fs.unlinkSync('uploads/' + req.file.filename)
        } catch (error) {
            return next(error)
        }
        indb = true
    }

    let data = null
    try {
        data = await archivo.update({
            mime: req.file.mimetype,
            indb: indb,
            nombre: req.file.filename,
            size: req.file.size,
            datos: binario
        }, { where: {id: id} })
    } catch(error) {
        return next(error)
    }

    if(data) {
        req.bitacora('archivos.editar', data.id)
        if (data[0] === 0) {
            return res.status(404).send()
        }
    }

    if(!imagen.indb) {
        try {
            fs.existsSync('uploads/' + imagen.nombre) && fs.unlinkSync('uploads/' + imagen.nombre)
        } catch(error) {
            return next(error)
        }
    }

    res.status(204).send()
}

//DELETE: api/archivos/{id}
self.delete = async function (req, res, next) {
    const id = req.params.id
    let imagen = null

    try {
        imagen = await archivo.findByPk(id)
    } catch (error) {
        return next(error)
    }

    if(!imagen) {
        return res.status(404).send()
    }
    
    let data = null
    try {
        data = await archivo.destroy({ where: {id: id} })
    } catch (error) {
        return next(error)
    }

    if (data === 1) {
        req.bitacora('archivos.eliminar', id)
        if (!imagen.indb) {
            try {
                fs.existsSync('uploads/' + imagen.nombre) && fs.unlinkSync('uploads/' + imagen.nombre)
            } catch(error) {
                return next(error)
            }
        }
        return res.status(204).send()
    }
    res.status(404).send()
}

module.exports = self