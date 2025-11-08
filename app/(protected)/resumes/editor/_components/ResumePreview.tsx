import { ResumeData } from "@/validators/resumeSchema";
import { Card, CardBody } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import useDimensions from "@/hooks/useDimensions";

interface ResumePreviewProps {
  resumeData: ResumeData & { colorHex?: string };
  classsName?: string;
}

export default function ResumePreview({
  resumeData,
  classsName,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  // Helper function to safely format dates
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "";

    try {
      // Handle CalendarDate objects
      if (dateValue && typeof dateValue === "object" && "year" in dateValue) {
        return new Date(
          dateValue.year,
          dateValue.month - 1,
          dateValue.day,
        ).toLocaleDateString();
      }

      // Handle Date objects and string dates
      const date = new Date(dateValue);

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error, dateValue);

      return "Invalid Date";
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("aspect-[210/297] h-fit w-full bg-white", classsName)}
    >
      <Card className="shadow-lg w-full h-full rounded-lg">
        <CardBody
          className={cn("p-8 space-y-6", !width && "invisible")}
          style={{
            zoom: (1 / 794) * width,
          }}
        >
          {/* Contact or Personal Information */}
          {resumeData.firstName ||
          resumeData.lastName ||
          resumeData.email ||
          resumeData.phone ||
          resumeData.city ||
          resumeData.region ||
          resumeData.linkedin ||
          resumeData.portfolio ? (
            <div
              className="text-center border-b pb-6"
              style={{ color: resumeData.colorHex || "#000000" }}
            >
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: resumeData.colorHex || "#000000" }}
              >
                {resumeData.firstName} {resumeData.lastName}
              </h1>
              <div className="text-gray-600 space-y-1">
                {resumeData.email && <p>{resumeData.email}</p>}
                {resumeData.phone && <p>{resumeData.phone}</p>}
                {(resumeData.city || resumeData.region) && (
                  <p>
                    {resumeData.city}
                    {resumeData.city && resumeData.region && ", "}
                    {resumeData.region}
                  </p>
                )}
                {resumeData.linkedin && <p>LinkedIn: {resumeData.linkedin}</p>}
                {resumeData.portfolio && (
                  <p>Portfolio: {resumeData.portfolio}</p>
                )}
              </div>
            </div>
          ) : null}

          {/* Summary Section */}
          {resumeData.summary && (
            <div>
              <h2
                className="text-xl font-semibold mb-3 pb-1 border-b"
                style={{ borderColor: resumeData.colorHex || "#000000" }}
              >
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Work Experience Section */}
          {resumeData.workExperiences &&
            resumeData.workExperiences.length > 0 && (
              <div>
                <h2
                  className="text-xl font-semibold mb-3 pb-1 border-b"
                  style={{ borderColor: resumeData.colorHex || "#000000" }}
                >
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {resumeData.workExperiences.map((work, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {work.jobTitle}
                          </h3>
                          <p className="text-gray-600">{work.employer}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {work.startDate && (
                            <>
                              {formatDate(work.startDate)}
                              {work.endDate
                                ? ` - ${formatDate(work.endDate)}`
                                : work.isCurrentlyWorkingHere
                                  ? " - Present"
                                  : ""}
                            </>
                          )}
                        </div>
                      </div>
                      {work.description && (
                        <p className="text-gray-700 text-sm mt-2">
                          {work.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Education Section */}
          {resumeData.educationItems &&
            resumeData.educationItems.length > 0 && (
              <div>
                <h2
                  className="text-xl font-semibold mb-3 pb-1 border-b"
                  style={{ borderColor: resumeData.colorHex || "#000000" }}
                >
                  Education
                </h2>
                <div className="space-y-3">
                  {resumeData.educationItems.map((edu, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.schoolName}</p>
                          {edu.fieldOfStudy && (
                            <p className="text-sm text-gray-500">
                              {edu.fieldOfStudy}
                            </p>
                          )}
                        </div>
                        {edu.graduationDate && (
                          <div className="text-sm text-gray-500">
                            {formatDate(edu.graduationDate)}
                          </div>
                        )}
                      </div>
                      {edu.schoolLocation && (
                        <p className="text-sm text-gray-500">
                          {edu.schoolLocation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Skills Section */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div>
              <h2
                className="text-xl font-semibold mb-3 pb-1 border-b"
                style={{ borderColor: resumeData.colorHex || "#000000" }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {resumeData.certificates && resumeData.certificates.length > 0 && (
            <div className="flex-grow">
              <h2
                className="text-xl font-semibold mb-3 pb-1 border-b"
                style={{ borderColor: resumeData.colorHex || "#000000" }}
              >
                Certifications
              </h2>
              <div className="space-y-2">
                {resumeData.certificates.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{cert.certificate}</h3>
                    {cert.issuingOrganization && (
                      <p className="text-gray-600 text-sm">
                        {cert.issuingOrganization}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
