import { ResumeData } from "@/validators/resumeSchema";

type TemplateProps = {
  resumeData: ResumeData & { colorHex?: string };
  formatDate: (dateValue: any) => string;
};

export default function SkillBasedTemplate({
  resumeData,
  formatDate,
}: TemplateProps) {
  const accentColor = resumeData.colorHex || "#A64D79";

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

      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="bg-white p-12 space-y-5 text-black">
      {/* Name - Centered, Burgundy/Magenta */}
      <div className="text-center space-y-2">
        <h1
          className="text-4xl font-bold uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          {resumeData.firstName} {resumeData.lastName}
        </h1>
        {resumeData.jobPosition && (
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            {resumeData.jobPosition}
          </p>
        )}

        {/* Divider Line */}
        <div
          className="border-t-2 w-full"
          style={{ borderColor: accentColor }}
        />
      </div>

      {/* Contact Info - Centered, one line */}
      <div className="text-center text-xs text-gray-700">
        {resumeData.phone && <span>{resumeData.phone}</span>}
        {resumeData.phone &&
          (resumeData.city ||
            resumeData.region ||
            resumeData.email ||
            resumeData.linkedin ||
            resumeData.portfolio ||
            resumeData.birthDate) && <span> | </span>}
        {(resumeData.city || resumeData.region) && (
          <span>
            {resumeData.city}
            {resumeData.city && resumeData.region && ", "}
            {resumeData.region}
          </span>
        )}
        {(resumeData.city || resumeData.region) &&
          (resumeData.email ||
            resumeData.linkedin ||
            resumeData.portfolio ||
            resumeData.birthDate) && <span> | </span>}
        {resumeData.email && <span>{resumeData.email}</span>}
        {resumeData.email &&
          (resumeData.linkedin ||
            resumeData.portfolio ||
            resumeData.birthDate) && <span> | </span>}
        {resumeData.linkedin && (
          <span>{resumeData.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
        )}
        {resumeData.linkedin &&
          (resumeData.portfolio || resumeData.birthDate) && <span> | </span>}
        {resumeData.portfolio && (
          <span>
            {resumeData.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
          </span>
        )}
        {resumeData.portfolio && resumeData.birthDate && <span> | </span>}
        {resumeData.birthDate && (
          <span>Born: {formatBirthDate(resumeData.birthDate)}</span>
        )}
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <p className="text-xs leading-relaxed text-justify">
          {resumeData.summary}
        </p>
      )}

      {/* Skills - 3 columns */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="space-y-2">
          <h2
            className="text-base font-bold border-b pb-1.5"
            style={{ color: accentColor, borderColor: "#d1d5db" }}
          >
            Skills
          </h2>
          <ul className="grid grid-cols-3 gap-x-6 gap-y-1 text-xs list-disc pl-5">
            {resumeData.skills.map((skillItem, index) => (
              <li key={index}>{skillItem.skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Professional Experience */}
      {resumeData.workExperiences && resumeData.workExperiences.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-base font-bold border-b pb-1.5"
            style={{ color: accentColor, borderColor: "#d1d5db" }}
          >
            Professional Experience
          </h2>
          {resumeData.workExperiences.map((work, index) => (
            <div key={index} className="space-y-1">
              <h3 className="text-xs font-bold">
                {work.jobTitle} at {work.employer}{" "}
                {(work.startDate ||
                  work.endDate ||
                  work.isCurrentlyWorkingHere) && (
                  <span>
                    (
                    {work.startDate &&
                      formatDate(work.startDate).replace(
                        /^\d{1,2}\/\d{1,2}\//,
                        "",
                      )}{" "}
                    -{" "}
                    {work.isCurrentlyWorkingHere
                      ? "Present"
                      : work.endDate
                        ? formatDate(work.endDate).replace(
                            /^\d{1,2}\/\d{1,2}\//,
                            "",
                          )
                        : ""}
                    )
                  </span>
                )}
              </h3>
              {work.description && (
                <p className="text-xs leading-relaxed">{work.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.educationItems && resumeData.educationItems.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-base font-bold border-b pb-1.5"
            style={{ color: accentColor, borderColor: "#d1d5db" }}
          >
            Education
          </h2>
          {resumeData.educationItems.map((edu, index) => (
            <div key={index} className="space-y-0.5">
              <h3 className="text-xs font-bold">
                {edu.schoolName}{" "}
                {edu.graduationDate &&
                  `(${formatDate(edu.graduationDate).replace(/^\d{1,2}\/\d{1,2}\//, "")})`}
              </h3>
              <p className="text-xs">
                {edu.degree}
                {edu.degree && edu.fieldOfStudy && " in "}
                {edu.fieldOfStudy}
                {edu.schoolLocation && `. ${edu.schoolLocation}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
