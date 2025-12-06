"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { OfficeInfo } from "@/types/govguide";
import { calculateDistance, Coordinates } from "@/utils/distance";
import { logger } from "@/lib/logger";

type OfficeMapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  office: OfficeInfo | undefined;
};

type OfficeLocation = {
  address: string;
  coordinates?: Coordinates;
  distance?: number;
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
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);
  const [nearestLocations, setNearestLocations] = useState<OfficeLocation[]>(
    [],
  );

  useEffect(() => {
    if (!isOpen || !office) return;

    const getUserLocation = () => {
      return new Promise<Coordinates>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));

          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      });
    };

    const fetchUserLocation = async () => {
      try {
        const location = await getUserLocation();

        setUserLocation(location);
        setLocationPermissionDenied(false);
      } catch (err) {
        logger.warn("Could not get user location:", err);
        setLocationPermissionDenied(true);
      }
    };

    fetchUserLocation();
  }, [isOpen, office]);

  useEffect(() => {
    if (!isOpen || !mapRef.current || !office) return;

    let isMounted = true;
    let mapInstance: any = null;

    const loadGoogleMaps = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google) {
          resolve();

          return;
        }

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
        if (!isMounted) return;

        setIsLoading(true);
        setError(null);

        await loadGoogleMaps();

        if (!isMounted || !mapRef.current) return;

        const philippines = { lat: 14.5995, lng: 120.9842 };

        mapInstance = new window.google.maps.Map(mapRef.current, {
          center: philippines,
          zoom: 12,
        });

        const bounds = new window.google.maps.LatLngBounds();
        let hasMarkers = false;

        if (userLocation) {
          const userMarker = new window.google.maps.Marker({
            map: mapInstance,
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

          bounds.extend(userMarker.getPosition()!);
          hasMarkers = true;
        }

        if (office.locations && office.locations.length > 0) {
          const geocoder = new window.google.maps.Geocoder();
          const officeLocations: OfficeLocation[] = [];

          const geocodePromises = office.locations.map((location) => {
            return new Promise<OfficeLocation>((resolve) => {
              if (office.latitude && office.longitude) {
                resolve({
                  address: location,
                  coordinates: {
                    latitude: office.latitude,
                    longitude: office.longitude,
                  },
                });
              } else {
                geocoder.geocode(
                  { address: location },
                  (results: any, status: any) => {
                    if (status === "OK" && results && results[0]) {
                      const position = results[0].geometry.location;

                      resolve({
                        address: location,
                        coordinates: {
                          latitude: position.lat(),
                          longitude: position.lng(),
                        },
                      });
                    } else {
                      resolve({ address: location });
                    }
                  },
                );
              }
            });
          });

          const geocodedLocations = await Promise.all(geocodePromises);

          if (!isMounted) return;

          for (const loc of geocodedLocations) {
            if (loc.coordinates) {
              if (userLocation) {
                loc.distance = calculateDistance(userLocation, loc.coordinates);
              }
              officeLocations.push(loc);
            }
          }

          officeLocations.sort((a, b) => {
            if (a.distance === undefined) return 1;
            if (b.distance === undefined) return -1;

            return a.distance - b.distance;
          });

          const locationsToShow = userLocation
            ? officeLocations.slice(0, 10)
            : officeLocations;

          setNearestLocations(locationsToShow);

          for (const loc of locationsToShow) {
            if (loc.coordinates) {
              const marker = new window.google.maps.Marker({
                map: mapInstance,
                position: {
                  lat: loc.coordinates.latitude,
                  lng: loc.coordinates.longitude,
                },
                title: `${office.issuingAgency} - ${loc.address}`,
              });

              bounds.extend(marker.getPosition()!);
              hasMarkers = true;
            }
          }
        } else {
          const searchQuery = `${office.issuingAgency} Philippines`;
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            { address: searchQuery },
            (results: any, status: any) => {
              if (status === "OK" && results && results[0] && isMounted) {
                const position = results[0].geometry.location;

                mapInstance.setCenter(position);
                mapInstance.setZoom(14);

                new window.google.maps.Marker({
                  map: mapInstance,
                  position,
                  title: office.issuingAgency,
                });
              }
            },
          );
        }

        if (hasMarkers && isMounted) {
          mapInstance.fitBounds(bounds);
          window.google.maps.event.addListenerOnce(
            mapInstance,
            "bounds_changed",
            () => {
              if (!isMounted) return;
              const currentZoom = mapInstance.getZoom();

              if (currentZoom && currentZoom > 15) {
                mapInstance.setZoom(15);
              }
            },
          );
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          logger.error("Map initialization error:", err);
          setError("Failed to load map. Please try again.");
          setIsLoading(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance && window.google?.maps) {
        window.google.maps.event.clearInstanceListeners(mapInstance);
      }
    };
  }, [isOpen, office, userLocation]);

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
            className="w-full h-96 rounded-lg bg-gray-100 relative"
            style={{ minHeight: "400px" }}
          >
            <div
              key={`map-${isOpen}-${office?.issuingAgency}`}
              ref={mapRef}
              className="w-full h-full rounded-lg"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adult-green mx-auto mb-4" />
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {locationPermissionDenied && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              Location access denied. Showing all office locations.
            </div>
          )}

          {nearestLocations.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                {userLocation
                  ? "Nearest Office Locations:"
                  : "Office Locations:"}
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {nearestLocations.map((location, index) => (
                  <li key={index} className="flex justify-between items-start">
                    <span className="flex-1">{location.address}</span>
                    {location.distance !== undefined && (
                      <span className="ml-3 text-adult-green font-medium whitespace-nowrap">
                        {location.distance} km away
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
