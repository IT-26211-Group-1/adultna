import React, { useMemo, memo, useState } from "react";
import { Column, TableProps } from "@/types/table";

export type { Column };

const getAlignmentClass = (align?: "left" | "center" | "right") => {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
};

function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  pagination,
}: TableProps<T>) {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    pagination?.pageSize || pagination?.pageSizeOptions?.[0] || 10
  );

  // Calculate pagination
  const totalItems = memoizedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination?.enabled
    ? memoizedData.slice(startIndex, endIndex)
    : memoizedData;

  // Reset to page 1 when data changes
  useMemo(() => {
    setCurrentPage(1);
  }, [memoizedData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}
    >
      <div className="overflow-auto max-h-[65vh]">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {memoizedColumns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${getAlignmentClass(col.align)}`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {memoizedColumns.map((_, colIndex) => (
                    <td
                      key={`skeleton-${rowIndex}-${colIndex}`}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                const rowKey =
                  typeof row === "object" && row !== null && "id" in row
                    ? (row as any).id
                    : rowIndex;

                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {memoizedColumns.map((col, colIndex) => {
                      const value =
                        typeof col.accessor === "function"
                          ? col.accessor(row)
                          : row[col.accessor];

                      return (
                        <td
                          key={`${rowKey}-${colIndex}`}
                          className={`px-6 py-4 text-sm ${getAlignmentClass(col.align)}`}
                        >
                          {value === null || value === undefined
                            ? "-"
                            : typeof value === "object" &&
                                !React.isValidElement(value)
                              ? JSON.stringify(value)
                              : (value as React.ReactNode)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  className="px-6 py-12 text-center text-gray-500"
                  colSpan={memoizedColumns.length}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination?.enabled && totalItems > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} entries
            </span>
            {pagination.pageSizeOptions && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-adult-green"
                >
                  {pagination.pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {getPageNumbers().map((page, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..." || page === currentPage}
                  className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                    page === currentPage
                      ? "bg-adult-green text-white border-adult-green"
                      : page === "..."
                        ? "border-transparent text-gray-400 cursor-default"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Table) as typeof Table;
