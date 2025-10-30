import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs folder exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Info logs
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
    // Error logs
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
  ],
});

// Also log to console in dev
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

export default logger;
