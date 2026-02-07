import { formatPrice, getAuthorNames, truncateText, formatRating, getBookCoverUrl } from '@/lib/utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price with currency', () => {
      expect(formatPrice(19.99, 'USD')).toContain('19,99');
    });

    it('should return empty string for undefined amount', () => {
      expect(formatPrice(undefined)).toBe('');
    });

    it('should handle null amount', () => {
      expect(formatPrice(null as any)).toBe('');
    });
  });

  describe('getAuthorNames', () => {
    it('should return comma-separated author names', () => {
      const authors = [
        { name: 'John Doe' },
        { name: 'Jane Smith' },
      ];
      expect(getAuthorNames(authors)).toBe('John Doe, Jane Smith');
    });

    it('should return empty string for no authors', () => {
      expect(getAuthorNames([])).toBe('');
      expect(getAuthorNames(undefined)).toBe('');
    });

    it('should handle single author', () => {
      expect(getAuthorNames([{ name: 'Solo Author' }])).toBe('Solo Author');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(truncateText(text, 20)).toBe('This is a very long...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exact';
      expect(truncateText(text, 5)).toBe('Exact');
    });
  });

  describe('formatRating', () => {
    it('should format rating to 1 decimal', () => {
      expect(formatRating(4.567)).toBe('4.6');
      expect(formatRating(3.2)).toBe('3.2');
    });

    it('should return empty string for no rating', () => {
      expect(formatRating(undefined)).toBe('');
      expect(formatRating(0)).toBe('');
    });
  });

  describe('getBookCoverUrl', () => {
    it('should return full URL if cover starts with http', () => {
      const url = 'https://example.com/cover.jpg';
      expect(getBookCoverUrl(url)).toBe(url);
    });

    it('should prepend Google Storage URL for relative paths', () => {
      const cover = 'book-cover.jpg';
      expect(getBookCoverUrl(cover)).toBe(
        'https://storage.googleapis.com/glose-cover-images/book-cover.jpg'
      );
    });

    it('should return placeholder for no cover', () => {
      expect(getBookCoverUrl(undefined)).toBe('/placeholder-book.svg');
      expect(getBookCoverUrl('')).toBe('/placeholder-book.svg');
    });
  });
});
