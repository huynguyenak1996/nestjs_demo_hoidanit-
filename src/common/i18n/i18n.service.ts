// common/i18n/i18n.service.ts
import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class I18nCustomService {
  constructor(private readonly i18n: I18nService) {}
  translate(key: string, options?: any): string {
    const context = I18nContext.current(); // Lấy context hiện tại
    if (!context) {
      // Xử lý trường hợp không có context (ví dụ: gọi ngoài request)
      // Có thể return key, throw error, hoặc log cảnh báo.
      console.warn('I18nContext.current() is null.  Are you calling this outside of a request?');
      return key; // Hoặc throw new Error("...");
    }
    return this.i18n.translate(key, {
      lang: context.lang, // Không cần truyền thủ công nữa
      ...options, // Các options khác (ví dụ: args)
    });
  }
}
