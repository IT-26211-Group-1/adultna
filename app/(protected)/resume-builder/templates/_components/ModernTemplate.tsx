import { ResumeData } from "@/validators/resumeSchema";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Globe,
  Briefcase,
  GraduationCap,
} from "lucide-react";

type TemplateProps = {
  resumeData: ResumeData & { colorHex?: string };
  formatDate: (dateValue: any) => string;
};

export default function ModernTemplate({
  resumeData,
  formatDate,
}: TemplateProps) {
  const accentColor = resumeData.colorHex || "#4A5568";

  return (
    <div className="bg-white flex h-full text-black">
      {/* Left Sidebar - 35% */}
      <div className="w-[35%] bg-gray-50 p-8 space-y-6 text-xs">
        {/* Contact Section */}
        <div className="space-y-3">
          <h2 className="font-bold uppercase text-sm tracking-wide border-b-2 border-gray-300 pb-2">
            CONTACT
          </h2>
          <div className="space-y-2.5">
            {resumeData.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>{resumeData.phone}</span>
              </div>
            )}
            {resumeData.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="break-all">{resumeData.email}</span>
              </div>
            )}
            {(resumeData.city || resumeData.region) && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>
                  {resumeData.city}
                  {resumeData.city && resumeData.region && ", "}
                  {resumeData.region}
                </span>
              </div>
            )}
            {resumeData.portfolio && (
              <div className="flex items-start gap-2">
                <Globe className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="break-all">
                  {resumeData.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-bold uppercase text-sm tracking-wide border-b-2 border-gray-300 pb-2">
              SKILLS
            </h2>
            <ul className="space-y-1.5 list-disc pl-4">
              {resumeData.skills.map((skillItem, index) => (
                <li key={index}>{skillItem.skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages Section */}
        <div className="space-y-3">
          <h2 className="font-bold uppercase text-sm tracking-wide border-b-2 border-gray-300 pb-2">
            LANGUAGES
          </h2>
          <ul className="space-y-1.5 list-disc pl-4">
            <li>English (Fluent)</li>
          </ul>
        </div>

        {/* Reference Section */}
        <div className="space-y-3">
          <h2 className="font-bold uppercase text-sm tracking-wide border-b-2 border-gray-300 pb-2">
            REFERENCE
          </h2>
          <div className="space-y-1">
            <p className="font-bold">Estelle Darcy</p>
            <p className="text-xs">Wardiere Inc. / CTO</p>
            <p className="text-xs">
              Phone: {resumeData.phone || "+124-4236-7894"}
            </p>
            <p className="text-xs break-all">
              Email: {resumeData.email || "hello@ahmedd saaahh.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - 65% */}
      <div className="w-[65%] p-8 space-y-6 relative">
        {/* Name and Title */}
        <div className="border-b-2 border-gray-800 pb-3">
          <h1
            className="text-3xl font-bold uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            {resumeData.firstName} {resumeData.lastName}
          </h1>
          {resumeData.jobPosition && (
            <p className="text-sm text-gray-600 uppercase mt-1 tracking-wide">
              {resumeData.jobPosition}
            </p>
          )}
        </div>

        {/* Vertical Timeline Line */}
        <div className="absolute left-8 top-32 bottom-0 w-0.5 bg-gray-300" />

        {/* Profile/Summary */}
        {resumeData.summary && (
          <div className="space-y-2 relative pl-12">
            <div
              className="absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center text-white z-10"
              style={{ backgroundColor: accentColor }}
            >
              <User className="w-4 h-4" />
            </div>
            <h2 className="font-bold uppercase text-sm tracking-wide">
              PROFILE
            </h2>
            <p className="text-xs leading-relaxed text-justify">
              {resumeData.summary}
            </p>
            <div className="absolute left-[15px] top-10 w-2 h-2 rounded-full bg-gray-300" />
          </div>
        )}

        {/* Work Experience */}
        {resumeData.workExperiences &&
          resumeData.workExperiences.length > 0 && (
            <div className="space-y-3 relative pl-12">
              <div
                className="absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center text-white z-10"
                style={{ backgroundColor: accentColor }}
              >
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="font-bold uppercase text-sm tracking-wide">
                WORK EXPERIENCE
              </h2>
              <div className="space-y-4">
                {resumeData.workExperiences.map((work, index) => (
                  <div key={index} className="space-y-1 relative">
                    <div className="absolute left-[-33px] top-2 w-2 h-2 rounded-full bg-gray-300" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold">{work.employer}</h3>
                      <span className="text-xs whitespace-nowrap ml-2">
                        {work.startDate &&
                          formatDate(work.startDate).replace(
                            /^\d{1,2}\/\d{1,2}\//,
                            "",
                          )}{" "}
                        -{" "}
                        {work.isCurrentlyWorkingHere
                          ? "PRESENT"
                          : work.endDate
                            ? formatDate(work.endDate).replace(
                                /^\d{1,2}\/\d{1,2}\//,
                                "",
                              )
                            : ""}
                      </span>
                    </div>
                    <p className="text-xs font-semibold">{work.jobTitle}</p>
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
                ))}
              </div>
            </div>
          )}

        {/* Education */}
        {resumeData.educationItems && resumeData.educationItems.length > 0 && (
          <div className="space-y-3 relative pl-12">
            <div
              className="absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center text-white z-10"
              style={{ backgroundColor: accentColor }}
            >
              <GraduationCap className="w-4 h-4" />
            </div>
            <h2 className="font-bold uppercase text-sm tracking-wide">
              EDUCATION
            </h2>
            {resumeData.educationItems.map((edu, index) => (
              <div key={index} className="space-y-1 relative">
                <div className="absolute left-[-33px] top-2 w-2 h-2 rounded-full bg-gray-300" />
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold">{edu.degree}</h3>
                  <span className="text-xs whitespace-nowrap ml-2">
                    {edu.graduationDate &&
                      formatDate(edu.graduationDate).replace(
                        /^\d{1,2}\/\d{1,2}\//,
                        "",
                      )}
                  </span>
                </div>
                <p className="text-xs">{edu.schoolName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
