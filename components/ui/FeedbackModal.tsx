"use client";

import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Select, SelectItem, Input, Textarea } from "@heroui/react";
import { addToast } from "@heroui/toast";
import {
  useFeedback,
  CreateFeedbackRequest,
} from "@/hooks/queries/admin/useFeedbackQueries";
import { logger } from "@/lib/logger";

interface FeedbackModalProps {
  open?: boolean;
  onClose?: () => void;
  onFeedbackCreated?: () => void;
}

const feedbackTypeOptions = [
  { value: "feedback", label: "General Feedback" },
  { value: "report", label: "Report Issue" },
];

const featureOptions = [
  { value: "dashboard", label: "Overview / Dashboard" },
  { value: "roadmap", label: "Roadmap" },
  { value: "ai_gabay_agent", label: "AI Gabay Agent" },
  { value: "gov_guides", label: "GovGuides" },
  { value: "filebox", label: "Adulting Filebox" },
  { value: "resume_builder", label: "Resume Builder" },
  { value: "cover_letter", label: "Cover Letter Helper" },
  { value: "mock_interview_coach", label: "Mock Interview Coach" },
  { value: "job_board", label: "Job Board" },
  { value: "profile", label: "Profile Settings" },
  { value: "general", label: "General / Other" },
];

export default function FeedbackModal({
  open = false,
  onClose = () => {},
  onFeedbackCreated,
}: FeedbackModalProps) {
  const { createFeedback, isCreatingFeedback } = useFeedback();

  const [formData, setFormData] = useState<CreateFeedbackRequest>({
    type: "feedback",
    feature: "general",
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState<{
    [K in keyof CreateFeedbackRequest]?: string;
  }>({});

  const resetForm = useCallback(() => {
    setFormData({
      type: "feedback",
      feature: "general",
      title: "",
      description: "",
    });
    setErrors({});
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: { [K in keyof CreateFeedbackRequest]?: string } = {};

    if (!formData.type) {
      newErrors.type = "Please select a type";
    }
    if (!formData.feature) {
      newErrors.feature = "Please select a feature";
    }
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = "Subject must be at least 5 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Subject must be less than 100 characters";
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Message must be at least 10 characters";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Message must be less than 1000 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const onSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      createFeedback(formData, {
        onSuccess: (response) => {
          if (response.success) {
            addToast({
              title: "Thank you for your feedback!",
              description:
                "We appreciate your input and will review it shortly.",
              color: "success",
              timeout: 4000,
            });
            resetForm();
            onFeedbackCreated?.();
            onClose();
          }
        },
        onError: (error: any) => {
          addToast({
            title: "Failed to submit feedback",
            description: error?.message || "Please try again later.",
            color: "danger",
            timeout: 4000,
          });
        },
      });
    } catch (error) {
      logger.error("Failed to submit feedback:", error);
      addToast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        color: "danger",
        timeout: 4000,
      });
    }
  }, [
    createFeedback,
    formData,
    validateForm,
    resetForm,
    onFeedbackCreated,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const isLoading = isCreatingFeedback;

  return (
    <Modal
      backdrop="blur"
      classNames={{
        wrapper: "z-[9999]",
        backdrop: "z-[9998]",
      }}
      isOpen={open}
      placement="center"
      size="2xl"
      onClose={handleClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-gray-900">Send Feedback</h3>
          <p className="text-sm text-gray-500">
            Help us improve AdultNa by sharing your thoughts or reporting issues
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div>
              <Select
                isRequired
                errorMessage={errors.type}
                isDisabled={isLoading}
                isInvalid={!!errors.type}
                label="Type"
                placeholder="Select feedback type"
                selectedKeys={formData.type ? [formData.type] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;

                  setFormData((prev) => ({
                    ...prev,
                    type: selectedKey as any,
                  }));
                  setErrors((prev) => ({ ...prev, type: undefined }));
                }}
              >
                {feedbackTypeOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Select
                isRequired
                errorMessage={errors.feature}
                isDisabled={isLoading}
                isInvalid={!!errors.feature}
                label="Related to"
                placeholder="Select related feature"
                selectedKeys={formData.feature ? [formData.feature] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;

                  setFormData((prev) => ({ ...prev, feature: selectedKey }));
                  setErrors((prev) => ({ ...prev, feature: undefined }));
                }}
              >
                {featureOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Input
                isRequired
                errorMessage={errors.title}
                isDisabled={isLoading}
                isInvalid={!!errors.title}
                label="Subject"
                placeholder="Brief summary of your feedback"
                value={formData.title}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, title: value }));
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }}
              />
            </div>

            <div>
              <Textarea
                isRequired
                description="Include steps to reproduce if reporting a bug, or specific suggestions if providing feedback."
                errorMessage={errors.description}
                isDisabled={isLoading}
                isInvalid={!!errors.description}
                label="Message"
                minRows={4}
                placeholder="Please provide detailed feedback or describe the issue you're experiencing..."
                value={formData.description}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, description: value }));
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            isDisabled={isLoading}
            variant="flat"
            onPress={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-adult-green text-white"
            isDisabled={isLoading}
            isLoading={isLoading}
            onPress={onSubmit}
          >
            Send Feedback
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
