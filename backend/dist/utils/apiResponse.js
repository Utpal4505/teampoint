import {} from "express";
export class ApiResponse {
    success;
    statusCode;
    message;
    data;
    constructor(statusCode, message, data) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
        });
    }
}
//# sourceMappingURL=apiResponse.js.map