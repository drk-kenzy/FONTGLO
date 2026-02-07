'use client';

import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export default function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
    >
      <div className="mb-6 text-sepia-400">
        <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h2 className="font-display text-2xl font-bold text-sepia-800 mb-3">
        Oups, une erreur s'est produite
      </h2>
      
      <p className="text-sepia-600 font-body mb-6 max-w-md">
        {message}
      </p>
      
      {retry && (
        <button
          onClick={retry}
          className="px-6 py-3 bg-sepia-800 text-cream-50 rounded-sm hover:bg-sepia-700 transition-colors duration-300 font-body shadow-md hover:shadow-lg"
        >
          Réessayer
        </button>
      )}
    </motion.div>
  );
}
