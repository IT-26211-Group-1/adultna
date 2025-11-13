"use client";

import { Card, CardBody, Select, SelectItem, Button } from "@heroui/react";
import type { CoverLetterStyle } from "@/types/cover-letter";
import { useState } from "react";

type ToneProps = {
  currentStyle?: CoverLetterStyle;
  onChangeTone: (newStyle: CoverLetterStyle) => Promise<void>;
  isInitialGeneration?: boolean;
};

export function Tone({ currentStyle, onChangeTone, isInitialGeneration = false }: ToneProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CoverLetterStyle>(
    currentStyle || "formal"
  );

  const handleChangeTone = async () => {
    setIsChanging(true);
    try {
      await onChangeTone(selectedStyle);
    } finally {
      setIsChanging(false);
    }
  };

  const styleOptions = [
    { key: "formal", label: "Professional" },
    { key: "conversational", label: "Conversational" },
    { key: "modern", label: "Modern" },
  ];

  return (
    <Card className="flex-shrink-0">
      <CardBody className="p-3">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold">Tone & Style</h3>
            <p className="text-xs text-gray-600">
              Choose the tone for your cover letter
            </p>
          </div>

          <Select
            className="w-full"
            label="Select tone"
            selectedKeys={[selectedStyle]}
            size="sm"
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as CoverLetterStyle;
              setSelectedStyle(selected);
            }}
          >
            {styleOptions.map((option) => (
              <SelectItem key={option.key} textValue={option.label}>
                {option.label}
              </SelectItem>
            ))}
          </Select>

          <Button
            className="bg-adult-green hover:bg-[#0e4634] text-white w-full font-semibold"
            isDisabled={isInitialGeneration ? false : (!currentStyle || selectedStyle === currentStyle)}
            isLoading={isChanging}
            size="sm"
            onPress={handleChangeTone}
          >
            {isChanging
              ? (isInitialGeneration ? "Generating..." : "Regenerating...")
              : (isInitialGeneration ? "Generate AI Cover Letter" : "Regenerate with New Tone")
            }
          </Button>

          <p className="text-[10px] text-center text-gray-500 italic">
            Don&apos;t worry, you can still customize it to your liking!
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
