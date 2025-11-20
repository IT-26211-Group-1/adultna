"use client";

import { GeneralTips } from "@/types/govguide";
import { CheckCircle2, XCircle } from "lucide-react";

type GeneralTipsTabProps = {
  tips: GeneralTips | null | undefined;
};

export default function GeneralTipsTab({ tips }: GeneralTipsTabProps) {
  if (
    !tips ||
    (!tips.tipsToFollow?.length &&
      !tips.tipsToAvoid?.length &&
      !tips.importantReminders?.length)
  ) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No general tips available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          General Tips for Smooth Processing
        </h2>
        <p className="text-gray-600 mb-6">
          The following tips are based on government policies, public service
          guidelines, and official practices to help you when transacting with
          government offices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.tipsToFollow && tips.tipsToFollow.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              What to Prepare and Practice
            </h3>
            <ul className="space-y-3">
              {tips.tipsToFollow.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-semibold text-green-700 min-w-[1.5rem]">
                    {index + 1}.
                  </span>
                  <span className="text-sm text-green-900">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tips.tipsToAvoid && tips.tipsToAvoid.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              What to Avoid
            </h3>
            <ul className="space-y-3">
              {tips.tipsToAvoid.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-semibold text-red-700 min-w-[1.5rem]">
                    {index + 1}.
                  </span>
                  <span className="text-sm text-red-900">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {tips.importantReminders && tips.importantReminders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-4">
            Additional Important Reminders
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-900">
            {tips.importantReminders.map((reminder, index) => (
              <li key={index}>{reminder}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
