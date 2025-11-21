"use client";

import { Pagination } from "@heroui/pagination";

type GuidePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function GuidePagination({
  currentPage,
  totalPages,
  onPageChange,
}: GuidePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8">
      <Pagination
        disableAnimation
        showControls
        classNames={{
          cursor: "bg-adult-green text-white",
        }}
        page={currentPage}
        total={totalPages}
        onChange={onPageChange}
      />
    </div>
  );
}
