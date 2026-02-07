"use client";

import { useState } from "react";
import { useToasts } from "@/components/ToastProvider";
import { createShelf, addBookToShelf } from "@/lib/localShelves";

export default function ImportGlose() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const { addToast } = useToasts();

  const handleImport = async () => {
    const u = url.trim();
    if (!u) return addToast("Entrez une URL", "error");

    // Validate glose profile/shelf URLs
    const glosePattern = /^https?:\/\/(www\.)?glose\.com\/(u\/[^\/]+\/books\/all\/?|shelves\/[A-Za-z0-9]{24}\/?|book\/.+|users\/[a-f0-9]{24}\/shelves\/?)/i;
    if (!glosePattern.test(u)) {
      addToast("URL Glose invalide. Exemple: https://glose.com/u/<user>/books/all", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/import-glose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data?.error || `Échec de l'import (HTTP ${res.status})`, "error");
        return;
      }
      setResult(data);
      // Auto-import selon le type
      await performAutoImport(data, u);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast(`Erreur réseau/timeout: ${msg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Auto import logic used by handleImport
  const performAutoImport = async (data: any, originalUrl: string) => {
    // Profil utilisateur: importer toutes les étagères
    if (data?.type === 'user' && Array.isArray(data.shelves)) {
      try {
        let imported = 0;
        for (const shelf of data.shelves) {
          const s = createShelf(`Glose: ${shelf.name}`, shelf.description);
          const res = await fetch("/api/import-glose", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: `https://glose.com/shelves/${shelf._id}` }),
          });
          const shelfData = await res.json();
          if (res.ok && shelfData.books) {
            shelfData.books.forEach((b: any) => {
              // éviter doublons dans la même étagère
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
        addToast(`${imported} étagères importées depuis ${originalUrl}`, "success");
      } catch (e) {
        addToast("Erreur lors de l'import des étagères du profil", "error");
      }
      return;
    }

    // Étagère unique ou liste de livres
    if (Array.isArray(data?.books) && data.count >= 1) {
      const name = data.shelfId ? `Glose: ${data.shelfId}` : (data.count === 1 ? `Glose — ${data.books[0]?.title || 'Livre'}` : `Glose import`);
      const s = createShelf(name);
      data.books.forEach((b: any) => {
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
      addToast(data.count === 1 ? "Livre importé" : "Étagère importée", "success");
      return;
    }

    addToast("Aucun livre trouvé à importer", "error");
  };

  return (
    <div className="bg-cream-50 p-4 rounded-sm shadow-sm">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Collez l'URL Glose publique (profil, étagère ou livre)"
          className="flex-1 px-3 py-2 border rounded-sm"
        />
        <button
          onClick={handleImport}
          disabled={loading}
          className="px-3 py-2 bg-sepia-800 text-cream-50 rounded-sm"
        >
          {loading ? "Import..." : "Importer"}
        </button>
      </div>
    </div>
  );
}
