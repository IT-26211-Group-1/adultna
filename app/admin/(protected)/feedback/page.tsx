import React from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import AddFeedbackModal from "./_components/AddFeedbackModal";
import FeedbackTable from "./_components/FeedbackTable";

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AdminAddButton
          label="Add Feedback"
          modalComponent={<AddFeedbackModal />}
          variant="green"
        />
      </div>
      <FeedbackTable />
    </div>
  );
}
