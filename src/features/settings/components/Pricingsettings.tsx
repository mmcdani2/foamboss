// src/features/settings/components/PricingSettings.tsx
import {
  Card,
  CardBody,
  Input,
  Tooltip,
  Switch,
  Tabs,
  Tab
} from "@heroui/react";
import { Info } from "lucide-react";
import React, { useState } from "react";

interface PricingSettingsProps {
  pricing: any;
  setPricing: (val: any) => void;
}

// === Reusable Tooltip ===
const InfoTip = ({ content }: { content: string }) => (
  <Tooltip
    content={content}
    placement="right"
    className="
      max-w-xs text-sm
      backdrop-blur-md
      bg-background/70
      dark:bg-default-50/20
      border border-default/30
      shadow-lg
      rounded-xl
      p-3
    "
  >
    <Info
      size={16}
      className="
        text-default-400 cursor-pointer 
        hover:text-primary transition-all duration-200 
        hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]
      "
    />
  </Tooltip>
);

export default function PricingSettings({ pricing, setPricing }: PricingSettingsProps) {
  const handleChange = (key: string, value: number | string | boolean) => {
    setPricing({ ...pricing, [key]: value });
  };

  // === Local Preview State ===
  const [materialType, setMaterialType] = useState<"OC" | "CC">("OC");
  const [condition, setCondition] = useState<"wide" | "typical" | "tight">("typical");

  // === Constants & Defaults ===
  const exampleBoardFeet = 1000;
  const ocCost = pricing.materialOC ?? 0.45;
  const ccCost = pricing.materialCC ?? 1.0;
  const materialCostPerBdft = materialType === "OC" ? ocCost : ccCost;

  const materialMarkup = pricing.materialMarkup ?? 15;
  const mobilizationFee = pricing.mobilizationFee ?? 50;
  const overhead = pricing.overhead ?? 10;
  const profitMargin = pricing.profitMargin ?? 20;

  const prodWide = pricing.prodWideOpen ?? 1250;
  const prodTypical = pricing.prodTypical ?? 900;
  const prodTight = pricing.prodTight ?? 600;

  const productivity =
    condition === "wide"
      ? prodWide
      : condition === "typical"
      ? prodTypical
      : prodTight;

  const laborRate = pricing.laborRate ?? 35;
  const crewSize = pricing.crewSize ?? 2;

  // === Calculations ===
  const rawMaterialCost = materialCostPerBdft * exampleBoardFeet;
  const markedUpMaterial = rawMaterialCost * (1 + materialMarkup / 100);
  const laborHours = exampleBoardFeet / productivity;
  const laborCost = laborHours * laborRate * crewSize;

  const jobCost = laborCost + markedUpMaterial + mobilizationFee;
  const overheadMult = 1 + overhead / 100;
  const profitMult = 1 + profitMargin / 100;
  const estimatedSell = (jobCost * overheadMult * profitMult).toFixed(2);

  const conditionLabel = (key: string) =>
    key === "wide" ? "Wide-Open" : key === "typical" ? "Typical" : "Tight";

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {/* === LEFT COLUMN === */}
      <div className="space-y-6">
        {/* === LABOR CONFIG === */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-base">Labor Configuration</h3>
            <InfoTip content="Typical spray foam labor runs $30–$45/hr per tech. Most crews have 2–3 members depending on job size." />
          </div>
          <div className="grid gap-3">
            <Input
              type="number"
              label="Crew Labor Rate ($/hr)"
              value={pricing.laborRate ?? ""}
              onChange={(e) => handleChange("laborRate", +e.target.value)}
              variant="bordered"
              min={0}
            />
            <Input
              type="number"
              label="Average Crew Size"
              value={pricing.crewSize ?? ""}
              onChange={(e) => handleChange("crewSize", +e.target.value)}
              variant="bordered"
              min={1}
            />
          </div>
        </Card>

        {/* === PRODUCTIVITY === */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-base">Crew Productivity</h3>
            <InfoTip content="Estimate how many board feet your crew can spray per hour. Wide-open spaces like attics or warehouses allow higher rates; tight areas reduce output." />
          </div>
          <div className="grid gap-3">
            <Input
              type="number"
              label="Wide-Open (bdft/hr)"
              value={pricing.prodWideOpen ?? ""}
              onChange={(e) => handleChange("prodWideOpen", +e.target.value)}
              variant="bordered"
              min={0}
            />
            <Input
              type="number"
              label="Typical (bdft/hr)"
              value={pricing.prodTypical ?? ""}
              onChange={(e) => handleChange("prodTypical", +e.target.value)}
              variant="bordered"
              min={0}
            />
            <Input
              type="number"
              label="Tight (bdft/hr)"
              value={pricing.prodTight ?? ""}
              onChange={(e) => handleChange("prodTight", +e.target.value)}
              variant="bordered"
              min={0}
            />
          </div>
        </Card>

        {/* === MATERIAL CONFIG === */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-base">Material Configuration</h3>
            <InfoTip content="Set your average cost per board foot for open-cell (OC) and closed-cell (CC) foam. These numbers are used in job cost calculations." />
          </div>
          <div className="grid gap-3">
            <Input
              type="number"
              label="Open-Cell Cost ($/bdft)"
              value={pricing.materialOC ?? ""}
              onChange={(e) => handleChange("materialOC", +e.target.value)}
              variant="bordered"
              min={0}
            />
            <Input
              type="number"
              label="Closed-Cell Cost ($/bdft)"
              value={pricing.materialCC ?? ""}
              onChange={(e) => handleChange("materialCC", +e.target.value)}
              variant="bordered"
              min={0}
            />
            <Input
              type="number"
              label="Material Markup (%)"
              value={pricing.materialMarkup ?? ""}
              onChange={(e) => handleChange("materialMarkup", +e.target.value)}
              variant="bordered"
              min={0}
            />
          </div>
        </Card>

        {/* === OVERHEAD & PROFIT === */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-base">Overhead & Profit</h3>
            <InfoTip content="Overhead typically runs 10–15%. Profit margins range from 15–25% for residential, 10–20% for commercial work." />
          </div>
          <div className="grid gap-3">
            <Input
              type="number"
              label="Overhead (%)"
              value={pricing.overhead ?? ""}
              onChange={(e) => handleChange("overhead", +e.target.value)}
              variant="bordered"
              min={0}
            />
            <Input
              type="number"
              label="Profit Margin (%)"
              value={pricing.profitMargin ?? ""}
              onChange={(e) => handleChange("profitMargin", +e.target.value)}
              variant="bordered"
              min={0}
            />
          </div>
        </Card>

        {/* === DEFAULTS === */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-base">Defaults & Surcharges</h3>
            <InfoTip content="Mobilization fees cover setup, travel, and prep time. Fuel rates will be configured in the Advanced Configurator." />
          </div>
          <div className="grid gap-3">
            <Input
              type="number"
              label="Mobilization Fee ($)"
              value={pricing.mobilizationFee ?? ""}
              onChange={(e) => handleChange("mobilizationFee", +e.target.value)}
              variant="bordered"
              min={0}
            />
          </div>
        </Card>
      </div>

      {/* === RIGHT COLUMN: REAL-WORLD PREVIEW === */}
      <div>
        <Card className="p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Real-World Preview</h3>
            {/* OC | CC Toggle */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  materialType === "OC" ? "text-primary font-semibold" : "text-foreground/50"
                }`}
              >
                OC
              </span>
              <Switch
                size="sm"
                isSelected={materialType === "CC"}
                onChange={(e) => setMaterialType(e.target.checked ? "CC" : "OC")}
                color="primary"
                aria-label="Toggle Material Type"
                className="scale-90"
              />
              <span
                className={`text-xs ${
                  materialType === "CC" ? "text-primary font-semibold" : "text-foreground/50"
                }`}
              >
                CC
              </span>
            </div>
          </div>

          <Tabs
            selectedKey={condition}
            onSelectionChange={(key) => setCondition(key as "wide" | "typical" | "tight")}
            variant="solid"
            color="default"
            
          >
            {["wide", "typical", "tight"].map((key) => (
              <Tab key={key} title={conditionLabel(key)}>
                <Card>
                  <CardBody className="space-y-4 text-[15px]">
                    <p>
                      <span className="font-medium text-foreground/80">Material Type:</span>{" "}
                      {materialType === "OC" ? "Open-Cell" : "Closed-Cell"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">Job Size:</span> 1,000 bdft
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">Productivity:</span> {productivity} bdft/hr
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">Estimated Spray Time:</span>{" "}
                      {laborHours.toFixed(1)} hrs
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">Crew Labor Cost:</span> ${laborCost.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">Material Cost (with markup):</span>{" "}
                      ${markedUpMaterial.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">Overhead & Margin:</span>{" "}
                      {overhead}% / {profitMargin}%
                    </p>

                    <hr className="border-default/20 my-4" />

                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[16px]">Estimated Sell Price</span>
                      <span className="font-bold text-primary text-xl tracking-wide">
                        ${isNaN(Number(estimatedSell)) ? "0.00" : estimatedSell}
                      </span>
                    </div>

                    <p className="text-xs text-foreground/60 mt-2">
                      Based on your defaults, a 1,000 bdft{" "}
                      <span className="text-primary font-medium">
                        {materialType === "OC" ? "open-cell" : "closed-cell"}
                      </span>{" "}
                      job under {conditionLabel(condition).toLowerCase()} conditions would sell for approximately{" "}
                      <span className="text-primary font-medium">${estimatedSell}</span>.
                    </p>
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
