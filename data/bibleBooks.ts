// Maps various inputs to a standard code (e.g., "Gen")
// This is a subset for demonstration. In production, add all 66 books.

export const BOOK_MAPPINGS: Record<string, string> = {
  // Chinese
  '创': 'Gen', '创世记': 'Gen',
  '出': 'Exo', '出埃及记': 'Exo',
  '太': 'Mat', '马太福音': 'Mat',
  '启': 'Rev', '启示录': 'Rev',
  // English
  'gen': 'Gen', 'genesis': 'Gen',
  'exo': 'Exo', 'exodus': 'Exo',
  'mat': 'Mat', 'matthew': 'Mat',
  'rev': 'Rev', 'revelation': 'Rev'
};

export const BOOK_NAMES: Record<string, { cn: string; en: string }> = {
  'Gen': { cn: '创世记', en: 'Genesis' },
  'Exo': { cn: '出埃及记', en: 'Exodus' },
  'Mat': { cn: '马太福音', en: 'Matthew' },
  'Rev': { cn: '启示录', en: 'Revelation' },
};
