import { ResumeData } from "@/validators/resumeSchema";

type TemplateProps = {
  resumeData: ResumeData & { colorHex?: string };
  formatDate: (dateValue: any) => string;
};

export default function ReverseChronologicalTemplate({
  resumeData,
  formatDate,
}: TemplateProps) {
  const accentColor = resumeData.colorHex || "#FF8C00";

  return (
    <div className="bg-white p-10 space-y-4 text-black">
      {/* Name - Large Orange */}
      <h1
        className="text-4xl font-bold uppercase tracking-wide"
        style={{ color: accentColor }}
      >
        {resumeData.firstName} {resumeData.lastName}
      </h1>

      {/* Contact Header - Black Background */}
      <div className="bg-black text-white py-2 px-4 text-xs">
        {resumeData.city && resumeData.region && (
          <span>
            {resumeData.city}, {resumeData.region}
          </span>
        )}
        {(resumeData.city || resumeData.region) && resumeData.phone && (
          <span> | </span>
        )}
        {resumeData.phone && <span>{resumeData.phone}</span>}
        {resumeData.phone && resumeData.email && <span> | </span>}
        {resumeData.email && <span>{resumeData.email}</span>}
      </div>

      {/* Professional Summary */}
      {resumeData.summary && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold">Professional Summary</h2>
          <p className="text-xs text-justify leading-relaxed">
            {resumeData.summary}
          </p>
        </div>
      )}

      {/* Work History */}
      {resumeData.workExperiences && resumeData.workExperiences.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold">Work History</h2>
          {resumeData.workExperiences.map((work, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold">{work.jobTitle}</h3>
                <span className="text-xs text-gray-600 whitespace-nowrap ml-4">
                  {work.startDate && formatDate(work.startDate)}
                  {work.endDate || work.isCurrentlyWorkingHere
                    ? ` to ${work.isCurrentlyWorkingHere ? "Current" : formatDate(work.endDate)}`
                    : ""}
                </span>
              </div>
              <div className="text-xs font-semibold">{work.employer}</div>
              {work.description && (
                <ul className="text-xs leading-snug list-disc pl-5 space-y-0.5">
                  {work.description.split("\n").map((line, i) => (
                    line.trim() && <li key={i}>{line.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold">Skills</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs list-disc pl-5">
            {resumeData.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {resumeData.educationItems && resumeData.educationItems.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold">Education</h2>
          {resumeData.educationItems.map((edu, index) => (
            <div key={index}>
              <h3 className="text-xs font-bold">
                {edu.degree}
                {edu.degree && edu.fieldOfStudy && ": "}
                {edu.fieldOfStudy}
              </h3>
              <div className="text-xs font-semibold">
                {edu.schoolName}
                {edu.schoolName && edu.schoolLocation && " - "}
                {edu.schoolLocation}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resumeData.certificates && resumeData.certificates.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold">Certifications</h2>
          <ul className="text-xs list-disc pl-5 space-y-0.5">
            {resumeData.certificates.map((cert, index) => (
              <li key={index}>
                {cert.certificate}
                {cert.issuingOrganization && ` - ${cert.issuingOrganization}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
