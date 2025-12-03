import { Verse } from "../types";
import { parseInputText } from "../utils/bibleParser";
import { BOOK_NAMES } from "../data/bibleBooks";

// --- MOCK DATABASE ---
// In production, this object is replaced by your full JSON import:
// import FULL_BIBLE_JSON from './bible_data.json';
const MOCK_DB: Record<string, any> = {
  // Genesis 1:1-3 (Testing Ranges)
  "Gen 1:1": {
    rcvCn: "起初神创造天地。",
    rcvEn: "In the beginning God created the heavens and the earth.",
  },
  "Gen 1:2": {
    rcvCn: "地是空虚混沌，渊面黑暗；神的灵覆翼在水面上。",
    rcvEn: "But the earth became waste and emptiness, and darkness was on the surface of the deep, and the Spirit of God was brooding upon the surface of the waters.",
  },
  "Gen 1:3": {
    rcvCn: "神说，要有光，就有了光。",
    rcvEn: "And God said, Let there be light; and there was light.",
  },
  
  // Revelation 1:1
  "Rev 1:1": {
    rcvCn: "耶稣基督的启示，就是神赐给祂，叫祂将必要快发生的事指示祂的众奴仆...",
    rcvEn: "The revelation of Jesus Christ which God gave to Him...",
  },

  // Exodus 2:2
  "Exo 2:2": {
    rcvCn: "那女人怀孕，生一个儿子...",
    rcvEn: "And the woman conceived and bore a son...",
  }
};

export const fetchVerses = async (
  inputText: string, 
  imageBase64: string | undefined
): Promise<Verse[]> => {
  
  // 1. Mock OCR (Production would use a backend service)
  if (imageBase64) {
    console.warn("Image detected. In production, send to backend OCR.");
    inputText += " Gen 1:1"; // Mock result
  }

  // 2. Parse Input
  // This now handles ranges like "Gen 1:1-3" and returns verses: [1, 2, 3]
  const parsedRefs = parseInputText(inputText);

  // 3. Retrieve Data from Local JSON
  const results: Verse[] = [];

  for (const ref of parsedRefs) {
    const bookInfo = BOOK_NAMES[ref.book] || { cn: ref.book, en: ref.book };
    
    // Iterate through all requested verses (handling expanded ranges)
    for (const vNum of ref.verses) {
      const key = `${ref.book} ${ref.chapter}:${vNum}`;
      const data = MOCK_DB[key];

      if (data) {
        results.push({
          id: key, // Unique ID
          bookRef: ref.book,
          bookCn: bookInfo.cn,
          bookEn: bookInfo.en,
          chapter: ref.chapter,
          verse: vNum,
          textCn: data.rcvCn,
          textEn: data.rcvEn,
        });
      } else {
        // Handle Missing Data (Gracefully skip or show error)
        results.push({
          id: key,
          bookRef: ref.book,
          bookCn: bookInfo.cn,
          bookEn: bookInfo.en,
          chapter: ref.chapter,
          verse: vNum,
          textCn: `(Verse ${vNum} not found in database)`,
          textEn: `(Verse ${vNum} not found in database)`,
        });
      }
    }
  }

  // Simulate slight processing delay for better UX
  await new Promise(r => setTimeout(r, 400));
  
  return results;
};