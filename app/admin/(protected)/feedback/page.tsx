import React from "react";
import AddFeedbackButton from "./_components/AddFeedbackButton";
import FeedbackTable from "./_components/FeedbackTable";

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AddFeedbackButton />
      </div>
      <FeedbackTable />
    </div>
  );
}
