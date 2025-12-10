"use client";

import { useState, useRef, useEffect } from "react";
import { useUpdateTitle } from "@/hooks/queries/useCoverLetterQueries";

type InlineEditableTitleProps = {
  coverLetterId: string;
  currentTitle: string;
  onTitleChange: (newTitle: string) => void;
};

export default function InlineEditableTitle({
  coverLetterId,
  currentTitle,
  onTitleChange,
}: InlineEditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTitle = useUpdateTitle(coverLetterId);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditTitle = () => {
    setTitle(currentTitle);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTitle(currentTitle);
    setIsEditing(false);
  };

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
      setTitle(currentTitle);
      setIsEditing(false);

      return;
    }

    if (trimmedTitle.length > 100) {
      setTitle(currentTitle);
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === currentTitle) {
      setIsEditing(false);

      return;
    }

    try {
      await updateTitle.mutateAsync(trimmedTitle);
      onTitleChange(trimmedTitle);
      setIsEditing(false);
    } catch {
      setTitle(currentTitle);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          className="text-sm font-medium text-gray-900 bg-white border border-emerald-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-48"
          placeholder="Enter cover letter title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancelEdit();
          }}
        />
        <button
          className="text-emerald-600 hover:text-emerald-800 transition-colors p-1"
          title="Save title"
          onClick={handleSave}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          title="Cancel editing"
          onClick={handleCancelEdit}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <span
        aria-current="page"
        className="text-gray-900 font-medium whitespace-nowrap"
      >
        {currentTitle || "Untitled Cover Letter"}
      </span>
      <button
        className="text-gray-400 hover:text-emerald-600 transition-colors p-1 ml-1"
        title="Edit cover letter title"
        onClick={handleEditTitle}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>
      {updateTitle.isPending && (
        <span className="text-xs text-gray-500 ml-2">Saving...</span>
      )}
    </div>
  );
}
