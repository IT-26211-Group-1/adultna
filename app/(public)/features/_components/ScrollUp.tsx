import { useEffect, useState, useRef } from "react";

export function ScrollUp() {
    const SCROLL_THRESHOLD_ID = "feature-nav"; // The id of FeatureNav.tsx root element

    const buttonStyle: React.CSSProperties = {
        position: "fixed",
        bottom: "3rem",
        right: "3rem",
        zIndex: 1000,
        padding: "0.75rem 1rem",
        borderRadius: "9999px",
        background: "#ACBD6F",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 3px 5px rgba(0,0,0,0.3)",
        fontSize: "1rem",
        transition: "opacity 0.3s",
    };

    function useShowScrollUp(thresholdId: string) {
        const [show, setShow] = useState(false);
        const thresholdRef = useRef<HTMLElement | null>(null);

        useEffect(() => {
            thresholdRef.current = document.getElementById(thresholdId);

            function onScroll() {
                if (!thresholdRef.current) return setShow(false);
                const rect = thresholdRef.current.getBoundingClientRect();
                setShow(rect.bottom < 0);
            }

            window.addEventListener("scroll", onScroll);
            onScroll();

            return () => window.removeEventListener("scroll", onScroll);
        }, [thresholdId]);

        return show;
    }

    const show = useShowScrollUp(SCROLL_THRESHOLD_ID);

    return (
        show && (
            <button
                style={buttonStyle}
                aria-label="Scroll to top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
            </button>
        )
    );
}