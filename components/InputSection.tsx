import React, { useRef, useState } from 'react';
import { Image as ImageIcon, X, Search, Loader2, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onSearch: (text: string, imageBase64?: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSearch, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = () => {
    if (!text.trim() && !selectedImage) return;
    
    let rawBase64 = undefined;
    if (selectedImage) {
      rawBase64 = selectedImage.split(',')[1];
    }
    
    onSearch(text, rawBase64);
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fillExample = (example: string) => {
    setText(example);
  };

  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-4 md:p-6 transition-all">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste references here (e.g., 启一1; Ex 2:2)..."
          className="w-full h-32 p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-800 placeholder:text-slate-400 font-serif text-lg leading-relaxed"
          disabled={isLoading}
        />
        
        <div className="absolute bottom-3 right-3 flex gap-2">
           <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Upload Image"
            disabled={isLoading}
          >
            <ImageIcon size={20} />
          </button>
        </div>
      </div>
      
      {/* Quick Test Chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 flex items-center gap-1"><Sparkles size={12}/> Try examples:</span>
        <button onClick={() => fillExample('启一1')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md transition-colors">
          启一1
        </button>
        <button onClick={() => fillExample('Gen 1:1-3')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md transition-colors">
          Gen 1:1-3
        </button>
        <button onClick={() => fillExample('创1:1, Ex 2:2')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md transition-colors">
          Mixed
        </button>
        <button onClick={() => fillExample('创一1-3')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md transition-colors">
          创一1-3 (Range)
        </button>
      </div>

      {selectedImage && (
        <div className="mt-3 relative inline-block">
          <img src={selectedImage} alt="Preview" className="h-24 w-auto rounded-lg border border-slate-200 object-cover" />
          <button 
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
          >
            <X size={14} />
          </button>
          <p className="text-xs text-amber-600 mt-1">* Backend OCR required for images</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <button
        onClick={handleSearch}
        disabled={isLoading || (!text && !selectedImage)}
        className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md
          ${isLoading || (!text && !selectedImage)
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
          }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Search size={20} /> Search Verses
          </>
        )}
      </button>
    </div>
  );
};