import { FEATURES } from "@/config/features";

export function FeaturesGrid() {
  return (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">
      {FEATURES.map(({ id, component: Component }) => (
        <div key={id} id={id}>
          <Component />
        </div>
      ))}
    </div>
  );
}
