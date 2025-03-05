// src/common/response/response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  constructor(private readonly i18n: I18nService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = I18nContext.current();
        const lang = ctx ? ctx.lang : 'en';
        const httpStatus = data?.statusCode ?? context.switchToHttp().getResponse().statusCode ?? HttpStatus.OK;
        const messageKey = data?.message ?? 'success'; // Lấy key, mặc định là 'success'
        return new ResponseDto(
          true, // Mặc định là true cho các response không phải exception
          httpStatus,
          this.i18n.translate(`messages.${messageKey}.translation`, {
            lang,
            args: data?.args || {},
          }),
          data?.data ?? data, // Nếu có data trong data thì lấy, không thì lấy data
          data?.metadata,
        );
      }),
    );
  }
}
