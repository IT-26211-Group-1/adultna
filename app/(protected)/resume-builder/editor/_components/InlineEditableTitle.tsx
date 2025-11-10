"use client";

import { Input } from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { useUpdateResume } from "@/hooks/queries/useResumeQueries";

type InlineEditableTitleProps = {
  resumeId: string;
  currentTitle: string;
  onTitleChange: (newTitle: string) => void;
};

export default function InlineEditableTitle({
  resumeId,
  currentTitle,
  onTitleChange,
}: InlineEditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateResume = useUpdateResume(resumeId);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title is required");
      setTitle(currentTitle);
      setIsEditing(false);

      return;
    }

    if (trimmedTitle.length > 100) {
      setError("Title must be less than 100 characters");
      setTitle(currentTitle);
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === currentTitle) {
      setIsEditing(false);

      return;
    }

    try {
      await updateResume.mutateAsync({ title: trimmedTitle });
      onTitleChange(trimmedTitle);
      setError(null);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update title");
      setTitle(currentTitle);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setTitle(currentTitle);
      setError(null);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <div className="flex flex-col max-w-md">
        <Input
          ref={inputRef}
          aria-label="Resume title"
          classNames={{
            input: "text-lg font-semibold",
            inputWrapper: "border-2 border-[#11553F]",
          }}
          errorMessage={error}
          isInvalid={!!error}
          placeholder="Untitled Resume"
          size="md"
          value={title}
          onBlur={handleBlur}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h1
        className="text-lg font-semibold cursor-pointer hover:bg-[#11553F]/10 px-2 py-1 rounded transition-colors"
        role="button"
        tabIndex={0}
        onClick={() => setIsEditing(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsEditing(true);
          }
        }}
      >
        {currentTitle || "Untitled Resume"}
      </h1>
      {updateResume.isPending && (
        <span className="text-sm text-[#11553F]">Saving...</span>
      )}
    </div>
  );
}
