"use client";

import { Select, SelectItem } from "@heroui/react";

interface CategoriesUploadProps {
  placeholder?: string;
  className?: string;
  onSelectionChange?: (category: string) => void;
  selectedCategory?: string;
  id?: string;
}

export function CategoriesUpload({
  placeholder = "Select Category",
  className = "w-full",
  onSelectionChange,
  selectedCategory,
  id,
}: CategoriesUploadProps = {}) {
  // Map category keys to display names for filtering
  const categoryKeyMap: Record<string, string> = {
    "01": "Government Documents",
    "02": "Education",
    "03": "Career",
    "04": "Medical",
    "05": "Personal",
  };

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;

    if (onSelectionChange && selectedKey) {
      const categoryName = categoryKeyMap[selectedKey];

      onSelectionChange(categoryName);
    }
  };

  return (
    <Select
      className={className}
      classNames={{
        trigger:
          "bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-colors h-12",
        value: "text-gray-900 text-sm",
        label: "text-gray-700 text-sm",
        popoverContent: "bg-white border border-gray-200 rounded-xl shadow-lg",
        listbox: "p-1",
      }}
      id={id}
      placeholder={placeholder}
      selectedKeys={
        Object.entries(categoryKeyMap).find(
          ([_, name]) => name === selectedCategory,
        )?.[0]
          ? [
              Object.entries(categoryKeyMap).find(
                ([_, name]) => name === selectedCategory,
              )![0],
            ]
          : undefined
      }
      size="lg"
      variant="bordered"
      onSelectionChange={handleSelectionChange}
    >
      <SelectItem
        key="01"
        className="rounded-lg hover:bg-gray-50 data-[hover=true]:bg-gray-50 data-[focus=true]:bg-gray-50 py-2"
        textValue="Government Documents"
      >
        Government Documents
      </SelectItem>
      <SelectItem
        key="02"
        className="rounded-lg hover:bg-gray-50 data-[hover=true]:bg-gray-50 data-[focus=true]:bg-gray-50 py-2"
        textValue="Education"
      >
        Education
      </SelectItem>
      <SelectItem
        key="03"
        className="rounded-lg hover:bg-gray-50 data-[hover=true]:bg-gray-50 data-[focus=true]:bg-gray-50 py-2"
        textValue="Career"
      >
        Career
      </SelectItem>
      <SelectItem
        key="04"
        className="rounded-lg hover:bg-gray-50 data-[hover=true]:bg-gray-50 data-[focus=true]:bg-gray-50 py-2"
        textValue="Medical"
      >
        Medical
      </SelectItem>
      <SelectItem
        key="05"
        className="rounded-lg hover:bg-gray-50 data-[hover=true]:bg-gray-50 data-[focus=true]:bg-gray-50 py-2"
        textValue="Personal"
      >
        Personal
      </SelectItem>
    </Select>
  );
}
