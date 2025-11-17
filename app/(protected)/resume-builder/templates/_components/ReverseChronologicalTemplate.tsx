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
    <div className="bg-white text-black">
      {/* Name - First name black, Last name accent color */}
      <div className="px-10 pt-10 pb-2">
        <h1 className="text-4xl font-bold uppercase tracking-wide">
          <span className="text-black">{resumeData.firstName} </span>
          <span style={{ color: accentColor }}>{resumeData.lastName}</span>
        </h1>
        {resumeData.jobPosition && (
          <p className="text-sm text-gray-600 uppercase tracking-wide mt-1">
            {resumeData.jobPosition}
          </p>
        )}
      </div>

      {/* Contact Header - Black Background */}
      <div className="bg-black text-white px-10 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-x-2">
          {(resumeData.city || resumeData.region) && (
            <>
              <span>
                {resumeData.city}
                {resumeData.city && resumeData.region && ", "}
                {resumeData.region}
              </span>
              {(resumeData.phone || resumeData.email) && <span>|</span>}
            </>
          )}
          {resumeData.phone && (
            <>
              <span>{resumeData.phone}</span>
              {resumeData.email && <span>|</span>}
            </>
          )}
          {resumeData.email && <span>{resumeData.email}</span>}
        </div>
      </div>

      <div className="px-10 space-y-3 mt-4 pb-10">
        {/* Professional Summary */}
        {resumeData.summary && (
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold">Professional Summary</h2>
            <p className="text-xs leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Work History */}
        {resumeData.workExperiences &&
          resumeData.workExperiences.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="text-sm font-bold">Work History</h2>
              {resumeData.workExperiences.map((work, index) => (
                <div key={index} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold">{work.jobTitle}</h3>
                    <span className="text-xs whitespace-nowrap ml-4">
                      {work.startDate &&
                        formatDate(work.startDate).replace(
                          /^\d{1,2}\/\d{1,2}\//,
                          "",
                        )}
                      {(work.endDate || work.isCurrentlyWorkingHere) &&
                        ` to ${work.isCurrentlyWorkingHere ? "Current" : formatDate(work.endDate).replace(/^\d{1,2}\/\d{1,2}\//, "")}`}
                    </span>
                  </div>
                  <div className="text-xs font-bold">{work.employer}</div>
                  {work.description && (
                    <ul className="text-xs leading-relaxed list-disc pl-5 space-y-0.5 mt-1">
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
          )}

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold">Skills</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs list-disc pl-5">
              {resumeData.skills.map((skillItem, index) => (
                <li key={index}>{skillItem.skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {resumeData.educationItems && resumeData.educationItems.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold">Education</h2>
            {resumeData.educationItems.map((edu, index) => (
              <div key={index} className="space-y-0">
                <h3 className="text-xs font-bold">
                  {edu.degree}
                  {edu.degree && edu.fieldOfStudy && ": "}
                  {edu.fieldOfStudy}
                </h3>
                <div className="text-xs font-bold">
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
          <div className="space-y-1.5">
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
    </div>
  );
}
