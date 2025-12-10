const swaggerAutogen = require('swagger-autogen')

const doc = {
    info: {
        title: 'Secure E-Commerce API',
        description: 'Secure API to use in Secure Programming Project'
    },
    host: 'localhost:3000'
}

const outputFile = './swagger-output.json'
// include route files directly so swagger-autogen picks up all route definitions
const routes = ['./index.js', './routes/*.js']

swaggerAutogen(outputFile, routes, doc)