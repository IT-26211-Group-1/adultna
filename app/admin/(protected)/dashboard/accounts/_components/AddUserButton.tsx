"use client";
import React, { useState } from "react";
import { AddUserModal } from "./AddUserModal";

export default function AddUserButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded"
        onClick={() => setOpen(true)}
      >
        + Add User
      </button>

      <AddUserModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
