export function formatPrice(amount?: number, currency: string = 'USD'): string {
  if (amount === undefined || amount === null) {
    return '';
  }
  
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function getAuthorNames(authors?: { name: string }[]): string {
  if (!authors || authors.length === 0) {
    return '';
  }
  
  return authors.map(a => a.name).join(', ');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength).trim() + '...';
}

export function formatRating(rating?: number): string {
  if (!rating) return '';
  return rating.toFixed(1);
}

export function getBookCoverUrl(cover?: string): string {
  if (!cover) {
    return '/placeholder-book.svg';
  }
  
  if (cover.startsWith('http')) {
    return cover;
  }
  
  return `https://storage.googleapis.com/glose-cover-images/${cover}`;
}
