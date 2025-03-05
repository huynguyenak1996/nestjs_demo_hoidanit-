// common/i18n/i18n.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nModule, QueryResolver, AcceptLanguageResolver, HeaderResolver, CookieResolver } from 'nestjs-i18n';
import * as path from 'path';
import { I18nCustomService } from '@/common/i18n/i18n.service';
import i18nConfig from '@/common/i18n/i18n.config';

@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: i18nConfig.fallbackLanguage, // Ngôn ngữ mặc định nếu không tìm thấy ngôn ngữ phù hợp
        loaderOptions: {
          path: path.join(__dirname, i18nConfig.langDir), // Đường dẫn tới thư mục chứa file ngôn ngữ
          watch: true, // Tự động reload khi file ngôn ngữ thay đổi (chỉ nên dùng trong môi trường dev)
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['x-custom-lang']), // Xác định ngôn ngữ dựa trên header 'x-custom-lang'
        AcceptLanguageResolver, // Hoặc dựa trên header 'Accept-Language' mặc định của trình duyệt
        new CookieResolver(['lang', 'locale', 'language']), // Các key có thể dùng để set ngôn ngữ
      ],
      inject: [ConfigService],
    }),
  ],
  providers: [I18nCustomService],
  exports: [I18nCustomService],
})
export class CommonI18nModule {}
