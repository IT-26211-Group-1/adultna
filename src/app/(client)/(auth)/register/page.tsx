import React, { Suspense } from "react";
import { RegisterForm } from "./_components/RegisterForm";
import Loading from "./Loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterForm />
    </Suspense>
  );
}
