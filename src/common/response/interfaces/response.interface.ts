// # Chứa các interface định nghĩa kiểu dữ liệu
// # Interface cho response tổng quát
// src/common/response/interfaces/response.interface.ts
import { IPagination } from './pagination.interface';

export interface IResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  message: string;
  data?: T; // Dữ liệu trả về, có thể là bất kỳ kiểu gì (generic type)
  metadata?: {
    pagination?: IPagination;
    [key: string]: any; // Cho phép thêm các metadata khác nếu cần
  };
}
