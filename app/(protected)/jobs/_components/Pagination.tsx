"use client";

import { memo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
  }: PaginationProps) => {

    if (totalPages < 1) return null;

    const getVisiblePages = () => {
      const pages = [];
      const showPages = 5; 

      let start = Math.max(1, currentPage - Math.floor(showPages / 2));
      let end = Math.min(totalPages, start + showPages - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    };

    const visiblePages = getVisiblePages();

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-end gap-2 py-6">
     
          <button
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
           
            {visiblePages[0] > 1 && (
              <>
                <button
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  disabled={isLoading}
                  onClick={() => onPageChange(1)}
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className="px-2 py-2 text-gray-400">...</span>
                )}
              </>
            )}

            {visiblePages.map((page) => (
              <button
                key={page}
                className={`px-3 py-2 text-sm border rounded transition-colors disabled:opacity-50 ${
                  page === currentPage
                    ? "bg-[#11553F] text-white border-[#11553F]"
                    : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isLoading}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ))}

            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-2 py-2 text-gray-400">...</span>
                )}
                <button
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  disabled={isLoading}
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
