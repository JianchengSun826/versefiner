import { BOOK_MAPPINGS } from '../data/bibleBooks';

// Helper: Convert Chinese numbers to Arabic
const chineseToNumber = (str: string): number | null => {
  if (!str) return null;
  // If it's already arabic digits
  if (/^\d+$/.test(str)) return parseInt(str, 10);

  const cnNums: Record<string, number> = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
    '百': 100
  };

  let val = 0;
  // Simple cases
  if (cnNums[str]) return cnNums[str];
  
  // Complex cases (11-99) roughly implemented
  // E.g., 十一 (11), 二十 (20), 二十一 (21)
  const parts = str.split('十');
  if (parts.length === 2) {
    const tens = parts[0] ? (cnNums[parts[0]] || 1) : 1;
    const ones = parts[1] ? (cnNums[parts[1]] || 0) : 0;
    val = tens * 10 + ones;
  } else {
     // Fallback for single char not in map or complex parsing
     return null;
  }
  
  return val > 0 ? val : null;
};

export interface ParsedReference {
  book: string; // Standard Key e.g. "Rev"
  chapter: number;
  verses: number[]; // Array of verse numbers to fetch
}

export const parseInputText = (input: string): ParsedReference[] => {
  const references: ParsedReference[] = [];
  
  // Normalize input: 
  // 1. Unified punctuation (convert Chinese colon/dash to standard)
  let cleanInput = input
    .replace(/：/g, ':')
    .replace(/[—–]/g, '-') // Em dashes
    .replace(/，/g, ',')
    .replace(/；/g, ';')
    .replace(/第/g, '') // Remove prefix '第'
    .replace(/[章节]/g, ' '); // Remove explicit words for chapter/verse

  // Regex Strategy:
  // Capture Group 1: Book Name (Chinese or English letters)
  // Capture Group 2: Chapter Number (Digits or Chinese)
  // Capture Group 3: Separator (Colon or Space)
  // Capture Group 4: Verse Range String (e.g., "1", "1-3", "一", "一至三")
  
  // Note: This regex allows for flexibility like "Gen 1:1", "Gen 1 1", "启一1"
  const regex = /([a-zA-Z\u4e00-\u9fa5]+)\s*(\d+|[一二三四五六七八九十]+)[\s:]*(\d+(?:[\s-]\d+)?|[一二三四五六七八九十]+(?:[至-][一二三四五六七八九十]+)?)/g;

  let match;
  while ((match = regex.exec(cleanInput)) !== null) {
    const bookRaw = match[1].trim();
    const chapterRaw = match[2];
    const verseRaw = match[3]; // Could be "1", "1-3", "一", "一-三"

    // 1. Identify Book
    const standardBook = BOOK_MAPPINGS[bookRaw.toLowerCase()];
    if (!standardBook) continue;

    // 2. Parse Chapter
    const chapter = chineseToNumber(chapterRaw);
    if (!chapter) continue;

    // 3. Parse Verse Range
    const verseList: number[] = [];
    
    // Check if it is a range
    if (verseRaw.includes('-') || verseRaw.includes('至')) {
      const parts = verseRaw.split(/[-至]/);
      const start = chineseToNumber(parts[0].trim());
      const end = chineseToNumber(parts[1].trim());

      if (start && end && end >= start) {
        for (let i = start; i <= end; i++) {
          verseList.push(i);
        }
      }
    } else {
      // Single verse
      const v = chineseToNumber(verseRaw);
      if (v) verseList.push(v);
    }

    if (verseList.length > 0) {
      references.push({
        book: standardBook,
        chapter: chapter,
        verses: verseList
      });
    }
  }

  return references;
};