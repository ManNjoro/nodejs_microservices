export class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = 'AppError';
    }
}