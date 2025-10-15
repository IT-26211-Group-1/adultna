"use client";
import { Input } from "@heroui/react";
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
    searchTerm: string;
    onSearchChange: (searchTerm: string) => void;
}

export function Search({ searchTerm, onSearchChange }: SearchProps) {
    return (
        <Input
            placeholder="Search documents"
            startContent={<SearchIcon className="w-4 h-4 text-gray-400" />}
            className="w-full"
            value={searchTerm}
            onValueChange={onSearchChange}
            classNames={{
                input: "text-gray-700 font-medium",
            }}
        />
    );
}