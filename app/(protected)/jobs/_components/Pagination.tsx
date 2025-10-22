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
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
           
            {visiblePages[0] > 1 && (
              <>
                <button
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  disabled={isLoading}
                  onClick={() => onPageChange(1)}
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                )}
              </>
            )}

            {visiblePages.map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center text-sm border rounded-full transition-colors disabled:opacity-50 ${
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
                  <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                )}
                <button
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  disabled={isLoading}
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={currentPage === totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
