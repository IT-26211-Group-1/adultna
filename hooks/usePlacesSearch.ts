import { useState, useCallback } from "react";
import { Coordinates } from "@/utils/distance";
import { calculateDistance } from "@/utils/distance";
import { OfficeLocation } from "../app/(protected)/find-office/_components/FindOfficeClient";

declare global {
  interface Window {
    google: any;
  }
}

export function usePlacesSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaces = useCallback(
    async (
      query: string,
      userLocation?: Coordinates | null
    ): Promise<OfficeLocation[]> => {
      if (!query || !window.google) {
        return [];
      }

      setIsSearching(true);
      setError(null);

      try {
        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );

        const searchQuery = `${query} office Philippines`;

        return new Promise((resolve) => {
          service.textSearch(
            {
              query: searchQuery,
              location: userLocation
                ? new window.google.maps.LatLng(
                    userLocation.latitude,
                    userLocation.longitude
                  )
                : new window.google.maps.LatLng(14.5995, 120.9842),
              radius: 50000,
            },
            (results: any[], status: any) => {
              setIsSearching(false);

              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                const offices: OfficeLocation[] = results.map((place: any) => {
                  const coordinates: Coordinates = {
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                  };

                  const distance = userLocation
                    ? calculateDistance(userLocation, coordinates)
                    : undefined;

                  return {
                    name: place.name,
                    agency: query,
                    address: place.formatted_address || place.vicinity || "",
                    coordinates,
                    distance,
                  };
                });

                offices.sort((a, b) => {
                  if (a.distance === undefined) return 1;
                  if (b.distance === undefined) return -1;

                  return a.distance - b.distance;
                });

                resolve(offices);
              } else {
                setError("No offices found. Try a different search term.");
                resolve([]);
              }
            }
          );
        });
      } catch {
        setIsSearching(false);
        setError("Failed to search for offices");

        return [];
      }
    },
    []
  );

  return { searchPlaces, isSearching, error };
}
