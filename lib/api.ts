import type { BookshelvesResponse, FormListResponse, FormResponse } from '@/types/api';

const API_BASE_URL = 'https://api.glose.com';
const USER_ID = '5a8411b53ed02c04187ff02a';

export class GloseAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'GloseAPIError';
  }
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new GloseAPIError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof GloseAPIError) {
      throw error;
    }
    throw new GloseAPIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getBookshelves(
  userId: string = USER_ID,
  offset: number = 0,
  limit: number = 20
): Promise<BookshelvesResponse> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  
  return fetchAPI<BookshelvesResponse>(
    `/users/${userId}/shelves?${params}`
  );
}

export async function getShelfForms(
  shelfId: string,
  offset: number = 0,
  limit: number = 20
): Promise<FormListResponse> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });
  
  return fetchAPI<FormListResponse>(
    `/shelves/${shelfId}/forms?${params}`
  );
}

export async function getFormById(formId: string): Promise<FormResponse> {
  return fetchAPI<FormResponse>(`/forms/${formId}`);
}

export async function getMultipleForms(formIds: string[]): Promise<FormResponse[]> {
  const promises = formIds.map(id => getFormById(id));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<FormResponse> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value);
}

export async function searchForms(
  shelfId: string,
  query: string,
  offset: number = 0,
  limit: number = 20
): Promise<FormResponse[]> {
  const formListResponse = await getShelfForms(shelfId, offset, limit);
  const forms = await getMultipleForms(formListResponse.data);
  
  const lowerQuery = query.toLowerCase();
  
  return forms.filter(formResponse => {
    const form = formResponse.data;
    const titleMatch = form.title?.toLowerCase().includes(lowerQuery);
    const authorMatch = form.authors?.some(author => 
      author.name.toLowerCase().includes(lowerQuery)
    );
    
    return titleMatch || authorMatch;
  });
}
