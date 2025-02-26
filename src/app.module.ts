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
      envFilePath: ['.env', '.env.local'], // Các file .env, ưu tiên .env.local (nếu có)
      //envFilePath: ['.development.env'], // Đường dẫn đến file .env (mặc định là .env)
      // load: [appConfig], // Đường dẫn đến file .env (mặc định là .env)
      // Bạn có thể thêm validationSchema ở đây (sử dụng Joi) để kiểm tra các biến môi trường
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule để có thể inject ConfigService (Module ConfigModule để inject ConfigService)
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('MONGO_USER');
        const password = configService.get<string>('MONGO_PASSWORD');
        const host = configService.get<string>('MONGO_HOST', 'localhost'); // Giá trị mặc định 'localhost'
        const port = configService.get<string>('MONGO_PORT', '27017'); // Giá trị mặc định '27017'
        const dbName = configService.get<string>('MONGO_DBNAME', '');
        if (!dbName) {
          throw new Error('MONGO_DBNAME environment variable is required.');
        }
        // Xây dựng URI cơ sở
        const baseUri = `mongodb://${host}:${port}/${dbName}`;
        let fullUri = baseUri;
        // Thêm user/password vào URI (nếu có)
        if (user && password) {
          // Mã hóa (encode) username và password
          const encodedUser = encodeURIComponent(user);
          const encodedPassword = encodeURIComponent(password);
          fullUri = `mongodb://${encodedUser}:${encodedPassword}@${baseUri.replace('mongodb://', '')}`;
        }
        console.log(fullUri);
        return {
          uri: fullUri,
          // Các options khác của Mongoose có thể được thêm ở đây
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
