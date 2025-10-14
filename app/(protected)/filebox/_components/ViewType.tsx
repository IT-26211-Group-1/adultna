"use client";

import { Button, ButtonGroup } from "@heroui/react";
import { useState } from "react";

export function ViewType() {
    // State to track selected view type default view is grid
    const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");

    return (
        <ButtonGroup 
            variant="flat"
            className="bg-gray-100 p-1 rounded-lg"
        >
            <Button 
                variant={selectedView === "grid" ? "solid" : "light"}
                color={selectedView === "grid" ? "primary" : "default"}
                className={`
                    rounded-md px-4 py-2 text-sm font-medium transition-all
                    ${selectedView === "grid" 
                        ? "bg-white shadow-sm text-gray-900" 
                        : "text-gray-600 hover:text-gray-900"
                    }
                `}
                onPress={() => setSelectedView("grid")}
            >
                Grid View
            </Button>
            <Button 
                variant={selectedView === "list" ? "solid" : "light"}
                color={selectedView === "list" ? "primary" : "default"}
                className={`
                    rounded-md px-4 py-2 text-sm font-medium transition-all
                    ${selectedView === "list" 
                        ? "bg-white shadow-sm text-gray-900" 
                        : "text-gray-600 hover:text-gray-900"
                    }
                `}
                onPress={() => setSelectedView("list")}
            >
                List View
            </Button>
        </ButtonGroup>
    );
}