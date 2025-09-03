"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export function HeroIllustration() {
  return (
    <div className="flex-1 flex items-center justify-center relative mt-10 md:mt-0">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] md:w-[400px] h-[80px] md:h-[200px] bg-slate-400 rounded-full blur-2xl opacity-30" />
      </div>
      {/* TODO: Fix the Suspense animation whenever */}
      <Suspense
        fallback={
          <div className="w-[300px] md:w-[400px] h-[300px] bg-slate-200 rounded-xl animate-pulse" />
        }
      >
        <Spline scene="https://prod.spline.design/bVl9NIhxjaYGVL1N/scene.splinecode" />
      </Suspense>
    </div>
  );
}
