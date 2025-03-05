// common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  message: string;
  errors?: any; // Hoặc định nghĩa kiểu cụ thể cho errors, ví dụ: string[]
}
@Catch(HttpException) // Bắt HttpException (và các class con)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any; // Lấy response từ exception
    // Tùy chỉnh format response
    let message: string;
    let errors: any = null; // Khai báo biến errors
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      // Kiểm tra xem exceptionResponse có phải là object và không null
      const resp = exceptionResponse as { message?: string | string[]; errors?: any }; // Ép kiểu an toàn hơn
      if (Array.isArray(resp.message)) {
        message = resp.message.join(', '); // Nếu message là mảng (ví dụ validation errors)
      } else {
        message = resp.message || 'Unknown error'; // Lấy message
      }
      errors = resp.errors; // Lấy errors
    } else {
      message = 'Unknown error';
    }
    const errorResponse: ErrorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      message, // Sử dụng biến message
      errors, // Sử dụng biến errors
    };
    response.status(status).json(errorResponse);
  }
}
