export interface OpenLibraryDoc {
  key: string; // e.g. "/works/OL123W"
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  isbn?: string[];
}

export async function searchOpenLibrary(query: string, page: number = 1, limit: number = 20) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
  });

  const url = `https://openlibrary.org/search.json?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`OpenLibrary search failed: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    numFound: data.numFound as number,
    docs: (data.docs as OpenLibraryDoc[]).slice(0, limit),
  };
}

export function getOpenLibraryCoverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M') {
  if (!coverId) return '/placeholder-book.svg';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export async function getWorkDetails(id: string) {
  const res = await fetch(`https://openlibrary.org/works/${id}.json`);
  if (!res.ok) throw new Error('OpenLibrary work fetch failed');
  const data = await res.json();
  return data;
}

export async function getWorkEditions(id: string, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  const res = await fetch(`https://openlibrary.org/works/${id}/editions.json?${params}`);
  if (!res.ok) throw new Error('OpenLibrary editions fetch failed');
  const data = await res.json();
  return { entries: data.entries || [], size: data.size || 0 };
}
