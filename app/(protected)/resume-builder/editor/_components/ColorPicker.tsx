import { Button, Input } from "@heroui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { PaletteIcon } from "lucide-react";
import { useState } from "react";

interface ColorPickerProps {
  color: string | undefined;
  onChange: (color: { hex: string }) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [showPopover, setShowPopover] = useState(false);
  const [customHex, setCustomHex] = useState(color || "#000000");

  const colors = [
    "#000000",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#00D2D3",
  ];

  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const handleCustomColorChange = (value: string) => {
    setCustomHex(value);
    if (isValidHex(value)) {
      onChange({ hex: value });
    }
  };

  return (
    <Popover
      isOpen={showPopover}
      placement="bottom-end"
      onOpenChange={setShowPopover}
    >
      <PopoverTrigger>
        <Button
          isIconOnly
          aria-label="Change resume color"
          variant="bordered"
          onPress={() => setShowPopover(true)}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4">
        <div className="space-y-4">
          {/* Preset Colors */}
          <div>
            <p className="text-sm font-medium mb-2">Preset Colors</p>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                    color === colorOption
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => {
                    onChange({ hex: colorOption });
                    setCustomHex(colorOption);
                    setShowPopover(false);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Custom Hex Input */}
          <div>
            <p className="text-sm font-medium mb-2">Custom Color</p>
            <div className="flex gap-2 items-center">
              <Input
                className="flex-1"
                errorMessage={
                  customHex !== "" && !isValidHex(customHex)
                    ? "Invalid hex color"
                    : ""
                }
                isInvalid={customHex !== "" && !isValidHex(customHex)}
                placeholder="#000000"
                size="sm"
                startContent={
                  <div
                    className="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                    style={{
                      backgroundColor: isValidHex(customHex)
                        ? customHex
                        : "transparent",
                    }}
                  />
                }
                value={customHex}
                onChange={(e) => handleCustomColorChange(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter a hex color code (e.g., #FF5733)
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
