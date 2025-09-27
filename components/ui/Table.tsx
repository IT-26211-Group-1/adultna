import React, { useMemo, memo } from "react";
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
}: TableProps<T>) {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
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
            {memoizedData.length > 0 ? (
              memoizedData.map((row, rowIndex) => {
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
                          className={`px-6 py-4 whitespace-nowrap text-sm ${getAlignmentClass(col.align)}`}
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
    </div>
  );
}

export default memo(Table) as typeof Table;
