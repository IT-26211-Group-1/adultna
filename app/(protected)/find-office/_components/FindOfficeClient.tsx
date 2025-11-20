"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Coordinates } from "@/utils/distance";
import OfficeSidebar from "./OfficeSidebar";
import OfficeMap from "./OfficeMap";
import { usePlacesSearch } from "../../../../hooks/usePlacesSearch";

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
        console.warn("Could not get user location:", error);
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
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">AdultNa.</h1>
          <div className="w-10 h-10 bg-adult-green rounded-full flex items-center justify-center text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <OfficeSidebar
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
    </div>
  );
}
