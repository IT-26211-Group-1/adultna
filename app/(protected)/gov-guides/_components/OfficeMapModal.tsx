"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { OfficeInfo } from "@/types/govguide";

type OfficeMapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  office: OfficeInfo | undefined;
};

declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

export default function OfficeMapModal({
  isOpen,
  onClose,
  office,
}: OfficeMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !mapRef.current || !office) return;

    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google) {
          resolve();

          return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]',
        );

        if (existingScript) {
          existingScript.addEventListener("load", () => resolve());

          return;
        }

        const script = document.createElement("script");

        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await loadGoogleMaps();

        const philippines = { lat: 14.5995, lng: 120.9842 };
        const map = new window.google.maps.Map(mapRef.current, {
          center: philippines,
          zoom: 12,
        });

        if (office.locations && office.locations.length > 0) {
          const geocoder = new window.google.maps.Geocoder();

          for (let index = 0; index < office.locations.length; index++) {
            const location = office.locations[index];

            try {
              geocoder.geocode(
                { address: location },
                (results: any, status: any) => {
                  if (status === "OK" && results && results[0]) {
                    const position = results[0].geometry.location;

                    new window.google.maps.Marker({
                      map,
                      position,
                      title: `${office.issuingAgency} - ${location}`,
                    });

                    if (index === 0) {
                      map.setCenter(position);
                      map.setZoom(15);
                    }
                  }
                },
              );
            } catch (err) {
              console.error("Geocoding error:", err);
            }
          }
        } else {
          const searchQuery = `${office.issuingAgency} Philippines`;
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            { address: searchQuery },
            (results: any, status: any) => {
              if (status === "OK" && results && results[0]) {
                const position = results[0].geometry.location;

                map.setCenter(position);
                map.setZoom(14);

                new window.google.maps.Marker({
                  map,
                  position,
                  title: office.issuingAgency,
                });
              }
            },
          );
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Map initialization error:", err);
        setError("Failed to load map. Please try again.");
        setIsLoading(false);
      }
    };

    initMap();
  }, [isOpen, office]);

  return (
    <Modal
      disableAnimation
      isOpen={isOpen}
      scrollBehavior="inside"
      size="3xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold">
            {office?.issuingAgency || "Office"} Locations
          </h3>
        </ModalHeader>
        <ModalBody className="pb-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg bg-gray-100"
            style={{ minHeight: "400px" }}
          >
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adult-green mx-auto mb-4" />
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {office?.locations && office.locations.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Office Locations:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {office.locations.map((location, index) => (
                  <li key={index}>{location}</li>
                ))}
              </ul>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
