// # Chứa các interface định nghĩa kiểu dữ liệu
// # Interface cho thông tin phân trang
// src/common/response/interfaces/pagination.interface.ts
export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
