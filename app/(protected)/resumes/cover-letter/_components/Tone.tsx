"use client";
import { Card, CardBody, Select, SelectItem, Button } from "@heroui/react";

export function Tone() {
  return (
    <Card className="flex-shrink-0">
      <CardBody className="p-3">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold">Tone & Style</h3>
            <p className="text-xs text-gray-600">
              Choose the tone for your cover letter
            </p>
          </div>

          <Select
            className="w-full"
            defaultSelectedKeys={["professional"]}
            label="Select tone"
            placeholder="Professional"
            size="sm"
          >
            <SelectItem key="professional" textValue="Professional">
              Professional
            </SelectItem>
            <SelectItem key="enthusiastic" textValue="Enthusiastic">
              Enthusiastic
            </SelectItem>
            <SelectItem key="confident" textValue="Confident">
              Confident
            </SelectItem>
            <SelectItem key="friendly" textValue="Friendly">
              Friendly
            </SelectItem>
          </Select>

          <Button
            className="bg-adult-green hover:bg-[#0e4634] text-white w-full font-semibold"
            size="sm"
          >
            Generate AI Cover Letter
          </Button>

          <p className="text-[10px] text-center text-gray-500 italic">
            Don&apos;t worry, you can still customize it to your liking!
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
