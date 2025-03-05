// translation.interface.ts
export interface TranslateTextDto {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}
export interface TranslateFilesDto {
  sourceLanguage: string;
  targetLanguage: string;
}
export interface TranslationResult {
  success: boolean;
  translatedText?: string;
  message?: string;
}
