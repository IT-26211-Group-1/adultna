"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-1 text-sm ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          {item.current || !item.href ? (
            <span aria-current="page" className="text-gray-900 font-medium">
              {item.label}
            </span>
          ) : (
            <Link
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              href={item.href}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
