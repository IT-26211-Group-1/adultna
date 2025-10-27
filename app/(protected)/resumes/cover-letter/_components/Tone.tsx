"use client";
import { Card, CardBody, Select, SelectItem, Button } from "@heroui/react";

export function Tone() {
  return (
    <Card>
      <CardBody className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Tone & Style</h3>
            <p className="text-sm text-gray-600">
              Choose the tone for your cover letter
            </p>
          </div>

          <Select
            label="Select tone"
            placeholder="Professional"
            defaultSelectedKeys={["professional"]}
            className="w-full"
          >
            <SelectItem key="professional" textValue="professional">
              Professional
            </SelectItem>
            <SelectItem key="enthusiastic" textValue="enthusiastic">
              Enthusiastic
            </SelectItem>
            <SelectItem key="confident" textValue="confident">
              Confident
            </SelectItem>
            <SelectItem key="friendly" textValue="friendly">
              Friendly
            </SelectItem>
          </Select>

          <Button className="bg-adult-green hover:bg-[#0e4634] text-white w-full font-semibold">
            Generate AI Cover Letter
          </Button>

          <p className="text-xs text-center text-gray-500 italic">
            Don't worry, you can still customize it to your liking!
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
