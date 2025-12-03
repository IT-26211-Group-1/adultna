"use client";

import { GovGuide } from "@/types/govguide";
import { DollarSign, Clock, MapPin } from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";

type GuideInfoCardsProps = {
  guide: GovGuide;
};

export default function GuideInfoCards({ guide }: GuideInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-4 mb-8">
      <Card
        disableAnimation
        className="border border-gray-200 h-16 w-full shadow-none"
      >
        <CardBody className="p-3 overflow-hidden">
          <div className="flex items-start gap-2">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-adult-green" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Processing Fee
              </h3>
              <p className="text-xs text-gray-600">
                {(() => {
                  const feeAmount =
                    guide.feeAmount ?? guide.offices?.feeAmount ?? null;
                  const oneTimeFee =
                    guide.oneTimeFee ?? guide.offices?.oneTimeFee ?? false;
                  const currency =
                    guide.feeCurrency || guide.offices?.feeCurrency || "PHP";

                  if (feeAmount !== null && feeAmount !== undefined) {
                    return `${currency === "PHP" ? "₱" : currency}${feeAmount.toLocaleString()}${
                      oneTimeFee ? " (One-time)" : ""
                    }`;
                  }

                  return "No fee information available";
                })()}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card
        disableAnimation
        className="border border-gray-200 h-16 w-full shadow-none"
      >
        <CardBody className="p-3 overflow-hidden">
          <div className="flex items-start gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <Clock className="w-4 h-4 text-crayola-orange" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Processing Time
              </h3>
              <p className="text-xs text-gray-600">
                {guide.estimatedProcessingTime ||
                  guide.processingTime ||
                  "Not specified"}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Link
        href={`/find-office?search=${encodeURIComponent(guide.offices?.issuingAgency || guide.issuingAgency)}`}
      >
        <Card
          disableAnimation
          isPressable
          className="border border-gray-200 hover:border-adult-green transition-colors cursor-pointer h-16 w-full shadow-none"
        >
          <CardBody className="p-3 overflow-hidden">
            <div className="flex items-start gap-2">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Find Nearest {guide.offices?.issuingAgency || "Office"}
                </h3>
                <p className="text-xs text-adult-green hover:underline">
                  View office locations
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </Link>
    </div>
  );
}
