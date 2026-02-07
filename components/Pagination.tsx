'use client';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-sm bg-cream-200 text-sepia-700 hover:bg-sepia-700 hover:text-cream-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cream-200 disabled:hover:text-sepia-700 transition-all duration-300 font-body"
        aria-label="Page précédente"
      >
        Précédent
      </button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sepia-500 font-body"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-4 py-2 rounded-sm font-body transition-all duration-300 ${
                isActive
                  ? 'bg-sepia-800 text-cream-50 shadow-md'
                  : 'bg-cream-100 text-sepia-700 hover:bg-sepia-700 hover:text-cream-50'
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-sm bg-cream-200 text-sepia-700 hover:bg-sepia-700 hover:text-cream-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cream-200 disabled:hover:text-sepia-700 transition-all duration-300 font-body"
        aria-label="Page suivante"
      >
        Suivant
      </button>
    </div>
  );
}
