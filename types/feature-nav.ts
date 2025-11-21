export type FeatureNavProps = {
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
};

export type NavItem = {
  label: string;
  target: string;
};
