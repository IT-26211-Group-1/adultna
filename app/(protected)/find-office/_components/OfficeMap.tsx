"use client";

import { useEffect, useRef, useState } from "react";
import { Coordinates } from "@/utils/distance";
import { OfficeLocation } from "./FindOfficeClient";
import { logger } from "@/lib/logger";

type OfficeMapProps = {
  userLocation: Coordinates | null;
  offices: OfficeLocation[];
  selectedOffice: OfficeLocation | null;
};

declare global {
  interface Window {
    google: any;
  }
}

export default function OfficeMap({
  userLocation,
  offices,
  selectedOffice,
}: OfficeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google) {
          resolve();

          return;
        }

        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]'
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
      if (!mapRef.current) return;

      try {
        await loadGoogleMaps();

        if (!isMounted || !mapRef.current) return;

        const philippines = { lat: 14.5995, lng: 120.9842 };
        const map = new window.google.maps.Map(mapRef.current, {
          center: userLocation
            ? { lat: userLocation.latitude, lng: userLocation.longitude }
            : philippines,
          zoom: userLocation ? 13 : 12,
        });

        setMapInstance(map);

        if (userLocation) {
          new window.google.maps.Marker({
            map,
            position: {
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            },
            title: "Your Location",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            },
          });
        }
      } catch (error) {
        logger.error("Failed to initialize map:", error);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance && window.google?.maps) {
        window.google.maps.event.clearInstanceListeners(mapInstance);
      }
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstance || !window.google) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    offices.forEach((office) => {
      if (office.coordinates) {
        const marker = new window.google.maps.Marker({
          map: mapInstance,
          position: {
            lat: office.coordinates.latitude,
            lng: office.coordinates.longitude,
          },
          title: `${office.agency} - ${office.name}`,
        });

        markersRef.current.push(marker);
      }
    });
  }, [mapInstance, offices]);

  useEffect(() => {
    if (mapInstance && selectedOffice?.coordinates) {
      mapInstance.panTo({
        lat: selectedOffice.coordinates.latitude,
        lng: selectedOffice.coordinates.longitude,
      });
      mapInstance.setZoom(15);
    }
  }, [mapInstance, selectedOffice]);

  return (
    <div className="flex-1 relative bg-white p-4">
      <div
        key="office-finder-map"
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
      />
    </div>
  );
}
