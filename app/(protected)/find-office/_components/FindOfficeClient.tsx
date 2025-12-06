"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Coordinates } from "@/utils/distance";
import OfficeSidebar from "./OfficeSidebar";
import OfficeMap from "./OfficeMap";
import { usePlacesSearch } from "../../../../hooks/usePlacesSearch";
import { logger } from "@/lib/logger";

export type OfficeLocation = {
  name: string;
  agency: string;
  address: string;
  coordinates?: Coordinates;
  distance?: number;
};

export default function FindOfficeClient() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const guideTitle = searchParams.get("guide") || "";
  const guideSlug = searchParams.get("slug") || "";

  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation | null>(
    null
  );
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const { searchPlaces, isSearching } = usePlacesSearch();

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          }
        );

        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setUserLocation(location);
      } catch (error) {
        logger.warn("Could not get user location:", error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (initialSearch && !isLoadingLocation) {
        const results = await searchPlaces(initialSearch, userLocation);

        setOffices(results);
      }
    };

    performSearch();
  }, [initialSearch, isLoadingLocation, userLocation, searchPlaces]);

  return (
    <div className="h-screen flex overflow-hidden">
      <OfficeSidebar
        guideSlug={guideSlug}
        guideTitle={guideTitle}
        initialSearch={initialSearch}
        isLoadingLocation={isLoadingLocation || isSearching}
        offices={offices}
        selectedOffice={selectedOffice}
        onOfficeSelect={setSelectedOffice}
        onSearch={async (query) => {
          const results = await searchPlaces(query, userLocation);

          setOffices(results);
        }}
      />

      <OfficeMap
        offices={offices}
        selectedOffice={selectedOffice}
        userLocation={userLocation}
      />
    </div>
  );
}
