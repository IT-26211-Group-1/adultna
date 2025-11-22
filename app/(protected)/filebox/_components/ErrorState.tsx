type ErrorStateProps = {
  error: string;
};

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-red-500 text-center">
        <p className="mb-2">{error}</p>
      </div>
    </div>
  );
}
