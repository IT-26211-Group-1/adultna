import { ResumeData } from "@/validators/resumeSchema";

type TemplateProps = {
  resumeData: ResumeData & { colorHex?: string };
  formatDate: (dateValue: any) => string;
};

export default function HarvardTemplate({
  resumeData,
  formatDate,
}: TemplateProps) {
  const formatBirthDate = (dateValue: any): string => {
    if (!dateValue) return "";
    try {
      if (dateValue && typeof dateValue === "object" && "year" in dateValue) {
        return new Date(
          dateValue.year,
          dateValue.month - 1,
          dateValue.day,
        ).toLocaleDateString("en-US");
      }
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("en-US");
    } catch {
      return "";
    }
  };

  const contactParts = [
    resumeData.city && resumeData.region
      ? `${resumeData.city}, ${resumeData.region}`
      : resumeData.city || resumeData.region,
    resumeData.phone,
    resumeData.email,
    resumeData.linkedin?.replace(/^https?:\/\/(www\.)?/, ""),
    resumeData.portfolio?.replace(/^https?:\/\/(www\.)?/, ""),
    resumeData.birthDate ? formatBirthDate(resumeData.birthDate) : undefined,
  ].filter(Boolean);

  return (
    <div className="bg-white text-black px-12 pt-10 pb-12 font-serif text-[11px] leading-relaxed">
      {/* Name */}
      <div className="text-center mb-1">
        <h1 className="text-2xl font-bold tracking-wide uppercase">
          {resumeData.firstName} {resumeData.lastName}
        </h1>
        {resumeData.jobPosition && (
          <p className="text-xs text-gray-700 mt-0.5">{resumeData.jobPosition}</p>
        )}
      </div>

      {/* Contact Info */}
      {contactParts.length > 0 && (
        <div className="text-center text-[10px] text-gray-700 mb-3">
          {contactParts.join("  |  ")}
        </div>
      )}

      <div className="border-b border-black mb-4" />

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-4">
          <SectionHeader title="Summary" />
          <p className="text-[11px] leading-relaxed">{resumeData.summary}</p>
        </div>
      )}

      {/* Education */}
      {resumeData.educationItems && resumeData.educationItems.length > 0 && (
        <div className="mb-4">
          <SectionHeader title="Education" />
          <div className="space-y-2.5">
            {resumeData.educationItems.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{edu.schoolName}</span>
                  {edu.schoolLocation && (
                    <span className="text-[10px] text-gray-700">{edu.schoolLocation}</span>
                  )}
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="italic">
                    {edu.degree}
                    {edu.degree && edu.fieldOfStudy && ", "}
                    {edu.fieldOfStudy}
                  </span>
                  {edu.graduationDate && (
                    <span className="text-[10px] text-gray-700">
                      {formatDate(edu.graduationDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resumeData.workExperiences && resumeData.workExperiences.length > 0 && (
        <div className="mb-4">
          <SectionHeader title="Experience" />
          <div className="space-y-3">
            {resumeData.workExperiences.map((work, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{work.employer}</span>
                  <span className="text-[10px] text-gray-700">
                    {work.startDate && formatDate(work.startDate)}
                    {(work.endDate || work.isCurrentlyWorkingHere) &&
                      ` – ${work.isCurrentlyWorkingHere ? "Present" : formatDate(work.endDate)}`}
                  </span>
                </div>
                {work.jobTitle && (
                  <p className="italic text-[11px]">{work.jobTitle}</p>
                )}
                {work.description && (
                  <ul className="mt-1 space-y-0.5 list-disc pl-5">
                    {work.description
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i}>{line.trim()}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="mb-4">
          <SectionHeader title="Skills" />
          <p>{resumeData.skills.map((s) => s.skill).join(", ")}</p>
        </div>
      )}

      {/* Certifications */}
      {resumeData.certificates && resumeData.certificates.length > 0 && (
        <div className="mb-4">
          <SectionHeader title="Certifications" />
          <ul className="list-disc pl-5 space-y-0.5">
            {resumeData.certificates.map((cert, index) => (
              <li key={index}>
                <span className="font-semibold">{cert.certificate}</span>
                {cert.issuingOrganization && ` — ${cert.issuingOrganization}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-1.5">
      <h2 className="text-[11px] font-bold uppercase tracking-widest">{title}</h2>
      <div className="border-b border-black mt-0.5" />
    </div>
  );
}
