'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Rechercher...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative max-w-2xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pl-14 pr-14 bg-cream-100 border-2 border-sepia-200 rounded-sm text-sepia-800 placeholder-sepia-400 font-body focus:outline-none focus:border-sepia-500 focus:bg-white transition-all duration-300 shadow-sm focus:shadow-md"
        />
        
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-sepia-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-sepia-400 hover:text-sepia-700 transition-colors"
            aria-label="Effacer la recherche"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className={`absolute inset-0 bg-gradient-to-r from-sepia-300 via-sepia-400 to-sepia-300 rounded-sm transition-opacity duration-300 -z-10 blur-xl ${isFocused ? 'opacity-20' : 'opacity-0'}`} />
    </motion.form>
  );
}
