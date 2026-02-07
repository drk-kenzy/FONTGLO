"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getShelves,
  createShelf,
  deleteShelf,
  getShelfBooks,
  removeBookFromShelf,
} from "@/lib/localShelves";
import type { LocalShelf, LocalBook } from "@/types/api";
import Modal from "@/components/Modal";
import { useToasts } from "@/components/ToastProvider";

export default function ShelvesManager() {
  const [shelves, setShelves] = useState<LocalShelf[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { addToast } = useToasts();

  useEffect(() => {
    setShelves(getShelves());
  }, []);

  const refresh = () => setShelves(getShelves());

  const handleCreate = () => {
    if (!name.trim()) return;
    createShelf(name.trim());
    setName("");
    refresh();
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteShelf(deleteId);
    if (selected === deleteId) setSelected(null);
    setDeleteId(null);
    refresh();
    addToast("Étagère supprimée", "success");
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const books = selected ? getShelfBooks(selected) : [];

  const handleRemoveBook = (bookId: string) => {
    if (!selected) return;
    removeBookFromShelf(selected, bookId);
    refresh();
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div className="md:col-span-1 p-4 bg-cream-50 rounded-sm shadow-sm">
        <h3 className="font-display text-lg font-semibold mb-3">
          Mes étagères
        </h3>
        <div className="space-y-3">
          {shelves.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <button
                onClick={() => setSelected(s.id)}
                className={`text-left py-2 px-2 rounded-sm w-full ${selected === s.id ? "bg-cream-100" : ""}`}
              >
                <div className="font-medium text-sepia-800">{s.name}</div>
                <div className="text-xs text-sepia-500">
                  {s.books.length} livre{s.books.length !== 1 ? "s" : ""}
                </div>
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="ml-2 text-xs text-red-500"
              >
                Supprimer
              </button>
            </div>
          ))}

          {shelves.length === 0 && (
            <p className="text-sm text-sepia-500">
              Aucune étagère. Créez la première !
            </p>
          )}
        </div>

        <div className="mt-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nouvelle étagère"
            className="w-full px-3 py-2 border rounded-sm bg-white text-sepia-800"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleCreate}
              className="px-3 py-1 bg-sepia-800/10 rounded-sm"
            >
              Créer
            </button>
            <button
              onClick={() => {
                setName("");
              }}
              className="px-3 py-1 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div className="md:col-span-2 p-4 bg-white rounded-sm shadow-sm">
        <h3 className="font-display text-lg font-semibold mb-3">Contenu</h3>

        {!selected ? (
          <p className="text-sm text-sepia-500">
            Sélectionnez une étagère pour voir son contenu
          </p>
        ) : (
          <div className="space-y-4">
            {books.length === 0 ? (
              <p className="text-sm text-sepia-500">Cette étagère est vide</p>
            ) : (
              books.map((b: LocalBook) => (
                <div key={b.id} className="flex items-start gap-3">
                  <img
                    src={b.cover || "/placeholder-book.svg"}
                    alt={b.title}
                    className="w-12 h-16 object-cover rounded-sm"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sepia-800">{b.title}</div>
                    {b.authors && (
                      <div className="text-xs text-sepia-500">
                        {b.authors.join(", ")}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => handleRemoveBook(b.id)}
                      className="text-xs text-red-500"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>

      <Modal
        open={!!deleteId}
        title="Supprimer l'étagère"
        onClose={cancelDelete}
      >
        <div>
          <p>Êtes-vous sûr de vouloir supprimer cette étagère ?</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={confirmDelete}
              className="px-3 py-1 bg-red-50 text-red-700 rounded-sm"
            >
              Supprimer
            </button>
            <button onClick={cancelDelete} className="px-3 py-1">
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
