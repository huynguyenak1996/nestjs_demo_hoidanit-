// src/common/dtos/base-response.dto.ts
import { HttpStatus } from '@nestjs/common';

export class BaseResponseDto<T> {
  success: boolean; // Trường boolean cho biết API call thành công hay không
  statusCode: HttpStatus; // Mã trạng thái HTTP, ví dụ 200, 400, 500
  timestamp: string; // Thời gian phản hồi, định dạng ISO string
  message: string; // Thông điệp trả về, có thể được i18n
  data: T | null; // Dữ liệu trả về, có thể là một object hoặc array, hoặc null nếu không có dữ liệu
  metadata?: any; // Metadata bổ sung, ví dụ pagination
  constructor(success: boolean, statusCode: HttpStatus, message: string, data?: T, metadata?: any) {
    this.success = success;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString(); // Lấy thời gian hiện tại và định dạng ISO string
    this.message = message;
    this.data = data || null; // Gán data nếu có, nếu không thì null
    this.metadata = metadata; // Gán metadata nếu có
  }
}
