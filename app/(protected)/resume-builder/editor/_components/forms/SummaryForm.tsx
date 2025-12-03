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
  onValidationChange,
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
    if (onValidationChange) {
      const hasNoErrors = Object.keys(form.formState.errors).length === 0;

      onValidationChange(hasNoErrors);
    }
  }, [form.formState.errors, onValidationChange]);

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

  // Summary limits
  const SUMMARY_LIMITS = {
    maxWords: 250,
    maxCharacters: 1500,
    warningThreshold: 0.9,
  } as const;

  const summaryStats = useMemo(() => {
    const charCount = summaryText.length;
    const wordCount = summaryText.trim()
      ? summaryText.trim().split(/\s+/).length
      : 0;
    
    return {
      charCount,
      wordCount,
      isCharLimitNear: charCount >= SUMMARY_LIMITS.maxCharacters * SUMMARY_LIMITS.warningThreshold,
      isWordLimitNear: wordCount >= SUMMARY_LIMITS.maxWords * SUMMARY_LIMITS.warningThreshold,
    };
  }, [summaryText]);

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
    } catch (error: any) {
      if (error?.message?.includes("RATE_LIMIT_EXCEEDED")) {
        addToast({
          title: "Too many requests",
          description: "Please try again in a moment.",
          color: "warning",
        });
      } else {
        addToast({
          title: "Failed to generate suggestions",
          description: "Please try again",
          color: "danger",
        });
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-3">
      <div className="space-y-1 text-center mb-6">
        <h2 className="text-xl font-semibold">Professional Summary</h2>
        <p className="text-xs text-default-500">
          {hasRequiredDataForAI
            ? "Write a short introduction for your resume. Don't worry! Our AI will help you out and give recommendations."
            : "Write a short introduction for your resume. Add a job position and work experience to unlock AI-powered suggestions."}
        </p>
      </div>

      <form className="space-y-3">
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

        <div className="space-y-2">
          <Textarea
            errorMessage={form.formState.errors.summary?.message}
            isInvalid={!!form.formState.errors.summary}
            label="Professional Summary"
            minRows={4}
            size="sm"
            value={summaryText}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= SUMMARY_LIMITS.maxCharacters) {
                setSummaryText(newValue);
              }
            }}
          />
          <div className="flex items-center justify-between gap-4">
            <span
              className={`text-xs font-medium transition-colors ${
                summaryStats.isCharLimitNear
                  ? "text-amber-600"
                  : "text-gray-500"
              }`}
            >
              {summaryStats.charCount.toLocaleString()} / {SUMMARY_LIMITS.maxCharacters.toLocaleString()} characters
            </span>
            <span
              className={`text-xs font-medium transition-colors ${
                summaryStats.isWordLimitNear
                  ? "text-amber-600"
                  : "text-gray-500"
              }`}
            >
              {summaryStats.wordCount.toLocaleString()} / {SUMMARY_LIMITS.maxWords.toLocaleString()} words
            </span>
          </div>
        </div>

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
