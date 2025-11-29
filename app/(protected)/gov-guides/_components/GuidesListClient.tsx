"use client";

import { useState, useMemo } from "react";
import { useGovGuides } from "@/hooks/queries/useGovGuidesQueries";
import { useLanguage } from "@/contexts/LanguageContext";
import { GuideCategory } from "@/types/govguide";
import GuideCard from "./GuideCard";
import GuideSearch from "./GuideSearch";
import GuidePagination from "./GuidePagination";
import GuidesLoadingSkeleton from "./GuidesLoadingSkeleton";

const GUIDES_PER_PAGE = 10;

export default function GuidesListClient() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    GuideCategory | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { guides, isLoading, error } = useGovGuides({ status: "accepted" });

  console.log("GuidesListClient - Current language:", language);

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
      <GuideSearch
        searchValue={searchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
      />

      {isLoading && <GuidesLoadingSkeleton />}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {t("common.error")}
        </div>
      )}

      {!isLoading && !error && paginatedGuides.length === 0 && (
        <div className="text-center">
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== "all"
              ? t("guides.noResults")
              : t("guides.noGuides")}
          </p>
        </div>
      )}

      {!isLoading && !error && paginatedGuides.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
