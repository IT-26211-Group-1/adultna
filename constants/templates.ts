export type TemplateId = "classic" | "modern" | "minimal" | "creative" | "professional";

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
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout with professional serif fonts",
    layoutType: "single-column",
    colorScheme: "#1e3a8a",
    fontFamily: "Georgia, serif",
    previewImageUrl: "/templates/classic-preview.png",
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Clean two-column design with contemporary sans-serif typography",
    layoutType: "two-column",
    colorScheme: "#0891b2",
    fontFamily: "Inter, sans-serif",
    previewImageUrl: "/templates/modern-preview.png",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Simplistic single-column layout with thin, elegant fonts",
    layoutType: "single-column",
    colorScheme: "#000000",
    fontFamily: "Helvetica Neue, sans-serif",
    previewImageUrl: "/templates/minimal-preview.png",
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Unique asymmetric layout with modern styling for creative professionals",
    layoutType: "asymmetric",
    colorScheme: "#7c3aed",
    fontFamily: "Poppins, sans-serif",
    previewImageUrl: "/templates/creative-preview.png",
  },
  professional: {
    id: "professional",
    name: "Professional",
    description: "Balanced two-column format ideal for corporate and business roles",
    layoutType: "two-column",
    colorScheme: "#1e40af",
    fontFamily: "Roboto, sans-serif",
    previewImageUrl: "/templates/professional-preview.png",
  },
};

export const TEMPLATE_IDS: TemplateId[] = ["classic", "modern", "minimal", "creative", "professional"];

export const TEMPLATE_LIST: Template[] = TEMPLATE_IDS.map(id => TEMPLATES[id]);

export const isValidTemplateId = (id: string): id is TemplateId => {
  return TEMPLATE_IDS.includes(id as TemplateId);
};

export const getTemplate = (id: TemplateId): Template => {
  return TEMPLATES[id];
};
