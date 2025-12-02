"use client";

import { DocumentRequirement } from "@/types/govguide";
import { CheckCircle2, Circle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type RequirementsTabProps = {
  requirements: DocumentRequirement[];
};

export default function RequirementsTab({
  requirements,
}: RequirementsTabProps) {
  const { language } = useLanguage();

  const translations = {
    en: {
      noRequirements: "No document requirements specified yet.",
      checklist: "Complete Document Checklist",
      checklistDesc:
        "Ensure you have all these documents before visiting the office to avoid delays",
      optionalDocs: "Optional Documents",
      importantReminders: "Important Reminders",
      reminder1: "Bring both original documents and photocopies",
      reminder2: "All documents must be clear and readable",
      reminder3: "Expired IDs will not be accepted",
      reminder4: "Some offices may require additional birth certificates",
    },
    fil: {
      noRequirements: "Walang nakatakdang mga kinakailangang dokumento.",
      checklist: "Kumpletong Listahan ng mga Dokumento",
      checklistDesc:
        "Siguraduhing mayroon ka ng lahat ng dokumentong ito bago bumisita sa tanggapan upang maiwasan ang pagkaantala",
      optionalDocs: "Opsyonal na mga Dokumento",
      importantReminders: "Mahalagang Paalala",
      reminder1: "Magdala ng parehong orihinal na dokumento at mga photocopy",
      reminder2: "Lahat ng dokumento ay dapat na malinaw at nababasa",
      reminder3: "Ang mga expired na ID ay hindi tatanggapin",
      reminder4:
        "Ang ilang tanggapan ay maaaring humingi ng karagdagang birth certificate",
    },
  };

  const t = translations[language];

  if (!requirements || requirements.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600">{t.noRequirements}</p>
      </div>
    );
  }

  const requiredDocs = requirements.filter((req) => req.isRequired !== false);
  const optionalDocs = requirements.filter((req) => req.isRequired === false);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {t.checklist}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{t.checklistDesc}</p>

        {requiredDocs.length > 0 && (
          <div className="space-y-2 mb-4">
            {requiredDocs.map((req, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-adult-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {req.name}
                  </p>
                  {req.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {req.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {optionalDocs.length > 0 && (
          <>
            <h3 className="text-base font-semibold text-gray-900 mb-2 mt-4">
              {t.optionalDocs}
            </h3>
            <div className="space-y-2">
              {optionalDocs.map((req, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {req.name}
                    </p>
                    {req.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {req.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-amber-900 mb-2">
          {t.importantReminders}
        </h3>
        <ul className="list-disc list-inside space-y-1 text-xs text-amber-800">
          <li>{t.reminder1}</li>
          <li>{t.reminder2}</li>
          <li>{t.reminder3}</li>
          <li>{t.reminder4}</li>
        </ul>
      </div>
    </div>
  );
}
