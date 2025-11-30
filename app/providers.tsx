"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

function LanguageProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={children}>
      <LanguageProvider>{children}</LanguageProvider>
    </React.Suspense>
  );
}

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? React.lazy(() =>
        import("@tanstack/react-query-devtools").then((mod) => ({
          default: mod.ReactQueryDevtools,
        })),
      )
    : () => null;

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't apply regular AuthProvider to admin routes
  const isAdminRoute = pathname?.startsWith("/admin");

  const content = (
    <HeroUIProvider navigate={router.replace}>
      <NextThemesProvider {...themeProps}>
        <LanguageProviderWrapper>
          <div className="fixed z-[100]">
            <ToastProvider placement="bottom-right" toastOffset={0} />
          </div>
          {children}
        </LanguageProviderWrapper>
      </NextThemesProvider>
    </HeroUIProvider>
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isAdminRoute ? (
        <>
          {content}
          {process.env.NODE_ENV === "development" && (
            <React.Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </React.Suspense>
          )}
        </>
      ) : (
        <AuthProvider>
          {content}
          {process.env.NODE_ENV === "development" && (
            <React.Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} />
            </React.Suspense>
          )}
        </AuthProvider>
      )}
    </QueryClientProvider>
  );
}
