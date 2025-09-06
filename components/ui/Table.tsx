import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className="bg-white rounded shadow p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {columns.map((col, idx) => (
              <th key={idx} className="text-left py-2">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length
            ? data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b hover:bg-gray-50">
                  {columns.map((col, colIndex) => {
                    const value =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : row[col.accessor];

                    return (
                      <td key={colIndex} className="py-2">
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
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
