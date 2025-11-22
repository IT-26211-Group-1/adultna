type AutoRefreshToggleProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export default function AutoRefreshToggle({
  enabled,
  onToggle,
}: AutoRefreshToggleProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      Auto-refresh (30s)
    </label>
  );
}
