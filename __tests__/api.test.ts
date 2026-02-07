import { getBookshelves, getShelfForms, getFormById, getMultipleForms, GloseAPIError } from '@/lib/api';

global.fetch = jest.fn();

describe('Glose API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBookshelves', () => {
    it('should fetch bookshelves successfully', async () => {
      const mockData = {
        data: [
          { _id: '1', name: 'My Shelf', formsCount: 5 },
        ],
        metadata: { count: 1, offset: 0, limit: 20 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getBookshelves(0, 20);

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/5a8411b53ed02c04187ff02a/shelves'),
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getBookshelves()).rejects.toThrow(GloseAPIError);
    });
  });

  describe('getShelfForms', () => {
    it('should fetch shelf forms successfully', async () => {
      const mockData = {
        data: ['form1', 'form2', 'form3'],
        metadata: { count: 3, offset: 0, limit: 20 },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getShelfForms('shelf123');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/shelves/shelf123/forms'),
        expect.any(Object)
      );
    });
  });

  describe('getFormById', () => {
    it('should fetch form details successfully', async () => {
      const mockData = {
        data: {
          _id: 'form1',
          title: 'Test Book',
          authors: [{ name: 'Test Author' }],
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getFormById('form1');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/forms/form1'),
        expect.any(Object)
      );
    });
  });

  describe('getMultipleForms', () => {
    it('should fetch multiple forms and filter out failures', async () => {
      const mockForm1 = { data: { _id: '1', title: 'Book 1' } };
      const mockForm2 = { data: { _id: '2', title: 'Book 2' } };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForm1,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockForm2,
        });

      const result = await getMultipleForms(['1', '2', '3']);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockForm1);
      expect(result[1]).toEqual(mockForm2);
    });
  });
});
