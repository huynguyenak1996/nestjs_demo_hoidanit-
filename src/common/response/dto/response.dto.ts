// # Chứa DTO (Data Transfer Object)
import { IResponse } from '../interfaces/response.interface';
import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T> implements IResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  message: string;
  data?: T;
  metadata?: { pagination?: import('../interfaces/pagination.interface').IPagination; [key: string]: any };
  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    data?: T,
    metadata?: {
      pagination?: import('../interfaces/pagination.interface').IPagination;
      [key: string]: any;
    },
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.message = message;
    if (data) {
      this.data = data;
    }
    if (metadata) {
      this.metadata = metadata;
    }
  }
}
