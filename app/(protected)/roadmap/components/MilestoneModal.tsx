"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button } from "@heroui/react";
import { Milestone } from "../../../../types/roadmap";
import { MilestoneService } from "../infrastructure/milestoneService";

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
}

export function MilestoneModal({
  isOpen,
  onClose,
  milestone,
}: MilestoneModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (milestone) {
      MilestoneService.updateTaskCompletion(milestone.id, taskId, completed);
    }
  };

  const completedTasksCount = useMemo(() => {
    if (!milestone) return 0;
    return milestone.tasks.filter(task => task.completed).length;
  }, [milestone]);

  const progressPercentage = useMemo(() => {
    if (!milestone || milestone.tasks.length === 0) return 0;
    return (completedTasksCount / milestone.tasks.length) * 100;
  }, [milestone, completedTasksCount]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!milestone) return null;

  return (
    <>
      {/* Modal Container */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex items-center justify-end pointer-events-none transition-all duration-500 ${
          isOpen ? "" : ""
        }`}
      >
        {/* Animated Arrow */}
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-500 ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
          }`}
        >
          <div className="flex items-center space-x-2 text-blue-500">
            <div className="animate-pulse">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="animate-bounce"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`pointer-events-auto bg-white dark:bg-gray-900 rounded-l-2xl shadow-2xl w-full max-w-lg h-full overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-700 transition-all duration-500 ease-in-out transform ${
            isOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">{milestone.title}</h2>
                <span className="text-blue-100 text-sm font-medium">
                  {milestone.category}
                </span>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{completedTasksCount}/{milestone.tasks.length} tasks</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 h-full">
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              {/* Tasks */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Tasks to Complete
                </h3>
                <div className="space-y-3">
                  {milestone.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`group flex items-center p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                        task.completed
                          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="flex items-center flex-1">
                        <div className="relative">
                          <input
                            checked={task.completed}
                            className="w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                            id={`task-${task.id}`}
                            type="checkbox"
                            onChange={(e) =>
                              handleTaskToggle(task.id, e.target.checked)
                            }
                          />
                          {task.completed && (
                            <svg
                              className="absolute inset-0 w-5 h-5 text-green-600 pointer-events-none"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <label
                          className={`ml-4 text-sm cursor-pointer transition-all duration-200 ${
                            task.completed
                              ? "text-green-700 dark:text-green-300 line-through"
                              : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                          }`}
                          htmlFor={`task-${task.id}`}
                        >
                          {task.title}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Pro Tip
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                  Start with the tasks that feel most manageable to build
                  momentum. You can customize this list by adding your own tasks
                  that are relevant to your situation.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <Button
                color="default"
                variant="flat"
                className="font-medium"
              >
                Add Custom Task
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                className="font-medium"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
