const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

var corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:8081'],
    methods: 'GET,PUT,DELETE,POST'
}
app.use(cors(corsOptions))

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(require('./middlewares/bitacora.middleware'))

app.use('/api/categorias', require('./routes/categorias.routes'))
app.use('/api/productos',require('./routes/productos.routes'))
app.use('/api/usuarios',require('./routes/usuarios.routes'))
app.use('/api/roles',require('./routes/roles.routes'))
app.use('/api/auth',require('./routes/auth.routes'))
app.use('/api/archivos',require('./routes/archivos.routes'))
app.use('/api/bitacora',require('./routes/bitacora.routes.js'))
app.get('/*splat', (req, res) => {res.status(404).send('Recurso no encontrado')})

const errorHandler = require('./middlewares/errorhandler.middleware.js')
app.use(errorHandler)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Aplicacion de ejemplo escuchando en el puerto ${process.env.SERVER_PORT}`)
})