"use client";

import { Select, SelectItem } from "@heroui/react";

interface CategoriesProps {
  includeAllCategories?: boolean;
  placeholder?: string;
  className?: string;
  onSelectionChange?: (category: string) => void;
  selectedCategory?: string;
  id?: string;
}

export function Categories({
  includeAllCategories = true,
  placeholder = "Select Category",
  className = "w-full md:w-48",
  onSelectionChange,
  selectedCategory,
  id,
}: CategoriesProps = {}) {
  // If includeAllCategories is true, add "All Categories" option at the top
  // Used to differentiate between the filtering of the search results and just selecting a category for the file upload
  const defaultKeys = includeAllCategories ? ["all"] : undefined;
  const displayPlaceholder = includeAllCategories
    ? "All Categories"
    : placeholder;

  // Map category keys to display names for filtering
  const categoryKeyMap: Record<string, string> = {
    all: "All Categories",
    "01": "Government Documents",
    "02": "Education",
    "03": "Career",
    "04": "Medical",
    "05": "Personal",
  };

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;

    if (onSelectionChange && selectedKey) {
      // Convert key to category name for filtering
      if (selectedKey === "all") {
        onSelectionChange("all");
      } else {
        const categoryName = categoryKeyMap[selectedKey];

        onSelectionChange(categoryName);
      }
    }
  };

  return (
    <Select
      className={className}
      classNames={{
        trigger:
          "bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300",
        value: "text-gray-700 font-medium",
        popoverContent: "bg-white border border-gray-200 rounded-lg shadow-lg",
        listbox: "p-2",
      }}
      defaultSelectedKeys={defaultKeys}
      id={id}
      placeholder={displayPlaceholder}
      selectedKeys={
        selectedCategory === "all"
          ? ["all"]
          : Object.entries(categoryKeyMap).find(
                ([_, name]) => name === selectedCategory,
              )?.[0]
            ? [
                Object.entries(categoryKeyMap).find(
                  ([_, name]) => name === selectedCategory,
                )![0],
              ]
            : undefined
      }
      onSelectionChange={handleSelectionChange}
    >
      {includeAllCategories ? (
        <SelectItem key="all" className="rounded-md" textValue="All Categories">
          All Categories
        </SelectItem>
      ) : null}
      <SelectItem
        key="01"
        className="rounded-md"
        textValue="Government Documents"
      >
        Government Documents
      </SelectItem>
      <SelectItem key="02" className="rounded-md" textValue="Education">
        Education
      </SelectItem>
      <SelectItem key="03" className="rounded-md" textValue="Career">
        Career
      </SelectItem>
      <SelectItem key="04" className="rounded-md" textValue="Medical">
        Medical
      </SelectItem>
      <SelectItem key="05" className="rounded-md" textValue="Personal">
        Personal
      </SelectItem>
    </Select>
  );
}
