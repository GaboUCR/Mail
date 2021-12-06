const express = require('express')
const app = express()
const port = 5000
const path = require('path')

var cors = require('cors')
app.use(cors())

const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost:27017/Mail'
const db = mongoose.connect(dbUrl)
mongoose.Promise = global.Promise

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.use(express.static(path.join(__dirname, 'client/build/')))

const routes = require('./routes')
app.use('/api', routes)
// app.get('*', (request, response) => {
//   response.sendFile(path.join(__dirname, 'client/build/index.html'))
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
