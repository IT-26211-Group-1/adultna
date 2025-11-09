import { ResumeData } from "@/validators/resumeSchema";
import { MapPin, Phone, Mail, User, Globe } from "lucide-react";

type TemplateProps = {
  resumeData: ResumeData & { colorHex?: string };
  formatDate: (dateValue: any) => string;
};

export default function ModernTemplate({
  resumeData,
  formatDate,
}: TemplateProps) {
  const accentColor = resumeData.colorHex || "#000000";

  return (
    <div className="bg-white flex h-full text-black">
      {/* Left Sidebar - 30% */}
      <div className="w-[30%] bg-gray-50 p-6 space-y-6 text-xs border-r border-gray-200">
        {/* Contact Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4" />
            <h2 className="font-bold uppercase text-sm">CONTACT</h2>
          </div>
          <div className="space-y-2 text-xs">
            {resumeData.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{resumeData.phone}</span>
              </div>
            )}
            {resumeData.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="break-all">{resumeData.email}</span>
              </div>
            )}
            {(resumeData.city || resumeData.region) && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>
                  {resumeData.city}
                  {resumeData.city && resumeData.region && ", "}
                  {resumeData.region}
                </span>
              </div>
            )}
            {resumeData.portfolio && (
              <div className="flex items-start gap-2">
                <Globe className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="break-all">{resumeData.portfolio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-bold uppercase text-sm">SKILLS</h2>
            <ul className="space-y-1.5 list-disc pl-4">
              {resumeData.skills.map((skill, index) => (
                <li key={index} className="text-xs">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reference Section Placeholder */}
        {resumeData.linkedin && (
          <div className="space-y-3">
            <h2 className="font-bold uppercase text-sm">REFERENCE</h2>
            <p className="text-xs break-all">{resumeData.linkedin}</p>
          </div>
        )}
      </div>

      {/* Right Column - 70% */}
      <div className="w-[70%] p-6 space-y-6">
        {/* Name and Title */}
        <div className="border-b pb-3">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            {resumeData.firstName} {resumeData.lastName}
          </h1>
          <p className="text-xs text-gray-600 uppercase mt-1">
            MARKETING MANAGER
          </p>
        </div>

        {/* Profile/Summary */}
        {resumeData.summary && (
          <div className="space-y-2 relative">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor }}
              >
                <User className="w-4 h-4" />
              </div>
              <h2 className="font-bold uppercase text-sm">PROFILE</h2>
            </div>
            <div className="pl-10 border-l-2 border-gray-300 ml-4">
              <p className="text-xs leading-relaxed pl-4">
                {resumeData.summary}
              </p>
            </div>
          </div>
        )}

        {/* Work Experience */}
        {resumeData.workExperiences && resumeData.workExperiences.length > 0 && (
          <div className="space-y-3 relative">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor }}
              >
                <User className="w-4 h-4" />
              </div>
              <h2 className="font-bold uppercase text-sm">
                WORK EXPERIENCE
              </h2>
            </div>
            <div className="space-y-4 border-l-2 border-gray-300 ml-4">
              {resumeData.workExperiences.map((work, index) => (
                <div key={index} className="pl-10 relative">
                  <div
                    className="absolute left-[-6px] top-1 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-bold">{work.employer}</h3>
                        <p className="text-xs font-semibold">{work.jobTitle}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {work.startDate && formatDate(work.startDate)} -{" "}
                        {work.isCurrentlyWorkingHere
                          ? "PRESENT"
                          : work.endDate
                            ? formatDate(work.endDate)
                            : ""}
                      </span>
                    </div>
                    {work.description && (
                      <p className="text-xs leading-relaxed text-gray-700">
                        {work.description}
                      </p>
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
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor }}
              >
                <User className="w-4 h-4" />
              </div>
              <h2 className="font-bold uppercase text-sm">EDUCATION</h2>
            </div>
            <div className="pl-10">
              {resumeData.educationItems.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-bold">{edu.degree}</h3>
                      <p className="text-xs">{edu.schoolName}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {edu.graduationDate && formatDate(edu.graduationDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
