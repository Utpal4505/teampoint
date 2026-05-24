import { logger } from '../utils/logger.js';
export const requestLoggerMiddleware = (req, _res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        logger.info('Incoming request', {
            requestId: req.id,
            method: req.method,
            path: req.originalUrl,
            query: req.query,
            body: req.body,
        });
        next();
    }
};
//# sourceMappingURL=requestLoggerMiddleware.js.map