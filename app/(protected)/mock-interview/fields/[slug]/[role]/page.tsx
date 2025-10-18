import Interview from "../../_components/Interview";

// Mapping of slugs to their respective role arrays - renders the same interview component for each role
const rolesBySlug: Record<string, string[]> = {
    // the roles available for the infotech field
    infotech: [
        "web-developer",
        "software-engineer",
        "cybersecurity-specialist",
        "data-analyst",
        "it-support",
        "ui-ux-designer",
        "project-management",
        "general-interview",
    ],
    // the roles available for the arts field
    arts: [
        "graphic-designer",
        "illustrator",
        "art-director",
        "fashion-designer",
        "interior-designer",
        "animator",
        "photographer",
        "general-interview",
    ],
    // the roles available for the business management field
    bsman: [
        "marketing-manager",
        "sales-manager",
        "financial-analyst",
        "hr-specialist",
        "operations-manager",
        "business-consultant",
        "project-coordinator",
        "general-interview",
    ],
    // the roles available for the communications field
    comms: [
        "public-relations-specialist",
        "content-writer",
        "social-media-manager",
        "media-planner",
        "advertising-executive",
        "communications-coordinator",
        "event-planner",
        "general-interview",
    ],
    // the roles available for the education field
    educ: [
        "elementary-teacher",
        "high-school-teacher",
        "special-education-teacher",
        "school-counselor",
        "curriculum-developer",
        "education-administrator",
        "tutor",
        "general-interview",
    ],
    // the roles available for the tourism & hospitality field
    tours: [
        "hotel-manager",
        "travel-agent",
        "tour-guide",
        "event-coordinator",
        "restaurant-manager",
        "customer-service-representative",
        "concierge",
        "general-interview",
    ],
  // the general field maps directly to a single generic interview
  general: ["general-interview"],
};

export function generateStaticParams() {
  const paths: { slug: string; role: string }[] = [];

  for (const [slug, roles] of Object.entries(rolesBySlug)) {
    for (const role of roles) paths.push({ slug, role });
  }

  return paths;
}

export default async function RoleInterviewPage({
  params,
}: {
  params: Promise<{ slug: string; role: string }>;
}) {
  const { slug, role } = await params;

  return <Interview slug={slug} role={role} />;
}
