import { Coordinates } from "./distance";

export type GeocodeResult = {
  success: boolean;
  coordinates?: Coordinates;
  error?: string;
};

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;

  if (!apiKey) {
    return {
      success: false,
      error: "Google Maps API key not configured",
    };
  }

  if (!address || address.trim() === "") {
    return {
      success: false,
      error: "Address is empty",
    };
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;

      return {
        success: true,
        coordinates: {
          latitude: location.lat,
          longitude: location.lng,
        },
      };
    } else if (data.status === "ZERO_RESULTS") {
      return {
        success: false,
        error: "Address not found",
      };
    } else {
      return {
        success: false,
        error: `Geocoding failed: ${data.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function geocodeMultipleAddresses(
  addresses: string[],
): Promise<GeocodeResult[]> {
  const results: GeocodeResult[] = [];

  for (const address of addresses) {
    const result = await geocodeAddress(address);

    results.push(result);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return results;
}
