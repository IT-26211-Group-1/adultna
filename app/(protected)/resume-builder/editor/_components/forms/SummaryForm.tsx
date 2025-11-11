"use client";

import { Textarea, Button } from "@heroui/react";
import { SummaryFormData, summarySchema } from "@/validators/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditorFormProps } from "@/lib/resume/types";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import AISuggestions from "../AISuggestions";
import { debounce } from "@/lib/utils/debounce";
import { useGenerateSummarySuggestions } from "@/hooks/queries/useAIQueries";
import { addToast } from "@heroui/toast";
import { Sparkles } from "lucide-react";

export default function SummaryForm({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  const previousDataRef = useRef<string>("");
  const [summaryText, setSummaryText] = useState<string>(
    resumeData.summary || "",
  );
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const form = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || "",
    },
  });

  const generateSummarySuggestions = useGenerateSummarySuggestions(
    resumeData.id || "",
  );

  // Update form when summaryText changes
  useEffect(() => {
    form.setValue("summary", summaryText);
  }, [summaryText, form]);

  const syncFormData = useCallback(async () => {
    const isValid = await form.trigger();

    if (isValid) {
      const values = form.getValues();

      setResumeData({ ...resumeData, ...values });
    }
  }, [form, resumeData, setResumeData]);

  const debouncedSync = useMemo(
    () => debounce(syncFormData, 300),
    [syncFormData],
  );

  useEffect(() => {
    const { unsubscribe } = form.watch(() => {
      debouncedSync();
    });

    return unsubscribe;
  }, [form, debouncedSync]);

  useEffect(() => {
    if (resumeData.summary) {
      const currentData = resumeData.summary;

      if (previousDataRef.current !== currentData) {
        setSummaryText(currentData);
        form.reset({
          summary: currentData,
        });
        previousDataRef.current = currentData;
      }
    }
  }, [resumeData.summary, form]);

  const getWordCount = (text: string): number => {
    if (!text || text.trim() === "") return 0;

    return text.trim().split(/\s+/).length;
  };

  const handleApplySummary = (summary: string) => {
    setSummaryText(summary);
    form.setValue("summary", summary);
  };

  const hasRequiredDataForAI =
    resumeData.jobPosition &&
    resumeData.workExperiences &&
    resumeData.workExperiences.length > 0;

  const handleGenerateAISuggestions = async () => {
    setIsGeneratingAI(true);

    try {
      const suggestions = await generateSummarySuggestions.mutateAsync({
        jobPosition: resumeData.jobPosition,
        workExperiences: resumeData.workExperiences?.map((exp) => ({
          jobTitle: exp.jobTitle,
          employer: exp.employer,
          description: exp.description,
        })),
        educationItems: resumeData.educationItems?.map((edu) => ({
          degree: edu.degree,
          institution: edu.schoolName,
          fieldOfStudy: edu.fieldOfStudy,
        })),
        skills: resumeData.skills?.map((s) => s.skill).filter(Boolean),
        existingSummary: summaryText || undefined,
      });

      setAiSuggestions(suggestions);

      addToast({
        title: "AI suggestions generated",
        description: "Click to add a summary to your resume",
        color: "success",
      });
    } catch {
      addToast({
        title: "Failed to generate suggestions",
        description: "Please try again",
        color: "danger",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-sm text-default-500">
          {hasRequiredDataForAI
            ? "Write a short introduction for your resume. Don't worry! Our AI will help you out and give recommendations."
            : "Write a short introduction for your resume. Add a job position and work experience to unlock AI-powered suggestions."}
        </p>
      </div>

      <form className="space-y-6">
        {hasRequiredDataForAI && (
          <div className="flex justify-center">
            <Button
              color="success"
              isLoading={isGeneratingAI}
              size="sm"
              startContent={isGeneratingAI ? null : <Sparkles size={16} />}
              type="button"
              variant="flat"
              onPress={handleGenerateAISuggestions}
            >
              {isGeneratingAI ? "Generating..." : "Get AI Suggestions"}
            </Button>
          </div>
        )}

        <Textarea
          description={`${summaryText ? `${getWordCount(summaryText)} / 250 words` : "Maximum 250 words"}`}
          errorMessage={form.formState.errors.summary?.message}
          isInvalid={!!form.formState.errors.summary}
          label="Professional Summary"
          minRows={4}
          value={summaryText}
          onChange={(e) => setSummaryText(e.target.value)}
        />

        {aiSuggestions.length > 0 && (
          <AISuggestions
            buttonType="addSummary"
            subtitle="Our AI is here to help, but your final resume is up to you — review before submitting!"
            suggestions={aiSuggestions}
            title={
              `AI Recommendations for ${resumeData.firstName || ""} ${resumeData.lastName || ""}`.trim() +
              "'s Professional Summary"
            }
            onApplySuggestion={handleApplySummary}
          />
        )}
      </form>
    </div>
  );
}
