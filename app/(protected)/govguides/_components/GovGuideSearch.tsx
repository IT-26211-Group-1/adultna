import React from "react";

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";

type SortKey = "title-asc" | "title-desc" | "duration-asc" | "duration-desc";

type GovGuideSearchProps = {
    onSearch: (query: string) => void;
    onSortChange?: (sort: SortKey) => void;
};


    
export function GovGuideSearch({ onSearch, onSortChange }: GovGuideSearchProps) {
    return (
        <section className="w-full mb-5">
            <div className="flex items-center gap-2 sm:gap-3 w-full">
                {/* Search input with icon */}
                <div className="relative flex-1">
                    <input
                        className="w-full border-2 rounded-md px-3 py-2 pl-10"
                        placeholder="Search Government Processes..."
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ultra-violet">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="#595880"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line
                                strokeLinecap="round"
                                strokeWidth="2"
                                x1="21"
                                x2="16.65"
                                y1="21"
                                y2="16.65"
                            />
                        </svg>
                    </span>
                </div>

                {/* Sort dropdown */}
                <div className="shrink-0">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="bordered">
                                Sort
                                <svg
                                    className="lucide lucide-arrow-down-up-icon lucide-arrow-down-up"
                                    fill="none"
                                    height="18"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                    width="18"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="m3 16 4 4 4-4" />
                                    <path d="M7 20V4" />
                                    <path d="m21 8-4-4-4 4" />
                                    <path d="M17 4v16" />
                                </svg>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Sort results"
                            onAction={(key) => {
                                const k = String(key) as SortKey;
                                // Map legacy keys if needed
                                const mapped: Record<string, SortKey> = {
                                    "title-asc": "title-asc",
                                    "title-desc": "title-desc",
                                    "duration-asc": "duration-asc",
                                    "duration-desc": "duration-desc",
                                };
                                const next = mapped[k] ?? ("title-asc" as SortKey);

                                onSortChange?.(next);
                            }}
                        >
                            <DropdownItem key="title-asc">Title A-Z</DropdownItem>
                            <DropdownItem key="title-desc">Title Z-A</DropdownItem>
                            <DropdownItem key="duration-asc">Duration: Shortest first</DropdownItem>
                            <DropdownItem key="duration-desc">Duration: Longest first</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </section>
    );
}