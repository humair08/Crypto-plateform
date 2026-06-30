'use client';

import React from 'react';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  striped?: boolean;
  hoverable?: boolean;
}

export function Table<T = Record<string, unknown>>({
  columns,
  data,
  striped = true,
  hoverable = true,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50 bg-secondary/30">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-sm font-semibold text-white"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-b border-border/50 transition-colors ${
                striped && rowIndex % 2 === 1 ? 'bg-secondary/20' : ''
              } ${hoverable ? 'hover:bg-secondary/40' : ''}`}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className="px-6 py-4 text-sm text-white"
                >
                  {column.render
                    ? column.render(row[column.key as keyof T], row)
                    : String(row[column.key as keyof T]) ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="p-8 text-center text-white/60">
          No data available
        </div>
      )}
    </div>
  );
}
