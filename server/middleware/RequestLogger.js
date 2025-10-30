// middleware/requestLogger.js
import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const { method, originalUrl } = req;
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    logger.info(`${method} ${originalUrl} ${status} - ${duration}ms`);
  });

  next();
};
