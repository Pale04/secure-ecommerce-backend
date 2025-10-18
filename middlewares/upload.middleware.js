const multer = require('multer')

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/jpeg') && file.originalname.endsWith('.jpg')) {
        cb(null, true)
    } else {
        cb('Solo se permiten imágenes con extensión JPG', false)
    }
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

var uploadFile = multer({
    storage: storage, 
    fileFilter: imageFilter 
})

module.exports = uploadFile