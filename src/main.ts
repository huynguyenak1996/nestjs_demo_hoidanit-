import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as moment from 'moment-timezone';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';

async function bootstrap() {
  moment.tz.setDefault('Asia/Ho_Chi_Minh'); // Đặt múi giờ mặc định
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);
  // const i18nService = app.get(I18nCustomService);
  // app.useGlobalFilters(new HttpExceptionFilter(i18nService)); // Đăng ký global filter
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Tự động transform data theo DTO
      whitelist: true, // Chỉ nhận các thuộc tính đã định nghĩa trong DTO,
      forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính không được định nghĩa,
      /**  SỬ DỤNG I18nValidationErrorFactory ĐỂ DỊCH MESSAGE LỖI VALIDATION **/
    }),
  );
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  const port = configService.get('PORT');
  if (!port) {
    throw new Error('Không tìm thấy port');
  }
  await app.listen(port);
}
bootstrap();
