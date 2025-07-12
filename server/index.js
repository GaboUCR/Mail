const express = require('express')
const app = express()
const PORT = 5000
const path = require('path')
var fs = require("fs")

const logger = require('./logger.js');
const { connectWithRetry } = require('./db.js');

const cookieParser = require('cookie-parser')
app.use(cookieParser())

// Users array will hold objects with the user id and the encrypted cookie for that user
app.locals.users = []

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const routes = require('./routes')
app.use('/mail/api', routes)

app.use(express.static(path.join(__dirname, 'client/build/')))

app.get('/mail', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.get('/mail*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/build/index.html'))
})

app.use((err, req, res, next) => {
  logger.crit('💥 Error no manejado en el servidor', { stack: err.stack });
  res.status(500).end();
});

async function startServer() {
  try {
    // Here you can use await because we're inside an async function
    await connectWithRetry();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.crit('Could not start server due to missing database connection', { error: err.message });
    process.exit(1);
  }
}

// We call the function without top-level await
startServer();
