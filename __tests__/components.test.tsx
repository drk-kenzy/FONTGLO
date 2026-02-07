import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '@/components/BookCard';
import ShelfCard from '@/components/ShelfCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';

describe('Components', () => {
  describe('BookCard', () => {
    const mockForm = {
      _id: '1',
      title: 'Test Book',
      authors: [{ name: 'Test Author' }],
      price: { amount: 19.99, currency: 'EUR' },
      averageRating: 4.5,
      cover: 'test-cover.jpg',
    };

    it('should render book information', () => {
      render(<BookCard form={mockForm} />);
      
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('should render without optional fields', () => {
      const minimalForm = {
        _id: '1',
        title: 'Minimal Book',
      };

      render(<BookCard form={minimalForm} />);
      expect(screen.getByText('Minimal Book')).toBeInTheDocument();
    });
  });

  describe('ShelfCard', () => {
    const mockShelf = {
      _id: '1',
      name: 'My Bookshelf',
      description: 'A great collection',
      formsCount: 10,
    };

    it('should render shelf information', () => {
      render(<ShelfCard shelf={mockShelf} />);
      
      expect(screen.getByText('My Bookshelf')).toBeInTheDocument();
      expect(screen.getByText('A great collection')).toBeInTheDocument();
      expect(screen.getByText(/10 livres/)).toBeInTheDocument();
    });

    it('should render link to shelf detail', () => {
      render(<ShelfCard shelf={mockShelf} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/shelf/1');
    });
  });

  describe('Pagination', () => {
    const mockOnPageChange = jest.fn();

    beforeEach(() => {
      mockOnPageChange.mockClear();
    });

    it('should render page numbers', () => {
      render(
        <Pagination
          currentPage={1}
          totalItems={100}
          itemsPerPage={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should call onPageChange when clicking next', () => {
      render(
        <Pagination
          currentPage={1}
          totalItems={100}
          itemsPerPage={10}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Suivant');
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should disable previous on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalItems={100}
          itemsPerPage={10}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByText('Précédent');
      expect(prevButton).toBeDisabled();
    });

    it('should not render with single page', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalItems={5}
          itemsPerPage={10}
          onPageChange={mockOnPageChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('SearchBar', () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
      mockOnSearch.mockClear();
    });

    it('should render search input', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Rechercher...');
      expect(input).toBeInTheDocument();
    });

    it('should call onSearch on form submit', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Rechercher...');
      const form = input.closest('form');

      fireEvent.change(input, { target: { value: 'test query' } });
      fireEvent.submit(form!);

      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('should clear search when clicking clear button', () => {
      render(<SearchBar onSearch={mockOnSearch} />);
      
      const input = screen.getByPlaceholderText('Rechercher...');
      fireEvent.change(input, { target: { value: 'test' } });

      const clearButton = screen.getByLabelText('Effacer la recherche');
      fireEvent.click(clearButton);

      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });
});
