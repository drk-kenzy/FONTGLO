"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getOpenLibraryCoverUrl } from "@/lib/openLibrary";
import {
  getShelves,
  addBookToShelf,
  createShelf,
  removeBookFromShelf,
} from "@/lib/localShelves";
import type { OpenLibraryBook, LocalShelf } from "@/types/api";
import Modal from "@/components/Modal";
import { useToasts } from "@/components/ToastProvider";
import BookDetailModal from '@/components/BookDetailModal';
interface Props {
  book: OpenLibraryBook;
  index?: number;
}

export default function OpenLibraryBookCard({ book, index = 0 }: Props) {
  const [shelves, setShelves] = useState<LocalShelf[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const coverUrl = book.coverId
    ? getOpenLibraryCoverUrl(book.coverId, "M")
    : "/placeholder-book.svg";
  const { addToast } = useToasts();
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setShelves(getShelves());
  }, []);

  const handleAdd = async () => {
    const currentShelves = getShelves();

    if (currentShelves.length === 0) {
      setShowCreateModal(true);
      return;
    }

    setIsAdding(true);
  };

  const handleChooseShelf = (shelfId: string) => {
    const bookId = addBookToShelf(shelfId, {
      title: book.title,
      authors: book.authors,
      cover: coverUrl,
      source: "openlibrary",
      meta: book,
    });
    setIsAdding(false);
    addToast("Livre ajouté", "success", {
      label: "Annuler",
      onClick: () => {
        removeBookFromShelf?.(shelfId, bookId);
      },
    });
  };

  const handleCreateAndAdd = () => {
    if (!newShelfName.trim()) return;
    const s = createShelf(newShelfName.trim());
    addBookToShelf(s.id, {
      title: book.title,
      authors: book.authors,
      cover: coverUrl,
      source: "openlibrary",
      meta: book,
    });
    setShelves(getShelves());
    setNewShelfName("");
    setShowCreateModal(false);
    addToast(`Livre ajouté à «${s.name}»`, "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group relative bg-cream-50 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-sepia-100">
        <Image src={coverUrl} alt={book.title} fill className="object-cover" />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-display text-base font-semibold text-sepia-800 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        {book.authors && (
          <p className="text-sm text-sepia-600 font-body italic line-clamp-1">
            {book.authors.join(", ")}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setShowDetail(true)}
            className="text-xs text-sepia-600 hover:text-sepia-800 underline underline-offset-2 mr-2"
            aria-label={`Voir les détails de ${book.title}`}
          >
            Détails
          </button>

          <button
            onClick={handleAdd}
            className="ml-auto text-sm px-3 py-1 rounded-sm bg-sepia-800/10 hover:bg-sepia-800/20 transition-colors"
          >
            Ajouter
          </button>
        </div>

        {isAdding && (
          <div className="mt-3">
            <p className="text-xs text-sepia-600 mb-2">
              Choisissez une étagère :
            </p>
            <div className="flex gap-2 flex-wrap">
              {shelves.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleChooseShelf(s.id)}
                  className="px-2 py-1 bg-cream-100 border border-sepia-200 rounded-sm text-sm hover:bg-cream-200"
                >
                  {s.name}
                </button>
              ))}
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-2 py-1 bg-cream-50 border border-dashed border-sepia-200 rounded-sm text-sm hover:bg-cream-100"
              >
                + Créer
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="ml-auto text-xs text-sepia-500"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={showCreateModal}
        title="Créer une étagère"
        onClose={() => setShowCreateModal(false)}
      >
        <div>
          <input
            value={newShelfName}
            onChange={(e) => setNewShelfName(e.target.value)}
            placeholder="Nom de l'étagère"
            className="w-full px-3 py-2 border rounded-sm bg-white text-sepia-800"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleCreateAndAdd}
              className="px-3 py-1 bg-sepia-800/10 rounded-sm"
            >
              Créer et ajouter
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-3 py-1"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>

      <BookDetailModal open={showDetail} onClose={() => setShowDetail(false)} book={book} />

      <div className="absolute inset-0 border border-sepia-200/50 rounded-sm pointer-events-none group-hover:border-sepia-300/70 transition-colors duration-500" />
    </motion.div>
  );
}
