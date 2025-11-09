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

  return (
    <div className="bg-white p-12 space-y-4 text-black font-serif">
      {/* Name - Centered, Burgundy */}
      <h1
        className="text-4xl font-normal uppercase tracking-[0.2em] text-center"
        style={{ color: accentColor }}
      >
        {resumeData.firstName} {resumeData.lastName}
      </h1>

      {/* Contact Info - Centered */}
      <div className="text-center text-xs text-gray-700 space-x-1">
        {resumeData.phone && <span>+(0) {resumeData.phone}</span>}
        {resumeData.phone && (resumeData.city || resumeData.region) && (
          <span>|</span>
        )}
        {resumeData.city && resumeData.region && (
          <span>
            {resumeData.city}, {resumeData.region}
          </span>
        )}
        {(resumeData.phone || resumeData.city || resumeData.region) &&
          resumeData.email && <span>|</span>}
        {resumeData.email && <span>{resumeData.email}</span>}
      </div>

      {/* Divider Line */}
      <div
        className="border-t-2"
        style={{ borderColor: accentColor }}
      ></div>

      {/* Summary */}
      {resumeData.summary && (
        <p className="text-xs leading-relaxed text-justify">
          {resumeData.summary}
        </p>
      )}

      {/* Skills - First, 3 columns */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-base font-semibold border-b pb-1"
            style={{ color: accentColor, borderColor: "#d1d5db" }}
          >
            Skills
          </h2>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-xs list-disc pl-5">
            {resumeData.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Professional Experience */}
      {resumeData.workExperiences && resumeData.workExperiences.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-base font-semibold border-b pb-1"
            style={{ color: accentColor, borderColor: "#d1d5db" }}
          >
            Professional Experience
          </h2>
          {resumeData.workExperiences.map((work, index) => (
            <div key={index} className="space-y-1.5">
              <h3 className="text-xs font-bold">
                {work.jobTitle} at {work.employer}{" "}
                {work.startDate && (
                  <>
                    ({formatDate(work.startDate)} -{" "}
                    {work.isCurrentlyWorkingHere
                      ? "Present"
                      : work.endDate
                        ? formatDate(work.endDate)
                        : ""}
                    )
                  </>
                )}
              </h3>
              {work.description && (
                <p className="text-xs leading-relaxed text-justify">
                  {work.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.educationItems && resumeData.educationItems.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-base font-semibold border-b pb-1"
            style={{ color: accentColor, borderColor: "#d1d5db" }}
          >
            Education
          </h2>
          {resumeData.educationItems.map((edu, index) => (
            <div key={index} className="space-y-1">
              <h3 className="text-xs font-bold">
                {edu.schoolName}{" "}
                {edu.graduationDate && `(${formatDate(edu.graduationDate)})`}
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
