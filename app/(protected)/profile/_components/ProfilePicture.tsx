"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2, Upload, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/queries/useAuthQueries";
import { useUploadProfilePicture } from "@/hooks/queries/useProfileQueries";
import { addToast } from "@heroui/toast";

type ProfilePictureProps = {
  onImageChange?: () => void;
};

export function ProfilePicture({ onImageChange }: ProfilePictureProps) {
  const { user } = useAuth();
  const uploadProfilePicture = useUploadProfilePicture();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.profilePictureUrl) {
      setImagePreview(user.profilePictureUrl);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleUploadClick = () => {
    setShowMenu(false);
    fileInputRef.current?.click();
  };

  const handleRemoveClick = () => {
    setShowMenu(false);
    setImagePreview(null);
    onImageChange?.();
    addToast({ title: "Profile picture removed", color: "success" });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast({ title: "File size must be less than 2MB", color: "danger" });

      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      addToast({
        title: "Only JPG and PNG files are allowed",
        color: "danger",
      });

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    try {
      await uploadProfilePicture.mutateAsync({
        fileExtension: extension,
        file,
      });
      onImageChange?.();
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      if (user?.profilePictureUrl) {
        setImagePreview(user.profilePictureUrl);
      } else {
        setImagePreview(null);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Profile Picture Display */}
      <div ref={menuRef} className="relative">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center relative">
          {imagePreview ? (
            <Image
              fill
              alt="Profile"
              className="object-cover"
              sizes="80px"
              src={imagePreview}
            />
          ) : (
            <span className="text-2xl text-gray-400 font-semibold" />
          )}
          {uploadProfilePicture.isPending && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full z-10">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Camera Button */}
        <button
          className={`absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 ${
            uploadProfilePicture.isPending
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-gray-50"
          } transition-colors`}
          disabled={uploadProfilePicture.isPending}
          type="button"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Camera className="w-4 h-4 text-gray-600" />
        </button>

        {/* Menu */}
        {showMenu && (
          <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[180px]">
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              type="button"
              onClick={handleUploadClick}
            >
              <Upload className="w-4 h-4 text-gray-500" />
              Upload Picture
            </button>
            {imagePreview && (
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600"
                type="button"
                onClick={handleRemoveClick}
              >
                <Trash2 className="w-4 h-4" />
                Remove Picture
              </button>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          accept="image/png, image/jpeg"
          className="hidden"
          disabled={uploadProfilePicture.isPending}
          type="file"
          onChange={handleImageChange}
        />
      </div>

      {/* Upload Instructions */}
      <div>
        <p className="text-sm text-gray-700 font-medium">Profile Picture</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {uploadProfilePicture.isPending
            ? "Uploading..."
            : "JPG, JPEG, or PNG (max. 2MB)"}
        </p>
      </div>
    </div>
  );
}
