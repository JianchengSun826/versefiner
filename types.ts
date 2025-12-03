export enum LanguageMode {
  CHINESE_ONLY = 'CHINESE_ONLY',
  ENGLISH_ONLY = 'ENGLISH_ONLY',
  BOTH = 'BOTH',
}

export interface Verse {
  bookRef: string; // Standard key, e.g., "Rev"
  bookCn: string;
  bookEn: string;
  chapter: number;
  verse: number;
  textCn: string;
  textEn: string;
  id: string; // Unique ID for React keys
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
}