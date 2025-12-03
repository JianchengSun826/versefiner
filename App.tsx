import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { LanguageMode, Verse, ProcessingState } from './types';
import { InputSection } from './components/InputSection';
import { VerseCard } from './components/VerseCard';
import { fetchVerses } from './services/bibleService';

const App: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [languageMode, setLanguageMode] = useState<LanguageMode>(LanguageMode.BOTH);
  const [status, setStatus] = useState<ProcessingState>({
    isLoading: false,
    error: null,
  });

  const handleSearch = async (text: string, imageBase64?: string) => {
    setStatus({ isLoading: true, error: null });
    setVerses([]); 

    try {
      const results = await fetchVerses(text, imageBase64);
      setVerses(results);
      if (results.length === 0) {
        setStatus({ isLoading: false, error: 'No valid references found or data missing.' });
      } else {
        setStatus({ isLoading: false, error: null });
      }
    } catch (err: any) {
      setStatus({ 
        isLoading: false, 
        error: err.message || "An unknown error occurred", 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 text-blue-800">
              <BookOpen className="h-6 w-6" />
              <h1 className="font-bold text-xl tracking-tight">ScriptureFinder</h1>
            </div>
            <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
              Recovery Version
            </div>
          </div>

          {/* Language Toggle Bar */}
          <div className="flex w-full bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setLanguageMode(LanguageMode.CHINESE_ONLY)}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${languageMode === LanguageMode.CHINESE_ONLY ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              中文 only
            </button>
            <button
              onClick={() => setLanguageMode(LanguageMode.BOTH)}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${languageMode === LanguageMode.BOTH ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Interleaved (中/En)
            </button>
            <button
              onClick={() => setLanguageMode(LanguageMode.ENGLISH_ONLY)}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${languageMode === LanguageMode.ENGLISH_ONLY ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              English only
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Intro */}
        <div className="text-center mb-4">
          <p className="text-slate-500 text-sm">
            Enter references (e.g., <span className="font-mono text-slate-700 bg-slate-100 px-1 rounded">启一1</span>, <span className="font-mono text-slate-700 bg-slate-100 px-1 rounded">Exo 2:2</span>). 
            Supports mixed languages.
          </p>
        </div>

        {/* Input Area */}
        <InputSection onSearch={handleSearch} isLoading={status.isLoading} />

        {/* Status Messages */}
        {status.error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center justify-center">
            {status.error}
          </div>
        )}

        {/* Results List */}
        <div className="space-y-4 pb-20">
          {verses.map((verse) => (
            <VerseCard 
              key={verse.id} 
              verse={verse} 
              mode={languageMode} 
            />
          ))}
          
          {!status.isLoading && verses.length > 0 && (
            <div className="text-center text-xs text-slate-300 pt-8">
              End of results
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;