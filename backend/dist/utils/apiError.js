export class ApiError extends Error {
    statusCode;
    isOperational;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
//# sourceMappingURL=apiError.js.map