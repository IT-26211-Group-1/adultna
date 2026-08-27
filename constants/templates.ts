export type TemplateId =
  | "reverse-chronological"
  | "modern"
  | "skill-based"
  | "hybrid"
  | "harvard";

export type LayoutType = "single-column" | "two-column" | "asymmetric";

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
  layoutType: LayoutType;
  colorScheme: string;
  fontFamily: string;
  previewImageUrl: string;
};

export const TEMPLATES: Record<TemplateId, Template> = {
  "reverse-chronological": {
    id: "reverse-chronological",
    name: "Reverse-Chronological",
    description: "Traditional layout with orange accents and black contact bar",
    layoutType: "single-column",
    colorScheme: "#FF8C00",
    fontFamily: "Arial, sans-serif",
    previewImageUrl: "/templates/Reverse-CHronological.png",
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Two-column design with timeline and icon-based sections",
    layoutType: "two-column",
    colorScheme: "#000000",
    fontFamily: "Inter, sans-serif",
    previewImageUrl: "/templates/Modern.png",
  },
  "skill-based": {
    id: "skill-based",
    name: "Skill-based",
    description: "Centered layout emphasizing skills with burgundy accents",
    layoutType: "single-column",
    colorScheme: "#A64D79",
    fontFamily: "Georgia, serif",
    previewImageUrl: "/templates/Skill-based.png",
  },
  hybrid: {
    id: "hybrid",
    name: "Hybrid",
    description: "Date-based layout with skill bars and icon sections",
    layoutType: "asymmetric",
    colorScheme: "#7c3aed",
    fontFamily: "Arial, sans-serif",
    previewImageUrl: "/templates/Hybrid.png",
  },
  harvard: {
    id: "harvard",
    name: "Harvard",
    description: "Clean, minimal academic style with bold section headers and classic serif typography",
    layoutType: "single-column",
    colorScheme: "#000000",
    fontFamily: "Georgia, serif",
    previewImageUrl: "/templates/Harvard.png",
  },
};

export const TEMPLATE_IDS: TemplateId[] = [
  "reverse-chronological",
  "modern",
  "skill-based",
  "hybrid",
  "harvard",
];

export const TEMPLATE_LIST: Template[] = TEMPLATE_IDS.map(
  (id) => TEMPLATES[id],
);

export const isValidTemplateId = (id: string): id is TemplateId => {
  return TEMPLATE_IDS.includes(id as TemplateId);
};

export const getTemplate = (id: TemplateId | string): Template => {
  return TEMPLATES[id as TemplateId] || TEMPLATES["reverse-chronological"];
};
