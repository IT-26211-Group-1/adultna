"use client";

import { Suspense, lazy, useSyncExternalStore, useState } from "react";

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
  const [load3D, setLoad3D] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center relative mt-10 md:mt-0">
      {showSpline ? (
        <div className="relative w-[300px] md:w-[400px] h-[300px]">
          {load3D ? (
            <Suspense
              fallback={
                <div className="w-full h-full bg-slate-200 rounded-xl animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-adult-green rounded-full animate-spin" />
                </div>
              }
            >
              <Spline scene="https://prod.spline.design/bVl9NIhxjaYGVL1N/scene.splinecode" />
            </Suspense>
          ) : (
            <div
              className="relative w-full h-full group cursor-pointer"
              onClick={() => setLoad3D(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-adult-green/20 to-adult-green/5 rounded-xl" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 bg-adult-green rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-adult-green">
                  Click to view 3D
                </p>
              </div>
              <div className="absolute inset-0 bg-slate-400 rounded-full blur-3xl opacity-20" />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
