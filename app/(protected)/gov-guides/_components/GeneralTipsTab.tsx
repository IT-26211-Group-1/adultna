"use client";

import { GeneralTips } from "@/types/govguide";
import { CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type GeneralTipsTabProps = {
  tips: GeneralTips | null | undefined;
};

export default function GeneralTipsTab({ tips }: GeneralTipsTabProps) {
  const { language } = useLanguage();

  const translations = {
    en: {
      noTips: "Tips are not available.",
      title: "General Tips for Smooth Processing",
      description:
        "The following tips are based on government policies, public service guidelines, and official practices to help you when transacting with government offices.",
      whatToPrepare: "What to Prepare and Practice",
      whatToAvoid: "What to Avoid",
      additionalReminders: "Additional Important Reminders",
    },
    fil: {
      noTips: "Hindi available ang mga tip.",
      title: "Mga Pangkalahatang Tip para sa Maayos na Proseso",
      description:
        "Ang mga sumusunod na tip ay batay sa mga patakaran ng pamahalaan, mga alituntunin sa serbisyo publiko, at mga opisyal na gawain upang tulungan ka kapag nakikipag-transaksyon sa mga tanggapan ng gobyerno.",
      whatToPrepare: "Ano ang Dapat Ihanda at Gawin",
      whatToAvoid: "Ano ang Dapat Iwasan",
      additionalReminders: "Karagdagang Mahalagang Paalala",
    },
  };

  const t = translations[language];

  if (
    !tips ||
    (!tips.tipsToFollow?.length &&
      !tips.tipsToAvoid?.length &&
      !tips.importantReminders?.length)
  ) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600">{t.noTips}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{t.description}</p>
      </div>

      <div className="space-y-4">
        {tips.tipsToFollow && tips.tipsToFollow.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full">
            <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {t.whatToPrepare}
            </h3>
            <ul className="space-y-2">
              {tips.tipsToFollow.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-green-700 min-w-[1.2rem]">
                    {index + 1}.
                  </span>
                  <span className="text-xs text-green-900">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tips.tipsToAvoid && tips.tipsToAvoid.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              {t.whatToAvoid}
            </h3>
            <ul className="space-y-2">
              {tips.tipsToAvoid.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-red-700 min-w-[1.2rem]">
                    {index + 1}.
                  </span>
                  <span className="text-xs text-red-900">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {tips.importantReminders && tips.importantReminders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">
            {t.additionalReminders}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-blue-900">
            {tips.importantReminders.map((reminder, index) => (
              <li key={index}>{reminder}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
