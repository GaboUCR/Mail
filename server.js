const express = require('express')
const app = express()
const port = 6000
const path = require('path')
// const routes = require('./routes')

app.use(express.static(path.join(__dirname, 'client/build/')))

// app.use('/api', routes)

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
