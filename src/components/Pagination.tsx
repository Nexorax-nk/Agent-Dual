'use client';

import Link from 'next/link';

export function Pagination({ totalPages, currentPage, basePath }: { totalPages: number, currentPage: number, basePath: string }) {
  const getPages = () => {
    let pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      {currentPage > 1 && (
        <Link 
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 font-medium"
        >
          Previous
        </Link>
      )}
      
      {getPages().map((page, index) => {
        if (page === '...') {
          return <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>;
        }
        
        const isCurrent = page === currentPage;
        return (
          <Link
            key={`page-${page}`}
            href={`${basePath}?page=${page}`}
            className={`px-4 py-2 border rounded-md font-medium transition-colors ${
              isCurrent 
                ? 'bg-orange-50 text-orange-600 border-orange-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link 
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 font-medium"
        >
          Next
        </Link>
      )}
    </div>
  );
}
