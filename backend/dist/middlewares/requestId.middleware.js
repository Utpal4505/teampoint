import { v4 as uuid } from 'uuid';
export const requestIdMiddleware = (req, res, next) => {
    const requestId = uuid();
    req.id = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
};
//# sourceMappingURL=requestId.middleware.js.map