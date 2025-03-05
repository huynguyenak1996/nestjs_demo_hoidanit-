// src/common/interfaces/response.interface.ts
import { IPagination } from './pagination.interface';

export interface IResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  data: T | null; // Dữ liệu có thể là null (ví dụ: khi lỗi)
  message?: string; // Optional message
  metadata?: {
    pagination?: IPagination;
    links?: any;
  };
}
