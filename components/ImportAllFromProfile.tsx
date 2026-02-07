"use client";

import { useState } from "react";
import { useToasts } from "@/components/ToastProvider";
import { createShelf, addBookToShelf } from "@/lib/localShelves";

export default function ImportAllFromProfile({ defaultUsername = "MarcOwenHOUNTON" }: { defaultUsername?: string }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(defaultUsername);
  const { addToast } = useToasts();

  const handleImportAll = async () => {
    const u = username.trim();
    if (!u) return addToast("Entrez un nom d'utilisateur Glose", "error");

    setLoading(true);
    try {
      // 1) Récupère la liste des étagères (via userId détecté ou fallback) depuis l'API serveur
      const res = await fetch("/api/import-glose/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data?.error || `Échec (HTTP ${res.status})`, "error");
        return;
      }
      if (!Array.isArray(data.shelves) || data.shelves.length === 0) {
        addToast("Aucune étagère à importer", "error");
        return;
      }

      // 2) Pour chaque étagère détectée, récupérer les livres et créer localement
      let imported = 0;
      for (const shelf of data.shelves) {
        const s = createShelf(`Glose: ${shelf.name || shelf._id.slice(0,6)}`, shelf.description);
        const shelfUrl = `https://glose.com/shelves/${shelf._id}`;
        const sr = await fetch("/api/import-glose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: shelfUrl }),
        });
        const sd = await sr.json();
        if (sr.ok && sd?.books) {
          sd.books.forEach((b: any) => {
            const exists = s.books.some((bb: any) => bb.title === b.title && JSON.stringify(bb.authors || []) === JSON.stringify(b.authors?.map((a: any) => a.name) || []));
            if (exists) return;
            addBookToShelf(s.id, {
              title: b.title,
              authors: b.authors?.map((a: any) => a.name) || [],
              cover: b.cover || null,
              source: "glose",
              meta: b,
            });
          });
          imported += 1;
        }
      }

      addToast(`${imported} étagères importées depuis @${u}`, "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      addToast(`Erreur: ${msg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-50 p-4 rounded-sm shadow-sm">
      <div className="flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur Glose (ex: MarcOwenHOUNTON)"
          className="flex-1 px-3 py-2 border rounded-sm"
        />
        <button
          onClick={handleImportAll}
          disabled={loading}
          className="px-3 py-2 bg-sepia-800 text-cream-50 rounded-sm"
        >
          {loading ? "Import..." : "Importer toutes les étagères"}
        </button>
      </div>
    </div>
  );
}
