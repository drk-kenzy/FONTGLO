"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Form } from "@/types/api";
import {
  formatPrice,
  getAuthorNames,
  formatRating,
  getBookCoverUrl,
} from "@/lib/utils";
import { useState } from "react";
import BookDetailModal from "@/components/BookDetailModal";
import { motion as m } from "framer-motion";

interface BookCardProps {
  form: Form;
  index?: number;
}

export default function BookCard({ form, index = 0 }: BookCardProps) {
  const coverUrl = getBookCoverUrl(form.cover);
  const authors = getAuthorNames(form.authors);
  const price = form.price
    ? formatPrice(form.price.amount, form.price.currency)
    : null;
  const rating = formatRating(form.averageRating);
  const [showDetail, setShowDetail] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-cream-50 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-sepia-100">
        <Image
          src={coverUrl}
          alt={form.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-book.svg";
          }}
        />

        {rating && (
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="absolute top-3 right-3 bg-sepia-800/90 backdrop-blur-sm text-cream-50 px-2.5 py-1 rounded-full text-xs font-body flex items-center gap-1"
            aria-hidden
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = parseFloat(rating) >= i + 1 - 0.25; // rough fill threshold
                return (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${filled ? "fill-current text-yellow-400" : "text-sepia-400"}`}
                    viewBox="0 0 20 20"
                    fill={filled ? "currentColor" : "none"}
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                );
              })}
              <span className="ml-1 text-xs" aria-hidden>{rating}</span>
            </div>
          </m.div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display text-base font-semibold text-sepia-800 line-clamp-2 leading-tight">
          {form.title}
        </h3>

        {authors && (
          <p className="text-sm text-sepia-600 font-body italic line-clamp-1">
            {authors}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          {price && (
            <span className="text-sm font-semibold text-sepia-700">
              {price}
            </span>
          )}

          <button
            onClick={() => setShowDetail(true)}
            className="ml-auto text-xs text-sepia-600 hover:text-sepia-800 underline underline-offset-2 transition-colors"
            aria-label={`View details for ${form.title}`}
          >
            Détails
          </button>

          <BookDetailModal
            open={showDetail}
            onClose={() => setShowDetail(false)}
            book={form}
          />
        </div>
      </div>

      <div className="absolute inset-0 border border-sepia-200/50 rounded-sm pointer-events-none group-hover:border-sepia-300/70 transition-colors duration-500" />
    </motion.div>
  );
}
