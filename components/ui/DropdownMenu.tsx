"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { DropdownMenuProps } from "@/types/table";

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = "right",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: "top" | "bottom";
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideTrigger = dropdownRef.current?.contains(target);
      const clickedInsideMenu = menuRef.current?.contains(target);

      if (!clickedInsideTrigger && !clickedInsideMenu) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Compute menu placement and coordinates when opening or viewport changes
  useEffect(() => {
    if (!isOpen) return;

    const MENU_WIDTH = 192; // w-48
    const MENU_HEIGHT_ESTIMATE = 200; // rough estimate for flip logic
    const GAP = 8;

    const computePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();

      if (!rect) return;
      const willOverflowBottom =
        rect.bottom + MENU_HEIGHT_ESTIMATE > window.innerHeight - GAP;
      const placement = willOverflowBottom ? "top" : "bottom";

      let top =
        placement === "bottom"
          ? rect.bottom + GAP
          : rect.top - MENU_HEIGHT_ESTIMATE - GAP;
      // Compute left based on alignment with viewport clamping
      let left = align === "left" ? rect.left : rect.right - MENU_WIDTH;

      left = Math.max(
        GAP,
        Math.min(left, window.innerWidth - MENU_WIDTH - GAP),
      );

      setCoords({ top, left, placement });
    };

    computePosition();
    window.addEventListener("scroll", computePosition, true);
    window.addEventListener("resize", computePosition);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", computePosition, true);
      window.removeEventListener("resize", computePosition);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, align]);

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
      >
        {trigger}
      </div>

      {isOpen &&
        coords &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            style={{
              top: coords.top,
              left: coords.left,
              maxHeight:
                coords.placement === "bottom"
                  ? Math.max(
                      120,
                      window.innerHeight -
                        (triggerRef.current?.getBoundingClientRect().bottom ||
                          0) -
                        16,
                    )
                  : Math.max(
                      120,
                      (triggerRef.current?.getBoundingClientRect().top || 0) -
                        16,
                    ),
              overflowY: "auto",
            }}
          >
            <div className="py-1" role="menu">
              {items.map((item, index) => (
                <button
                  key={index}
                  className={`
                    flex w-full items-center px-4 py-2 text-sm text-left hover:bg-gray-100 
                    ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    ${item.destructive ? "text-red-600 hover:text-red-700" : "text-gray-700"}
                  `}
                  disabled={item.disabled}
                  role="menuitem"
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.label}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default DropdownMenu;
