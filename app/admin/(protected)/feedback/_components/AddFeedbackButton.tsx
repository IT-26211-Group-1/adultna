"use client";

import React, { useState, useCallback } from "react";
import AddFeedbackModal from "./AddFeedbackModal";

export default function AddFeedbackButton() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleFeedbackCreated = useCallback(() => {
    // Modal will automatically close and refetch data
  }, []);

  return (
    <>
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-[#11553F] text-white rounded-md hover:bg-[#0e4634] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#11553F]"
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
        <span>Add Feedback</span>
      </button>

      <AddFeedbackModal
        open={modalOpen}
        onClose={handleCloseModal}
        onFeedbackCreated={handleFeedbackCreated}
      />
    </>
  );
}