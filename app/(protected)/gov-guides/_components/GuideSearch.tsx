"use client";

import { Input } from "@heroui/input";
import { Search } from "lucide-react";

type GuideSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function GuideSearch({ value, onChange }: GuideSearchProps) {
  return (
    <Input
      disableAnimation
      classNames={{
        base: "max-w-full",
        inputWrapper: "h-12 border border-gray-300 hover:border-adult-green",
      }}
      placeholder="Search government processes"
      startContent={<Search className="w-4 h-4 text-gray-400" />}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
