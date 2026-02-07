'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import Loading, { BookGridSkeleton } from '@/components/Loading';
import ErrorMessage from '@/components/ErrorMessage';
import { getShelfForms, getMultipleForms, searchForms } from '@/lib/api';
import type { Form } from '@/types/api';

const ITEMS_PER_PAGE = 20;

export default function ShelfPage() {
  const params = useParams();
  const router = useRouter();
  const shelfId = params.id as string;

  const [books, setBooks] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchBooks = useCallback(async (page: number, query: string = '') => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * ITEMS_PER_PAGE;

      if (query.trim()) {
        setIsSearching(true);
        const results = await searchForms(shelfId, query, offset, ITEMS_PER_PAGE);
        setBooks(results.map(r => r.data));
        setTotalItems(results.length);
      } else {
        setIsSearching(false);
        const formListResponse = await getShelfForms(shelfId, offset, ITEMS_PER_PAGE);
        const formResponses = await getMultipleForms(formListResponse.data);
        
        setBooks(formResponses.map(r => r.data));
        setTotalItems(formListResponse.metadata?.count || formListResponse.data.length);
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Impossible de charger les livres'
      );
    } finally {
      setLoading(false);
    }
  }, [shelfId]);

  useEffect(() => {
    fetchBooks(currentPage, searchQuery);
  }, [currentPage, fetchBooks, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-sepia-600 hover:text-sepia-800 font-body mb-6 transition-colors duration-300 group"
        >
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux étagères
        </button>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-sepia-900 mb-6">
          Collection de Livres
        </h1>

        <SearchBar 
          onSearch={handleSearch}
          placeholder="Rechercher par titre ou auteur..."
        />
      </motion.div>

      {loading ? (
        <BookGridSkeleton />
      ) : error ? (
        <ErrorMessage 
          message={error} 
          retry={() => fetchBooks(currentPage, searchQuery)}
        />
      ) : books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="mb-6 text-sepia-300">
            <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
          <p className="font-body text-sepia-600 text-lg">
            {isSearching 
              ? 'Aucun livre trouvé pour cette recherche' 
              : 'Cette étagère est vide'}
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <p className="font-body text-sepia-600">
              {isSearching ? (
                <>
                  <span className="font-semibold">{books.length}</span> résultat
                  {books.length > 1 ? 's' : ''} pour &quot;{searchQuery}&quot;
                </>
              ) : (
                <>
                  <span className="font-semibold">{totalItems}</span> livre
                  {totalItems > 1 ? 's' : ''} dans cette collection
                </>
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book, index) => (
              <BookCard key={book._id} form={book} index={index} />
            ))}
          </div>

          {!isSearching && totalItems > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
