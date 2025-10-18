const express = require('express')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

app.get('/', (req, res) => {
    res.send('Hola mundo desde la India xd!')
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}`)
})