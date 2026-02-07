"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Modal from "./Modal";
import { getOpenLibraryCoverUrl } from "@/lib/openLibrary";
import type { Form, OpenLibraryBook } from "@/types/api";
import { getShelves, addBookToShelf, createShelf, removeBookFromShelf } from "@/lib/localShelves";
import { useToasts } from "@/components/ToastProvider";

interface Props {
  open: boolean;
  onClose: () => void;
  book?: Form | OpenLibraryBook | null;
}

export default function BookDetailModal({ open, onClose, book }: Props) {
  const [openLibDetails, setOpenLibDetails] = useState<any | null>(null);
  const [editions, setEditions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'editions' | 'details' | 'similars'>('overview');
  const { addToast } = useToasts();

  useEffect(() => {
    if (!book) return;

    // If it looks like an OpenLibraryBook (has key), fetch extra details via our API
    if ((book as OpenLibraryBook).key) {
      const key = (book as OpenLibraryBook).key;
      const id = key.replace('/works/', '').replace(/^\//, '');
      fetch(`/api/openlibrary/work/${id}?include=editions`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          setOpenLibDetails(d.work || null);
          setEditions(d.editions?.entries || []);
        })
        .catch(() => {
          setOpenLibDetails(null);
          setEditions([]);
        });
    } else {
      setOpenLibDetails(null);
      setEditions([]);
    }
  }, [book]);

  if (!book) return null;

  const isGlose =
    (book as Form).title !== undefined && !(book as OpenLibraryBook).key;

  const title = isGlose
    ? (book as Form).title
    : (book as OpenLibraryBook).title;
  const authors = isGlose
    ? (book as Form).authors?.map((a) => a.name)
    : (book as OpenLibraryBook).authors;
  const cover = isGlose
    ? (book as Form).cover
    : (book as OpenLibraryBook).coverId
      ? getOpenLibraryCoverUrl((book as OpenLibraryBook).coverId, "L")
      : undefined;
  const description = isGlose
    ? (book as Form).description
    : openLibDetails?.description?.value || openLibDetails?.description || null;
  const publisher = isGlose
    ? (book as Form).publisher
    : openLibDetails?.publishers?.join(", ");
  const publishedDate = isGlose
    ? (book as Form).publishedDate
    : openLibDetails?.first_publish_date ||
      (book as OpenLibraryBook).firstPublishYear;
  const rating = isGlose ? (book as Form).averageRating : null;
  const [shelves, setShelves] = useState(getShelves());
  const [showCreateShelfInline, setShowCreateShelfInline] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');
  const [pendingEdition, setPendingEdition] = useState<any | null>(null);

  function handleAddEditionToShelf(shelfId: string, edition: any) {
    const bookId = addBookToShelf(shelfId, {
      title: edition.title || title,
      authors: authors || [],
      cover: edition.cover_i ? getOpenLibraryCoverUrl(edition.cover_i, 'M') : cover,
      source: 'openlibrary',
      meta: { edition },
    });

    addToast('Livre ajouté', 'success', {
      label: 'Annuler',
      onClick: () => {
        removeBookFromShelf?.(shelfId, bookId);
      },
    });
  }

  function handleCreateShelfAndAdd(edition?: any) {
    const ed = edition || pendingEdition;
    if (!newShelfName.trim() || !ed) return;
    const s = createShelf(newShelfName.trim());
    handleAddEditionToShelf(s.id, ed);
    setShelves(getShelves());
    setNewShelfName('');
    setPendingEdition(null);
    setShowCreateShelfInline(false);
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="w-full aspect-[2/3] bg-sepia-100 relative rounded-sm overflow-hidden">
            {cover ? (
              <Image
                src={String(cover)}
                alt={title}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />
            ) : (
              <img
                src="/placeholder-book.svg"
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-sepia-800 mb-1">
                {title}
              </h3>
              {authors && (
                <div className="text-sm text-sepia-600 mb-2">{authors.join(', ')}</div>
              )}
              {rating && (
                <div className="text-sm text-sepia-700 mb-2">Note moyenne : {rating}</div>
              )}
            </div>
            <div>
              {isGlose && (
                <a
                  href={`https://glose.com/forms/${(book as Form)._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-sepia-600 underline"
                >
                  Voir sur Glose
                </a>
              )}
              {!isGlose && (book as OpenLibraryBook).key && (
                <a
                  href={`https://openlibrary.org${(book as OpenLibraryBook).key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-sepia-600 underline"
                >
                  Voir sur Open Library
                </a>
              )}
            </div>
          </div>

          <div className="mt-4">
            <nav className="flex gap-2 mb-4">
              <button onClick={() => setActiveTab('overview')} className={`px-3 py-1 rounded-sm ${activeTab === 'overview' ? 'bg-sepia-800/10' : 'bg-transparent'}`}>Aperçu</button>
              <button onClick={() => setActiveTab('editions')} className={`px-3 py-1 rounded-sm ${activeTab === 'editions' ? 'bg-sepia-800/10' : 'bg-transparent'}`}>Éditions</button>
              <button onClick={() => setActiveTab('details')} className={`px-3 py-1 rounded-sm ${activeTab === 'details' ? 'bg-sepia-800/10' : 'bg-transparent'}`}>Détails</button>
              <button onClick={() => setActiveTab('similars')} className={`px-3 py-1 rounded-sm ${activeTab === 'similars' ? 'bg-sepia-800/10' : 'bg-transparent'}`}>Similaires</button>
            </nav>

            {activeTab === 'overview' && (
              <div>
                {description ? (
                  <div className="prose max-w-none text-sepia-700">{typeof description === 'string' ? description : description}</div>
                ) : (
                  <div className="text-sm text-sepia-500">Pas de description disponible.</div>
                )}

                {openLibDetails?.subjects?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {openLibDetails.subjects.slice(0, 12).map((s: string) => (
                      <button key={s} onClick={() => { if (typeof window !== 'undefined') window.location.href = `/search?q=${encodeURIComponent(s)}` }} className="text-xs px-2 py-1 bg-cream-50 border border-sepia-200 rounded-sm">{s}</button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'editions' && (
              <div className="space-y-3">
                {editions.length === 0 && (
                  <div className="text-sm text-sepia-500">Aucune édition trouvée.</div>
                )}

                {editions.map((e) => (
                  <div key={e.key} className="flex items-center gap-3 p-2 border rounded-sm">
                    <div className="w-12 h-16 relative bg-sepia-100 overflow-hidden rounded-sm">
                      <img src={e.cover_i ? getOpenLibraryCoverUrl(e.cover_i, 'S') : '/placeholder-book.svg'} alt={e.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sepia-800 text-sm">{e.title}</div>
                      <div className="text-xs text-sepia-500">{(e.publishers || []).slice(0,2).join(', ')} • {e.publish_date || ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`https://openlibrary.org${e.key}`} target="_blank" rel="noreferrer" className="text-xs underline">Voir</a>
                      <div className="flex items-center gap-2">
                        <select className="text-xs border px-2 py-1 rounded-sm" defaultValue="" onChange={(ev) => {
                          const shelfId = ev.target.value;
                          if (!shelfId) return;
                          if (shelfId === 'create') {
                            setPendingEdition(e);
                            setShowCreateShelfInline(true);
                            return;
                          }
                          handleAddEditionToShelf(shelfId, e);
                        }}>
                          <option value="">Ajouter à...</option>
                          {shelves.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          <option value="create">+ Créer une étagère</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {showCreateShelfInline && (
                  <div className="mt-2 flex gap-2">
                    <input value={newShelfName} onChange={(ev) => setNewShelfName(ev.target.value)} placeholder="Nom d'étagère" className="px-2 py-1 border rounded-sm" />
                    <button onClick={() => handleCreateShelfAndAdd(editions[0])} className="px-3 py-1 bg-sepia-800/10 rounded-sm">Créer et ajouter</button>
                    <button onClick={() => setShowCreateShelfInline(false)} className="px-3 py-1">Annuler</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="prose max-w-none text-sepia-700 mt-2">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><strong>Publié :</strong><div className="text-sm text-sepia-500">{publishedDate || '—'}</div></div>
                  <div><strong>Éditeur :</strong><div className="text-sm text-sepia-500">{publisher || '—'}</div></div>
                  <div><strong>ISBN :</strong><div className="text-sm text-sepia-500">{(openLibDetails?.isbn_10 || []).concat(openLibDetails?.isbn_13 || []).join(', ') || '—'}</div></div>
                  <div><strong>Pages :</strong><div className="text-sm text-sepia-500">{openLibDetails?.number_of_pages || '—'}</div></div>
                </dl>
              </div>
            )}

            {activeTab === 'similars' && (
              <div className="mt-2 text-sm text-sepia-700">Suggestions basées sur les sujets : {openLibDetails?.subjects?.slice(0,6).join(', ') || '—'}</div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
