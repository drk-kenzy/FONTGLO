"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ShelfCard from "@/components/ShelfCard";
import Pagination from "@/components/Pagination";
import Loading, { ShelfListSkeleton } from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { getBookshelves } from "@/lib/api";
import type { Bookshelf } from "@/types/api";
import ImportGlose from "@/components/ImportGlose";
import ImportAllFromProfile from "@/components/ImportAllFromProfile";

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const [shelves, setShelves] = useState<Bookshelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [userId, setUserId] = useState("5a8411b53ed02c04187ff02a");
  const [userInput, setUserInput] = useState("5a8411b53ed02c04187ff02a");

  const fetchShelves = async (page: number, currentUserId: string = userId) => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response = await getBookshelves(currentUserId, offset, ITEMS_PER_PAGE);

      setShelves(response.data || []);
      setTotalItems(response.metadata?.count || response.data?.length || 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les étagères",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelves(currentPage, userId);
  }, [currentPage, userId]);

  const handleUserChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      setUserId(userInput.trim());
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-5xl md:text-6xl font-bold text-sepia-900 mb-4 text-balance">
          Vos Étagères Littéraires
        </h1>
        <p className="font-body text-lg text-sepia-600 max-w-2xl mx-auto text-balance">
          Découvrez et explorez votre collection de livres organisée avec soin
        </p>

        <div className="mt-8 w-24 h-1 bg-gradient-to-r from-transparent via-sepia-400 to-transparent mx-auto" />
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="/search"
            className="px-4 py-2 rounded-sm bg-sepia-800 text-cream-50 font-semibold hover:bg-sepia-900 transition-colors"
          >
            Recherche
          </a>
          <a
            href="/my-shelves"
            className="px-4 py-2 rounded-sm border border-sepia-200 text-sepia-800 hover:bg-cream-100 transition-colors"
          >
            Mes étagères
          </a>
        </div>

        <div className="mt-8 max-w-2xl mx-auto flex flex-col gap-6">
          <div>
            <h3 className="font-display text-lg text-sepia-800 mb-3">
              Importer toutes les étagères du profil @MarcOwenHOUNTON
            </h3>
            <ImportAllFromProfile />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <ShelfListSkeleton />
      ) : error ? (
        <ErrorMessage message={error} retry={() => fetchShelves(currentPage)} />
      ) : shelves.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="font-body text-sepia-600 text-lg">
            Aucune étagère trouvée
          </p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-6 max-w-4xl mx-auto">
            {shelves.map((shelf, index) => (
              <ShelfCard key={shelf._id} shelf={shelf} index={index} />
            ))}
          </div>

          {totalItems > ITEMS_PER_PAGE && (
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
