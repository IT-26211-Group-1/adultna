"use client";

import { Input, Textarea } from "@heroui/react";
import { SummaryFormData, summarySchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


export default function SummaryForm() {
  const form = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: "",
    },
  });

  // Function to count words in the summary
  const getWordCount = (text: string): number => {
    if (!text || text.trim() === "") return 0;
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-sm text-default-500">
          Write a short introduction for your resume. Don’t worry! Our AI will help you out and give recommendations.
        </p>
      </div>

      <form className="space-y-3">
        <Textarea
          {...form.register("summary")}
          label="Professional Summary"
          description={`${form.watch("summary") ? `${getWordCount(form.watch("summary") || "")} / 250 words` : "Maximum 250 words"}`}
          minRows={4}
          autoFocus
          isInvalid={!!form.formState.errors.summary}
          errorMessage={form.formState.errors.summary?.message}
        />
      </form>
    </div>
  );
}