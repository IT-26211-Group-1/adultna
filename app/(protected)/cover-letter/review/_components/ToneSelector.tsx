"use client";

import { Card, CardBody, Select, SelectItem, Button } from "@heroui/react";
import { useState } from "react";
import { useRegenerateWithTone } from "@/hooks/queries/useCoverLetterQueries";
import { addToast } from "@heroui/toast";

type ToneSelectorProps = {
  coverLetterId: string;
  currentTone: string;
};

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "confident", label: "Confident" },
  { value: "friendly", label: "Friendly" },
];

export default function ToneSelector({
  coverLetterId,
  currentTone,
}: ToneSelectorProps) {
  const [selectedTone, setSelectedTone] = useState(currentTone);
  const regenerateWithTone = useRegenerateWithTone(coverLetterId);

  const handleRegenerateTone = async () => {
    if (selectedTone === currentTone) {
      addToast({
        title: "Same tone selected",
        description: "Please select a different tone to regenerate",
        color: "warning",
      });

      return;
    }

    try {
      await regenerateWithTone.mutateAsync({ tone: selectedTone });
      addToast({
        title: "Cover letter regenerated!",
        description: `Tone changed to ${selectedTone}`,
        color: "success",
      });
    } catch {
      addToast({
        title: "Failed to regenerate",
        color: "danger",
      });
    }
  };

  return (
    <Card>
      <CardBody className="p-6">
        <h2 className="text-lg font-semibold mb-4">Tone & Style</h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose the tone for your cover letter
        </p>

        <Select
          label="Tone"
          selectedKeys={[selectedTone]}
          onChange={(e) => setSelectedTone(e.target.value)}
        >
          {TONE_OPTIONS.map((option) => (
            <SelectItem key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <Button
          className="w-full mt-4 bg-adult-green hover:bg-[#0e4634] text-white"
          isDisabled={selectedTone === currentTone}
          isLoading={regenerateWithTone.isPending}
          onPress={handleRegenerateTone}
        >
          {regenerateWithTone.isPending
            ? "Regenerating..."
            : "Regenerate with Tone"}
        </Button>
      </CardBody>
    </Card>
  );
}
