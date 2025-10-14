"use client";
import { Input } from "@heroui/react";
import { Search as SearchIcon } from 'lucide-react';

export function Search() {
    return (
        <Input
            placeholder="Search documents"
            startContent={<SearchIcon className="w-4 h-4 text-gray-400" />}
            className="w-full md:w-48"
            classNames={{
                input: "text-gray-700 font-medium",
            }}
        />
    );
}