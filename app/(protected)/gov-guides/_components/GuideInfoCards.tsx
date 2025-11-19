"use client";

import { GovGuide } from "@/types/govguide";
import { DollarSign, Clock, MapPin } from "lucide-react";
import { Card, CardBody } from "@heroui/card";

type GuideInfoCardsProps = {
  guide: GovGuide;
  onOpenMap: () => void;
};

export default function GuideInfoCards({
  guide,
  onOpenMap,
}: GuideInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card disableAnimation className="border border-gray-200">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-adult-green" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Processing Fee
              </h3>
              <p className="text-sm text-gray-600">
                {guide.feeAmount !== null && guide.feeAmount !== undefined
                  ? `₱${guide.feeAmount.toLocaleString()} ${
                      guide.oneTimeFee ? "(One-time payment required)" : ""
                    }`
                  : "No fee information available"}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card disableAnimation className="border border-gray-200">
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-crayola-orange" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Processing Time
              </h3>
              <p className="text-sm text-gray-600">
                {guide.estimatedProcessingTime || "Not specified"}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card
        disableAnimation
        isPressable
        className="border border-gray-200 hover:border-adult-green transition-colors cursor-pointer"
        onClick={onOpenMap}
      >
        <CardBody className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Find Nearest {guide.offices?.issuingAgency || "Office"}
              </h3>
              <p className="text-sm text-adult-green hover:underline">
                Redirects you to GovMap
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
