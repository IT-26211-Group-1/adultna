"use client";

import { Button, ButtonGroup } from "@heroui/react";

interface ViewTypeProps {
  selectedView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ViewType({ selectedView, onViewChange }: ViewTypeProps) {
  return (
    <ButtonGroup className="bg-gray-100 p-1 rounded-lg" variant="flat">
      <Button
        className={`
                    rounded-md px-4 py-2 text-sm font-medium transition-all
                    ${
                      selectedView === "grid"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }
                `}
        color={selectedView === "grid" ? "primary" : "default"}
        variant={selectedView === "grid" ? "solid" : "light"}
        onPress={() => onViewChange("grid")}
      >
        Grid View
      </Button>
      <Button
        className={`
                    rounded-md px-4 py-2 text-sm font-medium transition-all
                    ${
                      selectedView === "list"
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }
                `}
        color={selectedView === "list" ? "primary" : "default"}
        variant={selectedView === "list" ? "solid" : "light"}
        onPress={() => onViewChange("list")}
      >
        List View
      </Button>
    </ButtonGroup>
  );
}
