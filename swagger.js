const swaggerAutogen = require('swagger-autogen')

const doc = {
    info: {
        title: 'Secure E-Commerce API',
        description: 'Secure API to use in Secure Programming Project'
    },
    host: 'localhost:3000'
}

const outputFile = './swagger-output.json'
const routes = ['./index.js']

swaggerAutogen(outputFile, routes, doc)