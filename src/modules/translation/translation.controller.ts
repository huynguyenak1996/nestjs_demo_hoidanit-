// translation.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslateFilesDto, TranslateTextDto, TranslationResult } from '@/modules/translation/translation.interface';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}
  @Post('text')
  async translateText(@Body() dto: TranslateTextDto): Promise<TranslationResult> {
    return this.translationService.translateText(dto);
  }
  @Post('files')
  async translateFiles(@Body() dto: TranslateFilesDto): Promise<TranslationResult> {
    return this.translationService.translateFiles(dto);
  }
  // Thêm endpoint GET để dễ dàng test dịch một chuỗi đơn giản
  @Get('text')
  async translateTextGet(
    @Query('text') text: string,
    @Query('source') sourceLanguage: string = 'en',
    @Query('target') targetLanguage: string = 'vi',
  ): Promise<TranslationResult> {
    return this.translationService.translateText({
      text,
      sourceLanguage,
      targetLanguage,
    });
  }
}
