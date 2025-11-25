"use client";

import {
  Suspense,
  lazy,
  useSyncExternalStore,
  useState,
  useEffect,
  useRef,
} from "react";

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

function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit,
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

export function HeroIllustration() {
  const showSpline = useMediaQuery("(min-width: 768px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(containerRef);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isVisible && showSpline) {
      const timer = setTimeout(() => setShouldLoad(true), 100);

      return () => clearTimeout(timer);
    }
  }, [isVisible, showSpline]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center relative mt-10 md:mt-0"
    >
      {showSpline ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] md:w-[400px] h-[80px] md:h-[200px] bg-slate-400 rounded-full blur-2xl opacity-30" />
        </div>
      ) : null}

      {showSpline && shouldLoad ? (
        <Suspense
          fallback={
            <div className="w-[300px] md:w-[400px] h-[300px] bg-slate-200 rounded-xl animate-pulse" />
          }
        >
          <Spline scene="https://prod.spline.design/bVl9NIhxjaYGVL1N/scene.splinecode" />
        </Suspense>
      ) : showSpline ? (
        <div className="w-[300px] md:w-[400px] h-[300px] bg-slate-200 rounded-xl animate-pulse" />
      ) : null}
    </div>
  );
}
