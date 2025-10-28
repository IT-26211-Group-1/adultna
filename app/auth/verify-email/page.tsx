import { Suspense } from "react";
import { VerifyEmailLayout } from "./_components/VerifyEmailLayout";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* TODO: Update whenever loading animation is finished */}
      <VerifyEmailLayout />
    </Suspense>
  );
}
