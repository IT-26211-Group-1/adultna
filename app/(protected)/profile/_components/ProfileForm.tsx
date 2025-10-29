"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { ProfilePicture } from "./ProfilePicture";

export function ProfileForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <ProfilePicture />

      {/* Name Field */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Name
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="name"
          placeholder="Enter your name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="bg-gray-900 text-white hover:bg-gray-800 font-medium px-8"
          size="md"
        >
          SAVE
        </Button>
      </div>
    </div>
  );
}
