import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth/loginService";
import { LoginPayload } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (data: LoginPayload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await loginUser(data);
        if (!res.success) throw new Error(res.message || "Login failed");
        router.push("/home");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return { login, loading, error };
}
