import { Metadata } from "next";
import { ProfileSection } from "./_components/ProfileSection";
import { ProfileForm } from "./_components/ProfileForm";
import { PasswordForm } from "./_components/PasswordForm";

export const metadata: Metadata = {
  title: "Profile Settings",
};

export default function ProfilePage() {
  return (
    <div className="min-h-[100dvh] bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Profile Information Section */}
        <ProfileSection
          description="Update your account's profile information and email address."
          title="Profile Information"
        >
          <ProfileForm />
        </ProfileSection>

        {/* Update Password Section */}
        <ProfileSection
          description="Ensure your account is using a long, random password to stay secure."
          title="Update Password"
        >
          <PasswordForm />
        </ProfileSection>
      </div>
    </div>
  );
}
