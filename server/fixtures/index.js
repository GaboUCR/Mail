// fixtures/index.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs       = require('fs').promises;
const path     = require('path');

const logger   = require('../logger');
const User     = require('../models/User');
const Message  = require('../models/Message');

async function loadFixtures() {
  try {
    // 1) Connect to the database
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/Mail';
    await mongoose.connect(mongoUrl, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB to load fixtures');

    // 2) Read and parse the JSON
    const filePath = path.resolve(__dirname, 'mock.json');
    const raw      = await fs.readFile(filePath, 'utf-8');
    const { users = [], messages = [] } = JSON.parse(raw);

    // 3) (Optional) Clear collections before inserting
    // await Promise.all([ User.deleteMany({}), Message.deleteMany({}) ]);

    // 4) Bulk insert
    if (users.length) {
      await User.insertMany(users);
      logger.info(`✅ Inserted ${users.length} fixture users`);
    }
    if (messages.length) {
      await Message.insertMany(messages);
      logger.info(`✅ Inserted ${messages.length} fixture messages`);
    }

    // 5) Close connection
    await mongoose.disconnect();
    logger.info('🔌 Disconnected from MongoDB after loading fixtures');
    process.exit(0);
  } catch (err) {
    logger.crit('💥 Error loading fixtures', { stack: err.stack });
    process.exit(1);
  }
}

// Run the script
loadFixtures();
