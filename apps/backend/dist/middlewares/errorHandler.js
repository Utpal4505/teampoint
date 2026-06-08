import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';
export const errorHandler = (err, req, res, _next) => {
    if (err instanceof ApiError && err.isOperational) {
        logger.warn('Handled API error', {
            requestId: req.id,
            statusCode: err.statusCode,
            message: err.message,
            path: req.originalUrl,
        });
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            requestId: req.id,
        });
    }
    const error = err instanceof Error ? err : new Error(`Non-error thrown: ${String(err)}`);
    logger.error('Unhandled application error', {
        requestId: req.id,
        method: req.method,
        path: req.originalUrl,
        message: error.message,
        stack: error.stack,
    });
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        requestId: req.id,
    });
};
//# sourceMappingURL=errorHandler.js.map