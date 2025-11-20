import { Metadata } from "next";
import FindOfficeClient from "./_components/FindOfficeClient";

export const metadata: Metadata = {
  title: "Find Government Office | AdultNa",
  description:
    "Find the nearest government office locations in the Philippines",
};

export default function FindOfficePage() {
  return <FindOfficeClient />;
}
