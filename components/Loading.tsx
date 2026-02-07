'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="relative w-20 h-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 border-4 border-sepia-200 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-sepia-500 border-t-transparent rounded-full"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-sepia-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

export function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-cream-200 rounded-sm mb-3" />
          <div className="h-4 bg-cream-200 rounded mb-2 w-3/4" />
          <div className="h-3 bg-cream-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function ShelfListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-cream-100 p-8 rounded-sm">
          <div className="h-8 bg-cream-300 rounded w-1/3 mb-3" />
          <div className="h-4 bg-cream-300 rounded w-2/3 mb-4" />
          <div className="h-6 bg-cream-300 rounded-full w-24" />
        </div>
      ))}
    </div>
  );
}
