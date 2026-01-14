import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

interface HeaderProps {
  isRecording: boolean;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  languages: string[];
}

const Header: React.FC<HeaderProps> = ({ isRecording, selectedLanguage, onLanguageChange, languages }) => {
  return (
    <header className="w-full bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30 shadow-sm print:hidden">
      
      {/* Left Side: Status / Context */}
      <div className="flex items-center space-x-4">
         {isRecording && (
          <div className="flex items-center space-x-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Live Recording</span>
          </div>
        )}
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Credits Pill */}
        <div className="hidden md:flex bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-teal-100 items-center">
            <span>Credits Remaining: 20</span>
        </div>

        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-all">
             <span>{selectedLanguage}</span>
             <ChevronDown size={14} />
          </button>
          {/* Dropdown would go here, using native select for simplicity in this implementation */}
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
             {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2"></div>

        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
           <Bell size={20} />
           <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
        </button>

        <button className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
           <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-xs border border-red-200">
             SM
           </div>
           <span className="text-sm font-medium hidden md:block">Dr. Shaun Murphy</span>
           <ChevronDown size={14} className="text-gray-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
};

export default Header;