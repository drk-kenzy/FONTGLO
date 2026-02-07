"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import OpenLibraryBookCard from "@/components/OpenLibraryBookCard";
import { searchOpenLibrary } from "@/lib/openLibrary";
import type { OpenLibraryDoc } from "@/lib/openLibrary";
import { useToasts } from "@/components/ToastProvider";
export default function SearchPage() {
  const [results, setResults] = useState<OpenLibraryDoc[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const { addToast } = useToasts();

  const handleSearch = useCallback(
    async (q: string, p: number = 1, append = false) => {
      setQuery(q);
      if (!q.trim()) {
        setResults([]);
        setTotal(null);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `/api/openlibrary/search?q=${encodeURIComponent(q)}&page=${p}&limit=40`,
        );
        const data = await res.json();
        const mapped = (data.docs || []).map((d: any) => ({
          key: d.key,
          title: d.title,
          authors: d.author_name,
          coverId: d.cover_i,
          firstPublishYear: d.first_publish_year,
          isbn: d.isbn,
        }));

        setResults((prev) => (append ? [...prev, ...mapped] : mapped));
        setTotal(data.numFound || 0);
        setPage(p);
      } catch (err) {
        console.error(err);
        addToast("Erreur lors de la recherche", "error");
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  const handleLoadMore = () => {
    if (!query) return;
    const next = page + 1;
    handleSearch(query, next, true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="font-display text-4xl font-bold text-sepia-900 mb-2">
          Recherche de livres
        </h1>
        <p className="text-sepia-600">
          Recherche via l'API Open Library — ajoutez facilement des livres à vos
          étagères
        </p>
      </motion.div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Rechercher un livre, un auteur..."
      />

      {loading ? (
        <p className="text-center text-sepia-500 mt-8">Recherche en cours...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
            {results.map((r, i) => (
              <OpenLibraryBookCard key={r.key} book={r} index={i} />
            ))}
          </div>

          {total !== null && (
            <div className="text-center mt-6">
              <p className="text-sm text-sepia-600 mb-3">{total} résultats</p>
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-sepia-800 text-cream-50 rounded-sm"
              >
                Charger plus
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
