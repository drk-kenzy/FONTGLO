let uuidv4: () => string;
try {
  // Try to require uuid (may be ESM in some environments); fallback to simple generator
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const u = require('uuid');
  uuidv4 = (u && (u.v4 || u.default?.v4)) || (() => Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
} catch (err) {
  uuidv4 = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export interface LocalBook {
  id: string; // unique id for the stored book
  title: string;
  authors?: string[];
  cover?: string | null;
  source?: "openlibrary" | "glose" | string;
  meta?: any;
}

export interface LocalShelf {
  id: string;
  name: string;
  description?: string;
  books: LocalBook[];
  createdAt: string;
}

const STORAGE_KEY = "local_shelves_v1";

function readStorage(): LocalShelf[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalShelf[];
  } catch {
    return [];
  }
}

function writeStorage(shelves: LocalShelf[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
}

export function getShelves(): LocalShelf[] {
  return readStorage();
}

export function createShelf(name: string, description?: string) {
  const shelves = readStorage();
  const newShelf: LocalShelf = {
    id: uuidv4(),
    name,
    description,
    books: [],
    createdAt: new Date().toISOString(),
  };
  shelves.unshift(newShelf);
  writeStorage(shelves);
  return newShelf;
}

export function deleteShelf(id: string) {
  const shelves = readStorage().filter((s) => s.id !== id);
  writeStorage(shelves);
}

export function addBookToShelf(shelfId: string, book: Omit<LocalBook, "id">) {
  const shelves = readStorage();
  const shelf = shelves.find((s) => s.id === shelfId);
  if (!shelf) throw new Error("Shelf not found");

  const bookId = uuidv4();
  shelf.books.unshift({ ...book, id: bookId });
  writeStorage(shelves);
  return bookId;
}

export function removeBookFromShelf(shelfId: string, bookId: string) {
  const shelves = readStorage();
  const shelf = shelves.find((s) => s.id === shelfId);
  if (!shelf) throw new Error("Shelf not found");
  shelf.books = shelf.books.filter((b) => b.id !== bookId);
  writeStorage(shelves);
}

export function getShelfBooks(shelfId: string) {
  const shelf = readStorage().find((s) => s.id === shelfId);
  return shelf ? shelf.books : [];
}
