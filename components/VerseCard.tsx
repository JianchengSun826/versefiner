import React from 'react';
import { Verse, LanguageMode } from '../types';

interface VerseCardProps {
  verse: Verse;
  mode: LanguageMode;
}

export const VerseCard: React.FC<VerseCardProps> = ({ verse, mode }) => {
  const showCn = mode === LanguageMode.CHINESE_ONLY || mode === LanguageMode.BOTH;
  const showEn = mode === LanguageMode.ENGLISH_ONLY || mode === LanguageMode.BOTH;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-baseline justify-between mb-3 border-b border-slate-100 pb-2">
        <h3 className="text-lg font-bold text-blue-800">
           {showCn ? verse.bookCn : verse.bookEn} {verse.chapter}:{verse.verse}
        </h3>
        {mode === LanguageMode.BOTH && (
           <span className="text-sm text-slate-400">
             {verse.bookEn} {verse.chapter}:{verse.verse}
           </span>
        )}
      </div>

      <div className="space-y-3">
        {mode === LanguageMode.BOTH ? (
           // Interleaved Mode
           <div className="flex flex-col gap-2">
             <div className="text-slate-900 text-lg leading-relaxed font-serif tracking-wide border-l-4 border-blue-100 pl-3">
               {verse.textCn}
             </div>
             <div className="text-slate-600 text-base leading-relaxed pl-4 font-sans italic">
               {verse.textEn}
             </div>
           </div>
        ) : (
          // Single Language Mode
          <div>
            {showCn && (
              <p className="text-slate-900 text-lg leading-relaxed font-serif tracking-wide">
                {verse.textCn}
              </p>
            )}
            {showEn && (
              <p className="text-slate-800 text-base leading-relaxed font-sans">
                {verse.textEn}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
