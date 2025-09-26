import React, { Suspense } from "react";
import { LoginForm } from "./_components/LoginForm";
import { LoginPageSkeleton } from "./_components/LoadingSkeleton";

export default function page() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
