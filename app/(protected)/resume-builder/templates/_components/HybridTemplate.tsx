import { ResumeData } from "@/validators/resumeSchema";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

type TemplateProps = {
  resumeData: ResumeData & { colorHex?: string };
  formatDate: (dateValue: any) => string;
};

export default function HybridTemplate({
  resumeData,
  formatDate,
}: TemplateProps) {
  const accentColor = resumeData.colorHex || "#000000";

  return (
    <div className="bg-white text-black p-10 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">
          {resumeData.firstName} {resumeData.lastName}
        </h1>
        {resumeData.jobPosition && (
          <p className="text-sm text-gray-600 font-semibold">
            {resumeData.jobPosition}
          </p>
        )}
      </div>

      {/* Contact Info with Icons */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {(resumeData.city || resumeData.region) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {resumeData.city}
              {resumeData.city && resumeData.region && ", "}
              {resumeData.region}
            </span>
          </div>
        )}
        {resumeData.linkedin && (
          <div className="flex items-center gap-2">
            <Linkedin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">
              {resumeData.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          </div>
        )}
        {resumeData.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{resumeData.phone}</span>
          </div>
        )}
        {resumeData.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{resumeData.email}</span>
          </div>
        )}
      </div>

      {/* Summary Section */}
      {resumeData.summary && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold">Software Development</h2>
          <ul className="text-xs leading-relaxed list-disc pl-5 space-y-1">
            {resumeData.summary
              .split(".")
              .filter((s) => s.trim())
              .map((sentence, i) => (
                <li key={i}>{sentence.trim()}.</li>
              ))}
          </ul>
        </div>
      )}

      {/* Work Experience */}
      {resumeData.workExperiences && resumeData.workExperiences.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 flex items-center justify-center text-white rounded"
              style={{ backgroundColor: accentColor }}
            >
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold">Work Experience</h2>
          </div>
          <div className="space-y-4">
            {resumeData.workExperiences.map((work, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-24 flex-shrink-0 text-xs text-gray-600">
                  {work.startDate &&
                    formatDate(work.startDate).replace(
                      /^\d{1,2}\/\d{1,2}\//,
                      "",
                    )}
                  {work.startDate &&
                    (work.isCurrentlyWorkingHere || work.endDate) &&
                    " - "}
                  {work.isCurrentlyWorkingHere
                    ? "present"
                    : work.endDate
                      ? formatDate(work.endDate).replace(
                          /^\d{1,2}\/\d{1,2}\//,
                          "",
                        )
                      : ""}
                </div>
                <div className="flex-1 space-y-1">
                  <div>
                    <h3 className="text-xs font-bold">{work.jobTitle}</h3>
                    <p className="text-xs italic text-gray-600">
                      {work.employer}
                    </p>
                  </div>
                  {work.description && (
                    <ul className="text-xs leading-relaxed list-disc pl-4 space-y-0.5">
                      {work.description
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line, i) => (
                          <li key={i}>{line.trim()}</li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.educationItems && resumeData.educationItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 flex items-center justify-center text-white rounded"
              style={{ backgroundColor: accentColor }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold">Education</h2>
          </div>
          {resumeData.educationItems.map((edu, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-24 flex-shrink-0 text-xs text-gray-600">
                {edu.graduationDate &&
                  formatDate(edu.graduationDate).replace(
                    /^\d{1,2}\/\d{1,2}\//,
                    "",
                  )}
              </div>
              <div>
                <h3 className="text-xs font-bold">{edu.degree}</h3>
                <p className="text-xs italic text-gray-600">{edu.schoolName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Skills with Progress Bars */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 flex items-center justify-center text-white rounded"
              style={{ backgroundColor: accentColor }}
            >
              <Award className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-bold">Additional Skills</h2>
          </div>
          <div className="space-y-2">
            {resumeData.skills.slice(0, 6).map((skillItem, index) => {
              const proficiency = skillItem.proficiency ?? 0;

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs w-24 flex-shrink-0">
                    {skillItem.skill}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3"
                        style={{
                          backgroundColor:
                            i < proficiency ? accentColor : "#e5e7eb",
                          border: `1px solid ${accentColor}`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
