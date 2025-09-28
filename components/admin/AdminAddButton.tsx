"use client";

import React, { useState, useCallback, ReactNode } from "react";

interface AddButtonProps {
  label: string;
  modalComponent: ReactNode;
  onCreated?: () => void;
  className?: string;
  variant?: "default" | "green";
}

export function AdminAddButton({
  label,
  modalComponent,
  onCreated,
  className = "",
  variant = "default",
}: AddButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleCreated = useCallback(() => {
    onCreated?.();
    setModalOpen(false);
  }, [onCreated]);

  // Define styles based on variant
  const getButtonStyles = () => {
    const baseStyles =
      "flex items-center space-x-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

    switch (variant) {
      case "green":
        return `${baseStyles} bg-[#11553F] text-white hover:bg-[#0e4634] focus:ring-[#11553F]`;
      case "default":
      default:
        return `${baseStyles} bg-black text-white hover:bg-gray-800 focus:ring-gray-500`;
    }
  };

  const modalWithProps = React.isValidElement(modalComponent)
    ? React.cloneElement(modalComponent, {
        open: modalOpen,
        onClose: handleCloseModal,
        onFeedbackCreated: handleCreated,
        onUserCreated: handleCreated,
        onCreated: handleCreated,
        ...modalComponent.props,
      })
    : null;

  return (
    <>
      <button
        className={`${getButtonStyles()} ${className}`}
        onClick={handleOpenModal}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>{label}</span>
      </button>

      {modalWithProps}
    </>
  );
}

export default AdminAddButton;
