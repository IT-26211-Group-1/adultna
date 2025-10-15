"use client"

import {Select, SelectItem} from "@heroui/react";

interface CategoriesProps {
    includeAllCategories?: boolean;
    placeholder?: string;
    className?: string;
    onSelectionChange?: (category: string) => void;
    selectedCategory?: string;
}

export function Categories({ 
    includeAllCategories = true, 
    placeholder = "Select Category",
    className = "w-full md:w-48",
    onSelectionChange,
    selectedCategory
}: CategoriesProps = {}){
    // If includeAllCategories is true, add "All Categories" option at the top
    // Used to differentiate between the filtering of the search results and just selecting a category for the file upload
    const defaultKeys = includeAllCategories ? ["all"] : undefined;
    const displayPlaceholder = includeAllCategories ? "All Categories" : placeholder;

    // Map category keys to display names for filtering
    const categoryKeyMap: Record<string, string> = {
        "all": "All Categories",
        "01": "Government Documents", 
        "02": "Education",
        "03": "Career",
        "04": "Medical",
        "05": "Personal"
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
            placeholder={displayPlaceholder}
            defaultSelectedKeys={defaultKeys}
            selectedKeys={selectedCategory === "all" ? ["all"] : Object.entries(categoryKeyMap).find(([_, name]) => name === selectedCategory)?.[0] ? [Object.entries(categoryKeyMap).find(([_, name]) => name === selectedCategory)![0]] : undefined}
            onSelectionChange={handleSelectionChange}
            className={className}
            classNames={{
                trigger: "bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300",
                value: "text-gray-700 font-medium",
                popoverContent: "bg-white border border-gray-200 rounded-lg shadow-lg",
                listbox: "p-2"
            }}
        >
            {includeAllCategories ? (
                <SelectItem key="all" textValue="All Categories" className="rounded-md">
                    All Categories
                </SelectItem>
            ) : null}
            <SelectItem key="01" textValue="Government Documents" className="rounded-md">
                Government Documents
            </SelectItem>
            <SelectItem key="02" textValue="Education" className="rounded-md">
                Education
            </SelectItem>
            <SelectItem key="03" textValue="Career" className="rounded-md">
                Career
            </SelectItem>
            <SelectItem key="04" textValue="Medical" className="rounded-md">
                Medical
            </SelectItem>
            <SelectItem key="05" textValue="Personal" className="rounded-md">
                Personal
            </SelectItem>
        </Select>
    )
}