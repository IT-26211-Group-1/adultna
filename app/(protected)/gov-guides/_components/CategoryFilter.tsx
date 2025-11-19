"use client";

import { GuideCategory } from "@/types/govguide";
import { Select, SelectItem } from "@heroui/select";

type CategoryFilterProps = {
  value: GuideCategory | "all";
  onChange: (value: GuideCategory | "all") => void;
};

const CATEGORY_LABELS: Record<GuideCategory | "all", string> = {
  all: "All Categories",
  identification: "Government IDs",
  "civil-registration": "Civil Registration",
  "permits-licenses": "Permits & Licenses",
  "social-services": "Social Services",
  "tax-related": "Tax-Related",
  legal: "Legal Documents",
  other: "Other",
};

export default function CategoryFilter({
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <Select
      disableAnimation
      classNames={{
        base: "w-full md:w-64",
        trigger: "h-12 border border-gray-300 hover:border-adult-green",
      }}
      label="Category"
      selectedKeys={[value]}
      onChange={(e) => onChange(e.target.value as GuideCategory | "all")}
    >
      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
        <SelectItem key={key}>{label}</SelectItem>
      ))}
    </Select>
  );
}
