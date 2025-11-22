import { FileBoxSkeleton } from "./FileBoxSkeleton";

type LoadingStateProps = {
  viewType: "grid" | "list";
};

export function LoadingState({ viewType }: LoadingStateProps) {
  return <FileBoxSkeleton viewType={viewType} />;
}
