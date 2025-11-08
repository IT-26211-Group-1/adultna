import { memo } from "react";
import { Modal, ModalContent, ModalBody, Progress } from "@heroui/react";

type GradingProgressModalProps = {
  isOpen: boolean;
  progress: number;
  currentQuestion?: number;
  totalQuestions?: number;
};

const GradingProgressModalComponent = ({
  isOpen,
  progress,
  currentQuestion,
  totalQuestions,
}: GradingProgressModalProps) => {
  const getProgressMessage = () => {
    if (progress < 20) {
      return "Analyzing your answer...";
    } else if (progress < 40) {
      return "Evaluating STAR methodology...";
    } else if (progress < 60) {
      return "Assessing delivery and fluency...";
    } else if (progress < 80) {
      return "Calculating scores...";
    } else if (progress < 100) {
      return "Generating feedback...";
    } else {
      return "Grading complete!";
    }
  };

  return (
    <Modal
      hideCloseButton
      classNames={{
        backdrop: "bg-black/80 backdrop-blur-sm",
      }}
      isDismissable={false}
      isOpen={isOpen}
      size="md"
    >
      <ModalContent>
        <ModalBody className="py-10 px-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-[#11553F] border-t-transparent animate-spin [animation-duration:1s]" />
                <div className="absolute inset-1 rounded-full border-2 border-transparent border-r-[#11553F] animate-spin opacity-70 [animation-duration:1.5s] [animation-direction:reverse]" />
                <div className="absolute inset-2 rounded-full border border-transparent border-b-[#11553F] animate-spin opacity-40 [animation-duration:2.5s]" />
              </div>
            </div>

            <div className="w-full space-y-3 text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Grading Your Answer
              </h3>
              {currentQuestion && totalQuestions && (
                <p className="text-sm text-gray-600">
                  Question {currentQuestion} of {totalQuestions}
                </p>
              )}
              <p className="text-sm text-gray-600">{getProgressMessage()}</p>
            </div>

            <div className="w-full space-y-2">
              <Progress
                classNames={{
                  track: "bg-gray-200",
                  indicator: "bg-[#11553F]",
                }}
                color="success"
                size="md"
                value={progress}
              />
              <p className="text-xs text-center text-gray-500">
                {Math.round(progress)}%
              </p>
            </div>

            <p className="text-xs text-gray-500 text-center max-w-xs">
              This may take a few moments. Please don&apos;t close this window.
            </p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

GradingProgressModalComponent.displayName = "GradingProgressModal";

export const GradingProgressModal = memo(GradingProgressModalComponent);
