'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Bookshelf } from '@/types/api';

interface ShelfCardProps {
  shelf: Bookshelf;
  index?: number;
}

export default function ShelfCard({ shelf, index = 0 }: ShelfCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/shelf/${shelf._id}`}
        className="group block relative bg-gradient-to-br from-cream-100 to-cream-200 p-8 rounded-sm shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-sepia-200/30 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-sepia-800 mb-2 group-hover:text-sepia-900 transition-colors">
                {shelf.name}
              </h2>
              
              {shelf.description && (
                <p className="text-sepia-600 font-body text-sm leading-relaxed line-clamp-2">
                  {shelf.description}
                </p>
              )}
            </div>
            
            <svg 
              className="w-6 h-6 text-sepia-400 group-hover:text-sepia-600 transform group-hover:translate-x-1 transition-all duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {shelf.formsCount !== undefined && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sepia-800/10 rounded-full">
              <svg className="w-4 h-4 text-sepia-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span className="text-sm font-semibold text-sepia-700">
                {shelf.formsCount} {shelf.formsCount === 1 ? 'livre' : 'livres'}
              </span>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sepia-300 via-sepia-400 to-sepia-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </Link>
    </motion.div>
  );
}
