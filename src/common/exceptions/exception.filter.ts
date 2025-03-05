// src/common/exception/exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { ResponseDto } from '../response/dto/response.dto'; // Import ResponseDto
@Catch() // Bắt tất cả exception
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nService,
  ) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const i18nCtx = I18nContext.current();
    const lang = i18nCtx ? i18nCtx.lang : 'en';
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let messageKey = 'InternalServerError'; // Key mặc định
    let args: Record<string, any> = {};
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      // Nếu exception response là một object tự định nghĩa
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
        messageKey = (exceptionResponse as any).message;
        args = (exceptionResponse as any).args || {};
      } else {
        // HttpException bình thường chỉ có string message
        messageKey = typeof exceptionResponse === 'string' ? exceptionResponse : 'InternalServerError';
      }
    }
    const responseBody = new ResponseDto(
      false, // Luôn là false cho exception
      httpStatus,
      this.i18n.translate(`messages.${messageKey}.translation`, {
        lang,
        args,
      }),
      null, // Thường không có data khi lỗi
      // Có thể thêm metadata nếu cần
    );
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
