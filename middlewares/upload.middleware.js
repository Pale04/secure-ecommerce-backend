const multer = require('multer')
const MAX_FILE_SIZE = 100 * 1024

const imageFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/jpg') || !file.originalname.endsWith('.jpg')) {
        cb('Solamente se permiten imágenes con extensión JPG', false)
    } else {
        console.log(file)
        cb(null,true)
    }
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.jpg`)
    }
})

var uploadFile = multer({
    storage: storage, 
    fileFilter: imageFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
})

module.exports = uploadFile