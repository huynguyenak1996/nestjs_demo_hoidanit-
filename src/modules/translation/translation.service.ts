// translation.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import * as fs from 'fs-extra'; // Dùng fs-extra
import * as path from 'path';
import axios from 'axios';
import { TranslateTextDto, TranslateFilesDto, TranslationResult } from './translation.interface';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}
  async translateText(dto: TranslateTextDto): Promise<TranslationResult> {
    try {
      // Đây là ví dụ đơn giản, bạn có thể tích hợp với dịch vụ dịch thực tế như Google Translate
      // Trong trường hợp này, chúng ta giả sử text đã có trong file i18n
      const translatedText = await this.googleTranslate(dto.text, dto.sourceLanguage, dto.targetLanguage);
      return {
        success: true,
        translatedText,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown translation error';
      return {
        success: false,
        message: `Translation failed: ${errorMessage}`,
      };
    }
  }
  async translateFiles(dto: TranslateFilesDto): Promise<TranslationResult> {
    try {
      const i18nPath = path.join(process.cwd(), 'src/common/i18n');
      const sourcePath = path.join(i18nPath, dto.sourceLanguage);
      const targetPath = path.join(i18nPath, dto.targetLanguage);
      // Đảm bảo thư mục đích tồn tại
      await fs.ensureDir(targetPath);
      // Đọc tất cả các file từ thư mục nguồn
      const files = await fs.readdir(sourcePath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const sourceFilePath = path.join(sourcePath, file);
          const targetFilePath = path.join(targetPath, file);
          // Đọc nội dung file nguồn
          const sourceContent = await fs.readJson(sourceFilePath);
          // Dịch từng key trong file
          const translatedContent = await this.translateNestedObject(
            sourceContent,
            dto.sourceLanguage,
            dto.targetLanguage,
          );
          // Ghi file đã dịch
          await fs.writeJson(targetFilePath, translatedContent, { spaces: 2 });
        }
      }
      return {
        success: true,
        message: `Successfully translated files from ${dto.sourceLanguage} to ${dto.targetLanguage}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Files translation failed: ${error.message}`,
      };
    }
  }
  private async translateNestedObject(obj: any, sourceLanguage: string, targetLanguage: string): Promise<any> {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        if ('translation' in value && typeof value.translation === 'string') {
          // Đây là một đối tượng có trường translation cần dịch
          const translatedText = await this.googleTranslate(value.translation, sourceLanguage, targetLanguage);
          result[key] = {
            ...value,
            translation: translatedText,
            reviewed: false, // Đặt lại trạng thái reviewed
          };
        } else {
          // Đây là một đối tượng lồng nhau, tiếp tục đệ quy
          result[key] = await this.translateNestedObject(value, sourceLanguage, targetLanguage);
        }
      } else {
        // Giữ nguyên các giá trị không phải đối tượng
        result[key] = value;
      }
    }
    return result;
  }
  private async googleTranslate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    try {
      // Mã hóa text để sử dụng trong URL
      const encodedText = encodeURIComponent(text);
      const url = `http://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sourceLanguage}&tl=${targetLanguage}&q=${encodedText}`;
      const response = await axios.get(url);
      // API này thường trả về một mảng, với phần tử đầu tiên là bản dịch
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      // Nếu không phải mảng, trả về dữ liệu nguyên bản
      return response.data.toString();
    } catch (error) {
      console.error('Google Translate API error:', error);
      throw new HttpException('Translation service error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
