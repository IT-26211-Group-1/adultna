"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckInbox() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("emailVerified") === "true") {
        localStorage.removeItem("emailVerified");
        router.push("/onboarding");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return <p>Please check your email to verify your account.</p>;
}
