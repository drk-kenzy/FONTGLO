export interface Bookshelf {
  _id: string;
  name: string;
  description?: string;
  formsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookshelvesResponse {
  data: Bookshelf[];
  metadata: {
    count: number;
    offset: number;
    limit: number;
  };
}

export interface FormListResponse {
  data: string[];
  metadata: {
    count: number;
    offset: number;
    limit: number;
  };
}

export interface Author {
  name: string;
}

export interface Form {
  _id: string;
  title: string;
  subtitle?: string;
  authors?: Author[];
  cover?: string;
  price?: {
    amount: number;
    currency: string;
  };
  averageRating?: number;
  ratingsCount?: number;
  description?: string;
  publisher?: string;
  publishedDate?: string;
  isbn?: string;
}

export interface FormResponse {
  data: Form;
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  authors?: string[];
  coverId?: number;
  firstPublishYear?: number;
  isbn?: string[];
}

export interface LocalBook {
  id: string;
  title: string;
  authors?: string[];
  cover?: string | null;
  source?: string;
  meta?: any;
}

export interface LocalShelf {
  id: string;
  name: string;
  description?: string;
  books: LocalBook[];
  createdAt: string;
}

export interface WorkDetails {
  key: string; // e.g. "/works/OL123W"
  title: string;
  description?: string | { value?: string };
  subjects?: string[];
  subject_places?: string[];
  subject_people?: string[];
  covers?: number[];
  links?: any[];
  first_publish_date?: string;
  authors?: Array<{ author?: { key?: string; name?: string } }>;
}

export interface Edition {
  key: string;
  title: string;
  publishers?: string[];
  publish_date?: string;
  number_of_pages?: number;
  languages?: Array<{ key: string }> | string[];
  isbn_10?: string[];
  isbn_13?: string[];
  cover_i?: number;
}
