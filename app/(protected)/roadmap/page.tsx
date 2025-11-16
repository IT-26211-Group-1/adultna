import { RoadmapContainer } from "./components/RoadmapContainer";

export default function RoadmapPage() {
  return (
    <>
      <div
        className="fixed inset-0 w-full h-full"
        style={{ backgroundColor: "rgba(154,205,50, 0.08)" }}
      />
      <RoadmapContainer />
    </>
  );
}
