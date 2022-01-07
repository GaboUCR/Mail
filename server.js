const express = require('express')
const app = express()
const port = 5000
const path = require('path')

const cookieParser = require('cookie-parser')
app.use(cookieParser())

//Users array will hold objects with the user id and the encrypted cookie for that user
app.locals.users = []

const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost:27017/Mail'
const db = mongoose.connect(dbUrl)
mongoose.Promise = global.Promise

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const routes = require('./routes')
app.use('/api', routes)

app.use(express.static(path.join(__dirname, 'client/build/')))
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
