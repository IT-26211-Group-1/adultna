"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
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
  const handleTaskToggle = (taskId: string, completed: boolean) => {
    if (milestone) {
      MilestoneService.updateTaskCompletion(milestone.id, taskId, completed);
    }
  };

  if (!milestone) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">{milestone.title}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {milestone.category}
          </span>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {milestone.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tasks to Complete
              </h3>
              <div className="space-y-2">
                {milestone.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onChange={(e) =>
                          handleTaskToggle(task.id, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`task-${task.id}`}
                        className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {task.title}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                💡 Pro Tip
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Start with the tasks that feel most manageable to build
                momentum. You can customize this list by adding your own tasks
                that are relevant to your situation.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-between">
          <Button variant="flat" color="default">
            Add Custom Task
          </Button>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
