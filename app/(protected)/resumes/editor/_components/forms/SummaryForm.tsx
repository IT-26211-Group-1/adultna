"use client";

import { Input, Textarea } from "@heroui/react";
import { SummaryFormData, summarySchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect, useState } from "react";
import AISuggestions from "../AISuggestions";

export default function SummaryForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const [summaryText, setSummaryText] = useState<string>(
    resumeData.summary || ""
  );

  const form = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
    },
  });

  // Update form when summaryText changes
  useEffect(() => {
    form.setValue("summary", summaryText);
  }, [summaryText, form]);

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  // Function to count words in the summary
  const getWordCount = (text: string): number => {
    if (!text || text.trim() === "") return 0;
    return text.trim().split(/\s+/).length;
  };

  // Test data lang for the design
  const aiSummaryOptions: string[] = [
    "4th Year BSIT student sa fras"
  ];

  const handleApplySummary = (summary: string) => {
    setSummaryText(summary);
    form.setValue("summary", summary);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-sm text-default-500">
          Write a short introduction for your resume. Don’t worry! Our AI will
          help you out and give recommendations.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          label="Professional Summary"
          description={`${summaryText ? `${getWordCount(summaryText)} / 250 words` : "Maximum 250 words"}`}
          minRows={4}
          autoFocus
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
          isInvalid={!!form.formState.errors.summary}
          errorMessage={form.formState.errors.summary?.message}
        />

        {/* Only show AISuggestions when aiSummaryOptions has data */}
        {aiSummaryOptions.length > 0 && (
          <AISuggestions
            title="AI Recommendations for Juan Miguel's Professional Summary"
            subtitle="Our AI is here to help, but your final resume is up to you — review before submitting!"
            suggestions={aiSummaryOptions}
            onApplySuggestion={handleApplySummary}
            buttonType="addSummary"
          />
        )}
      </form>
    </div>
  );
}
