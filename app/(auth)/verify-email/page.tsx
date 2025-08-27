import { Suspense } from "react";
import VerifyEmail from "./_components/VerifyEmail";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* TODO: Update whenever loading animation is finished */}
      <VerifyEmail />
    </Suspense>
  );
}
