"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/register");
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
          { method: "POST" }
        );

        if (!res.ok) {
          const errorText = await res.text();
          setMessage(errorText || "Verification failed");
          return;
        }

        const data = await res.json();

        setMessage(data.message || "Verification completed");

        if (data.success) {
          router.push("/login");
        }
      } catch {
        setMessage("Verification failed");
      }
    };

    verifyEmail();
  }, [token, router]);

  return <p>{message}</p>;
}
