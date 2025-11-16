"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { Trash2, X, Plus, Edit2, Check } from "lucide-react";
import { addToast } from "@heroui/toast";
import { Milestone } from "../../../../types/roadmap";
import {
  useUpdateTask,
  useDeleteMilestone,
  useDeleteTask,
  useMilestone,
  useCreateTask,
  useUpdateMilestone,
} from "@/hooks/queries/useRoadmapQueries";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  const { data: fetchedMilestone } = useMilestone(initialMilestone?.id);
  const milestone = fetchedMilestone || initialMilestone;

  const updateTaskMutation = useUpdateTask(milestone?.id || "");
  const deleteMilestone = useDeleteMilestone();
  const deleteTask = useDeleteTask(milestone?.id || "");
  const createTask = useCreateTask(milestone?.id || "");
  const updateMilestone = useUpdateMilestone();

  // Initialize edit form when milestone changes
  useEffect(() => {
    if (milestone && isEditing) {
      setEditForm({
        title: milestone.title,
        description: milestone.description || "",
      });
    }
  }, [milestone, isEditing]);

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
        },
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

  const handleStartEditTask = (taskId: string, currentTitle: string) => {
    setEditingTaskId(taskId);
    setEditingTaskTitle(currentTitle);
  };

  const handleSaveTaskEdit = async (taskId: string) => {
    if (!milestone || !editingTaskTitle.trim()) return;

    try {
      await updateTaskMutation.mutateAsync({
        taskId,
        title: editingTaskTitle.trim(),
      });
      addToast({
        title: "Task updated successfully",
        color: "success",
      });
      setEditingTaskId(null);
      setEditingTaskTitle("");
      onMilestoneUpdated?.();
    } catch (error) {
      console.error("Failed to update task:", error);
      addToast({
        title: "Failed to update task",
        color: "danger",
      });
    }
  };

  const handleCancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditingTaskTitle("");
  };

  const handleAddTask = async () => {
    if (!milestone || !newTaskTitle.trim()) return;

    if (milestone.tasks.length >= 5) {
      return;
    }

    try {
      await createTask.mutateAsync(newTaskTitle.trim());
      setNewTaskTitle("");
      onMilestoneUpdated?.();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDelete = async () => {
    if (!milestone) return;

    try {
      await deleteMilestone.mutateAsync(milestone.id);
      addToast({
        title: "Milestone deleted successfully",
        color: "success",
      });
      onClose();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete milestone:", error);
      addToast({
        title: "Failed to delete milestone",
        color: "danger",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!milestone || !editForm.title.trim()) return;

    try {
      await updateMilestone.mutateAsync({
        milestoneId: milestone.id,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
      });
      addToast({
        title: "Milestone updated successfully",
        color: "success",
      });
      setIsEditing(false);
      onMilestoneUpdated?.();
    } catch (error) {
      console.error("Failed to update milestone:", error);
      addToast({
        title: "Failed to update milestone",
        color: "danger",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: milestone?.title || "",
      description: milestone?.description || "",
    });
  };

  const handleStartEdit = () => {
    if (milestone) {
      setEditForm({
        title: milestone.title,
        description: milestone.description || "",
      });
      setIsEditing(true);
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
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      className="w-full text-sm font-bold px-2 py-1 rounded-lg border border-white/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Milestone title"
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-sm font-bold mb-1 truncate text-gray-900">
                      {milestone.title}
                    </h2>
                    <span className="text-gray-700 text-xs font-medium">
                      {milestone.category}
                    </span>
                  </>
                )}
              </div>
              <div className="ml-2 flex gap-1 flex-shrink-0">
                {isEditing ? (
                  <>
                    <button
                      className="p-1.5 hover:bg-green-100 rounded-full transition-colors duration-200"
                      title="Save changes"
                      onClick={handleSaveEdit}
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-300/50 rounded-full transition-colors duration-200"
                      title="Cancel editing"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="p-1.5 hover:bg-blue-100 rounded-full transition-colors duration-200"
                      title="Edit milestone"
                      onClick={handleStartEdit}
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-white/40 rounded-full transition-colors duration-200"
                      title="Close modal"
                      onClick={onClose}
                    >
                      <X className="w-4 h-4 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
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
                {isEditing ? (
                  <textarea
                    className="w-full text-xs px-3 py-2 rounded-lg border border-white/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
                    placeholder="Milestone description"
                    rows={4}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {milestone.description}
                  </p>
                )}
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
                      {editingTaskId === task.id ? (
                        <>
                          <input
                            className="flex-1 text-xs px-2 py-1 rounded-lg border border-white/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            type="text"
                            value={editingTaskTitle}
                            onChange={(e) =>
                              setEditingTaskTitle(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveTaskEdit(task.id);
                              } else if (e.key === "Escape") {
                                handleCancelTaskEdit();
                              }
                            }}
                          />
                          <div className="flex gap-1 ml-2">
                            <button
                              className="p-1 hover:bg-green-100 rounded-full transition-colors"
                              title="Save changes"
                              onClick={() => handleSaveTaskEdit(task.id)}
                            >
                              <Check className="w-3 h-3 text-green-600" />
                            </button>
                            <button
                              className="p-1 hover:bg-gray-300/50 rounded-full transition-colors"
                              title="Cancel editing"
                              onClick={handleCancelTaskEdit}
                            >
                              <X className="w-3 h-3 text-gray-700" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
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
                          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100">
                            <button
                              className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                              title="Edit task"
                              onClick={() =>
                                handleStartEditTask(task.id, task.title)
                              }
                            >
                              <Edit2 className="w-3 h-3 text-blue-600" />
                            </button>
                            <button
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                              title="Delete task"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Task Input */}
                {milestone.tasks.length < 5 && (
                  <div className="mt-3">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-white/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add a new task..."
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddTask();
                          }
                        }}
                      />
                      <Button
                        className="text-xs font-medium bg-[#11553F] hover:bg-[#0d4230] text-white"
                        isDisabled={
                          !newTaskTitle.trim() || createTask.isPending
                        }
                        size="sm"
                        startContent={
                          createTask.isPending ? (
                            <LoadingSpinner
                              fullScreen={false}
                              size="sm"
                              variant="default"
                            />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )
                        }
                        onPress={handleAddTask}
                      >
                        {createTask.isPending ? "" : "Add"}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {5 - milestone.tasks.length} task(s) remaining
                    </p>
                  </div>
                )}

                {milestone.tasks.length >= 5 && (
                  <div className="mt-3 p-2 bg-orange-100/50 border border-orange-300/50 rounded-lg">
                    <p className="text-xs text-orange-700 text-center">
                      Maximum of 5 tasks reached
                    </p>
                  </div>
                )}
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

              {/* Delete Milestone */}
              <div>
                <h3 className="text-xs font-semibold text-gray-800 mb-2">
                  Danger Zone
                </h3>
                {showDeleteConfirm ? (
                  <div
                    className="backdrop-blur-sm border border-red-300 rounded-xl p-3"
                    style={{ backgroundColor: "rgba(239,68,68, 0.1)" }}
                  >
                    <p className="text-xs text-gray-700 mb-3 text-center">
                      Delete this milestone? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
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
                        isDisabled={deleteMilestone.isPending}
                        size="sm"
                        startContent={
                          deleteMilestone.isPending ? (
                            <LoadingSpinner
                              fullScreen={false}
                              size="sm"
                              variant="default"
                            />
                          ) : undefined
                        }
                        onPress={handleDelete}
                      >
                        {deleteMilestone.isPending ? "" : "Delete"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="backdrop-blur-sm border border-red-200 rounded-xl p-3"
                    style={{ backgroundColor: "rgba(254,202,202, 0.3)" }}
                  >
                    <p className="text-xs text-gray-700 mb-2">
                      Permanently delete this milestone and all its tasks.
                    </p>
                    <Button
                      className="text-xs font-medium w-full bg-red-600 hover:bg-red-700"
                      color="danger"
                      size="sm"
                      startContent={<Trash2 className="w-3 h-3" />}
                      onPress={() => setShowDeleteConfirm(true)}
                    >
                      Delete Milestone
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2 border-t border-white/20 backdrop-blur-sm rounded-b-3xl"
            style={{ backgroundColor: "rgba(156,163,175, 0.15)" }}
          >
            <Button
              className="text-xs font-medium w-full bg-emerald-600 hover:bg-emerald-700"
              color="primary"
              size="sm"
              onPress={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
