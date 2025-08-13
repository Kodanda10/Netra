const winston = require('winston');

const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'audit.log' }),
  ],
});

const logAuditEvent = (eventType, userId, details) => {
  auditLogger.info({ eventType, userId, details });
};

module.exports = {
  logAuditEvent,
};