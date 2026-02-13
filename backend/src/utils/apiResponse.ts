import { type Response } from "express";

export class ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | undefined;

  constructor(
    statusCode: number,
    message: string,
    data?: T
  ) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  send(res: Response) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}
