"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";

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
  const isAdminRoute = pathname?.startsWith('/admin');

  const content = (
    <HeroUIProvider navigate={router.replace}>
      <NextThemesProvider {...themeProps}>
        <div className="fixed z-[100]">
          <ToastProvider placement="bottom-right" toastOffset={0} />
        </div>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isAdminRoute ? (
        <>
          {content}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </>
      ) : (
        <AuthProvider>
          {content}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </AuthProvider>
      )}
    </QueryClientProvider>
  );
}
