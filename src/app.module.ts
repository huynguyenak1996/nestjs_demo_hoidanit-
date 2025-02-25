import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Đặt isGlobal để có thể sử dụng ConfigService ở mọi nơi
      envFilePath: ['.env'], // Đường dẫn đến file .env (mặc định là .env)
      // load: [appConfig], // Đường dẫn đến file .env (mặc định là .env)
      // Bạn có thể thêm validationSchema ở đây (sử dụng Joi) để kiểm tra các biến môi trường
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
