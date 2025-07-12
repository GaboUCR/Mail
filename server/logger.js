// logger/index.js
const { createLogger, format, transports } = require('winston');

const levels = {
  crit: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

const logger = createLogger({
  levels,
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, ...meta }) =>
      `${timestamp} [${level.toUpperCase()}] ${message}` +
      (Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '')
    )
  ),
  transports: [
    new transports.Console()
  ]
});

module.exports = logger;
