import React, { useState, useRef, useEffect } from "react";
import { DropdownMenuProps } from "@/types/table";

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = "right",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  const alignClasses = align === "left" ? "left-0" : "right-0";

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${className}`}
    >
      <div
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

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${alignClasses}`}
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
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
