"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

type ReviewHeaderProps = {
  coverLetterId: string;
};

export default function ReviewHeader({ coverLetterId }: ReviewHeaderProps) {
  const router = useRouter();

  const handleBackToEditor = () => {
    router.push(`/cover-letter/editor?id=${coverLetterId}`);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        startContent={<ArrowLeft size={16} />}
        variant="light"
        onPress={handleBackToEditor}
      >
        Back to Editor
      </Button>
      <h1 className="text-2xl font-bold text-gray-900">Cover Letter Review</h1>
      <div className="w-32" />
    </div>
  );
}
