import JobBoard from "./_components/JobBoard";
import ProtectedPageWrapper from "../../../components/ui/ProtectedPageWrapper";

export default function Page() {
  return (
    <ProtectedPageWrapper>
      <div className="p-6 px-8 max-w-7xl mx-auto">
        <JobBoard />
      </div>
    </ProtectedPageWrapper>
  );
}
