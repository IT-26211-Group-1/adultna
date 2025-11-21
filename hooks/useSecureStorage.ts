"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { logger } from "@/lib/logger";

export function useSecureStorage() {
  const encrypt = useCallback((data: string): string => {
    return btoa(encodeURIComponent(data));
  }, []);

  const decrypt = useCallback((data: string): string => {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return "";
    }
  }, []);

  const setSecureItem = useCallback(
    (key: string, value: string, expiryMinutes: number = 30) => {
      const expiry = Date.now() + expiryMinutes * 60 * 1000;
      const secureData = {
        value: encrypt(value),
        expiry,
        checksum: btoa(encodeURIComponent(value + expiry.toString())).slice(
          0,
          8,
        ),
      };

      try {
        sessionStorage.setItem(`secure_${key}`, JSON.stringify(secureData));
        window.dispatchEvent(
          new CustomEvent(`secureStorage:${key}`, { detail: value }),
        );
      } catch (error) {
        logger.warn("Failed to store secure data:", error);
      }
    },
    [encrypt],
  );

  const getSecureItem = useCallback(
    (key: string): string | null => {
      try {
        const stored = sessionStorage.getItem(`secure_${key}`);

        if (!stored) return null;

        const secureData = JSON.parse(stored);

        // Check expiry
        if (Date.now() > secureData.expiry) {
          sessionStorage.removeItem(`secure_${key}`);

          return null;
        }

        const decryptedValue = decrypt(secureData.value);

        // Verify integrity
        const expectedChecksum = btoa(
          encodeURIComponent(decryptedValue + secureData.expiry.toString()),
        ).slice(0, 8);

        if (expectedChecksum !== secureData.checksum) {
          logger.warn("Data integrity check failed");
          sessionStorage.removeItem(`secure_${key}`);

          return null;
        }

        return decryptedValue;
      } catch (error) {
        logger.warn("Failed to retrieve secure data:", error);

        return null;
      }
    },
    [decrypt],
  );

  const removeSecureItem = useCallback((key: string) => {
    sessionStorage.removeItem(`secure_${key}`);
  }, []);

  const clearAllSecure = useCallback(() => {
    const keys = Object.keys(sessionStorage);

    keys.forEach((key) => {
      if (key.startsWith("secure_")) {
        sessionStorage.removeItem(key);
      }
    });
  }, []);

  return {
    setSecureItem,
    getSecureItem,
    removeSecureItem,
    clearAllSecure,
  };
}

// Hook to listen to secure storage changes
export function useSecureStorageListener(key: string) {
  const [value, setValue] = useState<string | null>(null);
  const { getSecureItem } = useSecureStorage();
  const initialized = useRef(false);

  // Initialize value on first render
  if (!initialized.current) {
    initialized.current = true;
    setValue(getSecureItem(key));
  }

  useEffect(() => {
    // Listen for changes
    const handleStorageChange = (event: CustomEvent) => {
      setValue(event.detail);
    };

    const eventName = `secureStorage:${key}`;

    window.addEventListener(eventName, handleStorageChange as EventListener);

    return () => {
      window.removeEventListener(
        eventName,

        handleStorageChange as EventListener,
      );
    };
  }, [key]);

  return value;
}
