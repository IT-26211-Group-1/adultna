"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
  onClick?: () => void;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-1 text-sm overflow-x-auto scrollbar-hide ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          )}
          {item.current ? (
            <span
              aria-current="page"
              className="text-gray-900 font-medium whitespace-nowrap"
            >
              {item.label}
            </span>
          ) : item.onClick ? (
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ) : item.href ? (
            <Link
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
              href={item.href}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium whitespace-nowrap">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
