"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";

export function ProfilePicture() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Profile Picture Display */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {imagePreview ? (
            <Image
              alt="Profile"
              className="w-full h-full object-cover"
              height={80}
              src={imagePreview}
              width={80}
            />
          ) : (
            <span className="text-2xl text-gray-400 font-semibold"></span>
          )}
        </div>

        {/* Upload Button Overlay */}
        <label
          className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          htmlFor="profile-picture-upload"
        >
          <Camera className="w-4 h-4 text-gray-600" />
        </label>

        <input
          accept="image/png , image/jpeg*"
          className="hidden"
          id="profile-picture-upload"
          type="file"
          onChange={handleImageChange}
        />
      </div>

      {/* Upload Instructions */}
      <div>
        <p className="text-sm text-gray-700 font-medium">Profile Picture</p>
        <p className="text-xs text-gray-500 mt-0.5">
          JPG, JPEG, or PNG (max. 2MB)
        </p>
      </div>
    </div>
  );
}
