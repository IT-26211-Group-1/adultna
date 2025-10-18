import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import Infotech from "../fields/infotech";
import Arts from "../fields/arts";
import Bsman from "../fields/bsman";
import Comms from "../fields/comms";
import Educ from "../fields/educ";
import Tours from "../fields/tours";

const componentsBySlug: Record<string, ComponentType> = {
  infotech: Infotech,
  arts: Arts,
  bsman: Bsman,
  comms: Comms,
  educ: Educ,
  tours: Tours,
};


export function generateStaticParams() {
  return Object.keys(componentsBySlug).map((slug) => ({ slug }));
}

export default async function FieldPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const Component = componentsBySlug[slug];
  if (!Component) return notFound();

  return <Component />;
}
