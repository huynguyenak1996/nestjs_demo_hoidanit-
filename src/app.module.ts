import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Đặt isGlobal để có thể sử dụng ConfigService ở mọi nơi
      envFilePath: ['.env'], // Đường dẫn đến file .env (mặc định là .env)
      //envFilePath: ['.development.env'], // Đường dẫn đến file .env (mặc định là .env)
      // load: [appConfig], // Đường dẫn đến file .env (mặc định là .env)
      // Bạn có thể thêm validationSchema ở đây (sử dụng Joi) để kiểm tra các biến môi trường
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule để có thể inject ConfigService (Module ConfigModule để inject ConfigService)
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('MONGO_USER'); // Lấy username từ biến môi trường MONGO_USER
        const password = configService.get<string>('MONGO_PASSWORD'); // Lấy password từ biến môi trường MONGO_PASSWORD
        const host = configService.get<string>('MONGO_HOST') || 'localhost'; // Lấy hostname từ biến môi trường MONGO_HOST
        const port = configService.get<string>('MONGO_PORT') || '27017'; // Lấy port từ biến môi trường MONGO_PORT
        const dbname = configService.get<string>('MONGO_DBNAME') || 'admin'; // Lấy tên database từ biến môi trường MONGO_DBNAME
        const fullUri = `mongodb://${user}:${password}@${host}:${port}/${dbname}`; // Thêm authSource vào URI (ĐÃ SỬA LỖI VÀ TỐI ƯU)
        console.log(fullUri);
        return {
          uri: fullUri,
          // Các options khác của Mongoose (nếu cần) có thể thêm ở đây
        };
      },
      inject: [ConfigService], // Inject ConfigService vào factory function (Inject ConfigService để sử dụng trong useFactory)
    }),
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
