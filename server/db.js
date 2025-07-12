// db/index.js
const mongoose = require('mongoose');
const logger = require('./logger.js');

const DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/Mail';
const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000; // in milliseconds

async function connectWithRetry() {
  let attempt = 1;

  while (true) {
    try {
      // await actually waits for the connection
      await mongoose.connect(DB_URL, {
        useNewUrlParser:    true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      logger.info('✅ Successfully connected to MongoDB');
      return;  // success: exit the function
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        logger.warn(
          `⚠️ Failed to connect to MongoDB (attempt ${attempt}/${MAX_RETRIES}). ` +
          `Retrying in ${RETRY_INTERVAL_MS / 1000}s…`,
          { error: err.message }
        );
        // wait asynchronously
        await new Promise(res => setTimeout(res, RETRY_INTERVAL_MS));
        attempt++;
      } else {
        logger.crit(
          `💥 Could not connect to MongoDB after ${attempt} attempts.`,
          { error: err.message }
        );
        // throw so the caller can catch it
        throw err;
      }
    }
  }
}

module.exports = { connectWithRetry };
