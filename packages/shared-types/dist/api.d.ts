export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    requestId?: string;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
    requestId?: string;
}
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
