"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { Trash2, X } from "lucide-react";
import { Milestone } from "../../../../types/roadmap";
import {
  useUpdateTask,
  useDeleteMilestone,
  useDeleteTask,
  useMilestone,
} from "@/hooks/queries/useRoadmapQueries";

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
  onMilestoneUpdated?: () => void;
}

export function MilestoneModal({
  isOpen,
  onClose,
  milestone: initialMilestone,
  onMilestoneUpdated,
}: MilestoneModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: fetchedMilestone } = useMilestone(initialMilestone?.id);
  const milestone = fetchedMilestone || initialMilestone;

  const updateTaskMutation = useUpdateTask(milestone?.id || "");
  const deleteMilestone = useDeleteMilestone();
  const deleteTask = useDeleteTask(milestone?.id || "");

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (milestone) {
      updateTaskMutation.mutate(
        {
          taskId,
          isCompleted: completed,
        },
        {
          onSuccess: () => {
            onMilestoneUpdated?.();
          },
        }
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!milestone) return;

    try {
      await deleteTask.mutateAsync(taskId);
      onMilestoneUpdated?.();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleDelete = async () => {
    if (!milestone) return;

    try {
      await deleteMilestone.mutateAsync(milestone.id);
      onClose();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete milestone:", error);
    }
  };

  const completedTasksCount = useMemo(() => {
    if (!milestone) return 0;

    return milestone.tasks.filter((task) => task.completed).length;
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
    } else {
      setShowDeleteConfirm(false);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!milestone) return null;

  return (
    <>
      {/* Modal Container - Fully Transparent */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex items-center justify-end pr-4 pointer-events-none transition-all duration-500 ${
          isOpen ? "" : ""
        }`}
        style={{ backgroundColor: "transparent" }}
      >


        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`pointer-events-auto backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl w-full max-w-sm h-[calc(100vh-8rem)] my-6 overflow-hidden transition-all duration-500 ease-in-out transform ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          style={{ backgroundColor: "rgba(255,255,255, 0.85)" }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b border-white/20 backdrop-blur-sm relative overflow-hidden rounded-t-3xl"
            style={{ backgroundColor: "rgba(99,102,241, 0.15)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold mb-1 truncate text-gray-900">
                  {milestone.title}
                </h2>
                <span className="text-gray-700 text-xs font-medium">
                  {milestone.category}
                </span>
              </div>
              <button
                className="ml-2 p-1.5 hover:bg-white/40 rounded-full transition-colors duration-200 flex-shrink-0"
                onClick={onClose}
              >
                <svg
                  className="text-gray-700"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1 text-gray-700">
                <span>Progress</span>
                <span>
                  {completedTasksCount}/{milestone.tasks.length}
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-1.5">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 h-full">
            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 mb-1">
                  Description
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              {/* Tasks */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 mb-2">
                  Tasks
                </h3>
                <div className="space-y-2">
                  {milestone.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`group flex items-center justify-between p-3 rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-200 hover:border-white/50 ${
                        task.completed ? "" : "hover:bg-white/30"
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        backgroundColor: task.completed
                          ? "rgba(34,197,94, 0.15)"
                          : "rgba(59,130,246, 0.1)",
                      }}
                    >
                      <div className="flex items-center flex-1">
                        <div className="relative flex-shrink-0">
                          <input
                            checked={task.completed}
                            className="w-3 h-3 text-blue-600 bg-white border border-gray-300 rounded focus:ring-blue-500 focus:ring-1 transition-all duration-200"
                            id={`task-${task.id}`}
                            type="checkbox"
                            onChange={(e) =>
                              handleTaskToggle(task.id, e.target.checked)
                            }
                          />
                          {task.completed && (
                            <svg
                              className="absolute inset-0 w-3 h-3 text-green-600 pointer-events-none"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                clipRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                fillRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <label
                          className={`ml-2 text-xs cursor-pointer transition-all duration-200 leading-tight ${
                            task.completed
                              ? "text-green-700 dark:text-green-300 line-through"
                              : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                          }`}
                          htmlFor={`task-${task.id}`}
                        >
                          {task.title}
                        </label>
                      </div>
                      <button
                        className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tip */}
              <div
                className="backdrop-blur-sm border border-white/40 rounded-xl p-3 relative overflow-hidden"
                style={{ backgroundColor: "rgba(251,146,60, 0.2)" }}
              >
                <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 pointer-events-none">
                  💡
                </div>
                <h4 className="text-xs font-semibold text-gray-800 mb-1 flex items-center">
                  <span className="mr-1">💡</span>
                  Tip
                </h4>
                <p className="text-xs text-gray-700 leading-tight">
                  Start with manageable tasks to build momentum.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2 border-t border-white/20 backdrop-blur-sm rounded-b-3xl"
            style={{ backgroundColor: "rgba(156,163,175, 0.15)" }}
          >
            {showDeleteConfirm ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-700 text-center">
                  Delete this milestone? This cannot be undone.
                </p>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    className="text-xs font-medium flex-1"
                    color="default"
                    size="sm"
                    variant="flat"
                    onPress={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="text-xs font-medium flex-1"
                    color="danger"
                    size="sm"
                    onPress={handleDelete}
                    isLoading={deleteMilestone.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center gap-2">
                <Button
                  className="text-xs font-medium bg-white/30 hover:bg-white/40 border-white/40"
                  color="default"
                  size="sm"
                  variant="flat"
                  startContent={<Trash2 className="w-3 h-3" />}
                  onPress={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </Button>
                <Button
                  className="text-xs font-medium flex-1 bg-emerald-600 hover:bg-emerald-700"
                  color="primary"
                  size="sm"
                  onPress={onClose}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
