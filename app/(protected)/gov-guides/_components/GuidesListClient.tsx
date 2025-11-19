"use client";

import { useState, useMemo } from "react";
import { useGovGuides } from "@/hooks/queries/useGovGuidesQueries";
import { GuideCategory } from "@/types/govguide";
import GuideCard from "./GuideCard";
import GuideSearch from "./GuideSearch";
import CategoryFilter from "./CategoryFilter";
import GuidePagination from "./GuidePagination";
import GuidesLoadingSkeleton from "./GuidesLoadingSkeleton";

const GUIDES_PER_PAGE = 10;

export default function GuidesListClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { guides, isLoading, error } = useGovGuides({ status: "accepted" });

  const filteredGuides = useMemo(() => {
    if (!guides) return [];

    return guides.filter((guide) => {
      const matchesSearch =
        searchQuery === "" ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.summary?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || guide.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [guides, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredGuides.length / GUIDES_PER_PAGE);

  const paginatedGuides = useMemo(() => {
    const startIndex = (currentPage - 1) * GUIDES_PER_PAGE;
    const endIndex = startIndex + GUIDES_PER_PAGE;
    return filteredGuides.slice(startIndex, endIndex);
  }, [filteredGuides, currentPage]);

  const handleCategoryChange = (category: GuideCategory | "all") => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <GuideSearch value={searchQuery} onChange={handleSearchChange} />
        </div>
        <CategoryFilter value={selectedCategory} onChange={handleCategoryChange} />
      </div>

      {isLoading && <GuidesLoadingSkeleton />}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Failed to load guides. Please try again later.
        </div>
      )}

      {!isLoading && !error && paginatedGuides.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== "all"
              ? "No guides found matching your criteria."
              : "No guides available at the moment."}
          </p>
        </div>
      )}

      {!isLoading && !error && paginatedGuides.length > 0 && (
        <>
          <div className="space-y-4">
            {paginatedGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>

          <GuidePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </>
  );
}
