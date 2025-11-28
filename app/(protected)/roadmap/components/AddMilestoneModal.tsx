"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useCreateMilestone } from "@/hooks/queries/useRoadmapQueries";
import { CreateMilestonePayload } from "@/types/roadmap";
import { logger } from "@/lib/logger";
import { createMilestoneSchema } from "@/validators/roadmapSchema";
import { ZodError } from "zod";

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { value: "Professional Growth", label: "Professional Growth" },
  { value: "Practical Skills", label: "Practical Skills" },
  { value: "Financial Management", label: "Financial Management" },
  { value: "Health & Wellness", label: "Health & Wellness" },
  { value: "Personal Development", label: "Personal Development" },
  { value: "Social & Relationships", label: "Social & Relationships" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function AddMilestoneModal({ isOpen, onClose }: AddMilestoneModalProps) {
  const [formData, setFormData] = useState<CreateMilestonePayload>({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    tasks: [],
  });
  const [taskInput, setTaskInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMilestone = useCreateMilestone();

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Add any pending task in the input field
    const finalTasks = [...(formData.tasks || [])];

    if (taskInput.trim()) {
      finalTasks.push({ title: taskInput.trim() });
    }

    const dataToValidate = {
      ...formData,
      tasks: finalTasks,
    };

    try {
      createMilestoneSchema.parse(dataToValidate);

      await createMilestone.mutateAsync(dataToValidate);
      handleClose();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const path = issue.path.join(".");

          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        logger.error("Failed to create milestone:", error);
      }
    }
  };

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setFormData({
        ...formData,
        tasks: [...(formData.tasks || []), { title: taskInput.trim() }],
      });
      setTaskInput("");
    }
  };

  const handleRemoveTask = (index: number) => {
    setFormData({
      ...formData,
      tasks: formData.tasks?.filter((_, i) => i !== index),
    });
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      tasks: [],
    });
    setTaskInput("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      size="2xl"
      onClose={handleClose}
    >
      <ModalContent>
        {() => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Add New Milestone
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  errorMessage={errors.title}
                  isInvalid={!!errors.title}
                  label="Title"
                  placeholder="Enter milestone title"
                  value={formData.title}
                  variant="bordered"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />

                <Textarea
                  errorMessage={errors.description}
                  isInvalid={!!errors.description}
                  label="Description"
                  minRows={3}
                  placeholder="Enter milestone description"
                  value={formData.description}
                  variant="bordered"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <Select
                  isRequired
                  label="Category"
                  placeholder="Select a category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  variant="bordered"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat.value}>{cat.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Priority"
                  placeholder="Select priority"
                  selectedKeys={formData.priority ? [formData.priority] : []}
                  variant="bordered"
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  errorMessage={errors.deadline}
                  isInvalid={!!errors.deadline}
                  label="Deadline (Optional)"
                  min={minDate}
                  type="date"
                  value={formData.deadline || ""}
                  variant="bordered"
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Tasks (Optional)</div>
                  {errors.tasks && (
                    <div className="text-sm text-danger">{errors.tasks}</div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      isDisabled={formData.tasks && formData.tasks.length >= 5}
                      placeholder="Add a task"
                      size="sm"
                      value={taskInput}
                      variant="bordered"
                      onChange={(e) => setTaskInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTask();
                        }
                      }}
                    />
                    <Button
                      isIconOnly
                      color="primary"
                      isDisabled={!taskInput.trim()}
                      size="sm"
                      variant="flat"
                      onPress={handleAddTask}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.tasks && formData.tasks.length > 0 && (
                    <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
                      {formData.tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm">{task.title}</span>
                          <Button
                            isIconOnly
                            color="danger"
                            size="sm"
                            variant="light"
                            onPress={() => handleRemoveTask(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                isDisabled={!formData.title || !formData.category}
                isLoading={createMilestone.isPending}
                type="submit"
              >
                Add Milestone
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
