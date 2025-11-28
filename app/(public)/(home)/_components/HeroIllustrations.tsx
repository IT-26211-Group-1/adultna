"use client";

import { Suspense, lazy, useSyncExternalStore } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(query);

      mq.addEventListener("change", callback);

      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function HeroIllustration() {
  const showSpline = useMediaQuery("(min-width: 768px)");

  return (
    <div className="flex-1 flex items-center justify-center relative mt-10 md:mt-0">
      {showSpline ? (
        <div className="relative w-[300px] md:w-[400px] h-[300px] md:h-[400px]">
          <Suspense
            fallback={
              <div className="w-full h-full bg-slate-200 rounded-xl animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-adult-green rounded-full animate-spin" />
              </div>
            }
          >
            <Spline scene="https://prod.spline.design/bVl9NIhxjaYGVL1N/scene.splinecode" />
          </Suspense>
        </div>
      ) : null}
    </div>
  );
}
