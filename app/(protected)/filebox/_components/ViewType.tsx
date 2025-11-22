"use client";

import { Button, ButtonGroup } from "@heroui/react";
import { Grid3X3Icon, ListIcon } from "lucide-react";

type ViewTypeProps = {
  selectedView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
};

export function ViewType({ selectedView, onViewChange }: ViewTypeProps) {
  return (
    <ButtonGroup className="bg-gray-100 p-0.5 rounded-md" variant="flat">
      <Button
        className={`
                    rounded-sm px-1.5 py-1.5 text-sm font-medium transition-all
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
        <Grid3X3Icon size={20} />
      </Button>
      <Button
        className={`
                    rounded-sm px-1.5 py-1.5 text-sm font-medium transition-all
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
        <ListIcon size={20} />
      </Button>
    </ButtonGroup>
  );
}
