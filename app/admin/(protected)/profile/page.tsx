import { Metadata } from "next";
import { ProfileSection } from "./_components/ProfileSection";
import { ProfileForm } from "./_components/ProfileForm";
import { PasswordForm } from "./_components/PasswordForm";
import { DeleteAccountSection } from "./_components/DeleteAccountSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Admin Profile Settings",
};

export default function AdminProfilePage() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Profile Settings", current: true },
  ];

  return (
    <div className="min-h-[100dvh] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="space-y-12">
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

          {/* Delete Account Section */}
          <ProfileSection
            description="Permanently delete your account and all associated data."
            title="Delete Account"
          >
            <DeleteAccountSection />
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}
