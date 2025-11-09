type ExportButtonProps = {
  onExport: () => void;
  isExporting: boolean;
};

export function ExportButton({ onExport, isExporting }: ExportButtonProps) {
  return (
    <button
      onClick={onExport}
      disabled={isExporting}
      className="px-4 py-2 bg-[#11553F] hover:bg-[#0e4634] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isExporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          Exporting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </>
      )}
    </button>
  );
}
