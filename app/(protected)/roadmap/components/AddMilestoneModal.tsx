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

  const createMilestone = useCreateMilestone();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      return;
    }

    // Add any pending task in the input field
    const finalTasks = [...(formData.tasks || [])];
    if (taskInput.trim()) {
      finalTasks.push({ title: taskInput.trim() });
    }

    try {
      await createMilestone.mutateAsync({
        ...formData,
        tasks: finalTasks,
      });
      handleClose();
    } catch (error) {
      console.error("Failed to create milestone:", error);
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
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              Add New Milestone
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Title"
                  placeholder="Enter milestone title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  isRequired
                  variant="bordered"
                />

                <Textarea
                  label="Description"
                  placeholder="Enter milestone description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  variant="bordered"
                  minRows={3}
                />

                <Select
                  label="Category"
                  placeholder="Select a category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  isRequired
                  variant="bordered"
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Priority"
                  placeholder="Select priority"
                  selectedKeys={formData.priority ? [formData.priority] : []}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  variant="bordered"
                >
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Deadline (Optional)"
                  type="date"
                  value={formData.deadline || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  variant="bordered"
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tasks (Optional)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a task"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTask();
                        }
                      }}
                      variant="bordered"
                      size="sm"
                    />
                    <Button
                      isIconOnly
                      color="primary"
                      variant="flat"
                      size="sm"
                      onPress={handleAddTask}
                      isDisabled={!taskInput.trim()}
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
                            variant="light"
                            size="sm"
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
                color="primary"
                type="submit"
                isLoading={createMilestone.isPending}
                isDisabled={!formData.title || !formData.category}
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
