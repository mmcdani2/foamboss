import {
  Card,
  Input,
  Switch,
} from "@heroui/react";
import InfoTip from "@/components/ui/InfoTip";
import { useState, useMemo } from "react";
import PricingPreview from "./PricingPreview";
import { usePricingSettings } from "@/state/usePricingSettings";
import { calculatePricingPreview } from "@/lib/pricingPreviewCalculator";


export default function PricingSettings() {
  const { pricing, updatePricing } = usePricingSettings((s) => ({
  pricing: s.pricing,
  updatePricing: s.updatePricing,
}));


  // === UI States ===
  const [materialType, setMaterialType] = useState<"OC" | "CC">("OC");
  const [condition, setCondition] = useState<"wide" | "typical" | "tight">("typical");

  // === Handler ===
  const handleChange = (key: string, value: any) => {
  const updated: Record<string, any> = { [key]: value };

  // Auto productivity recalculation
  if (
    (key === "prodTypical" && pricing.autoProductivity) ||
    (key === "autoProductivity" && value === true)
  ) {
    const typical = key === "prodTypical" ? Number(value) : pricing.prodTypical;
    updated.prodWideOpen = Math.round(typical * 1.4);
    updated.prodTight = Math.round(typical * 0.7);
  }

  updatePricing(updated);
};


  // === Derived Calculations (Reactive) ===
  // === Derived Calculations (Shared Logic) ===
  const preview = useMemo(
  () => calculatePricingPreview(pricing, materialType, condition),
  [pricing, materialType, condition]
);

  const {
    productivity,
    markedUpMaterial,
    laborHours,
    laborCost,
    estimatedSell,
    overhead,
    profitMargin,
  } = preview;


  const conditionLabel = (key: string) =>
    key === "wide" ? "Wide-Open" : key === "typical" ? "Typical" : "Tight";

  // === RENDER ===
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {/* LEFT COLUMN */}
      <div className="space-y-4 sm:space-y-6 order-last sm:order-first">
        {/* === LABOR CONFIG === */}
        <Card className="p-5 rounded-xl border border-default/20 bg-default/40 dark:bg-background/40 backdrop-blur-md shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
          <h3 className="font-semibold text-base mb-3">Labor Configuration</h3>
          <div className="grid gap-3">
            <Input
              label="Crew Labor Rate"
              value={String(pricing.laborRate ?? "")}
              onChange={(e) => handleChange("laborRate", +e.target.value)}
              startContent={<span className="text-foreground/70 font-medium">$</span>}
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />

            <Input
              label="Average Crew Size"
              value={String(pricing.crewSize ?? "")}
              onChange={(e) => handleChange("crewSize", +e.target.value)}
              min={1}
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />
          </div>
        </Card>

        {/* === PRODUCTIVITY === */}
        <Card className="p-5 rounded-xl border border-default/20 bg-default/40 dark:bg-background/40 backdrop-blur-md shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base">Crew Productivity</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/60">Auto</span>
              <Switch
                size="sm"
                isSelected={pricing.autoProductivity}
                onChange={(e) => handleChange("autoProductivity", e.target.checked)}
                color="primary"
                className="scale-90"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Input
              label="Typical (bdft/hr)"
              value={String(pricing.prodTypical ?? "")}
              onChange={(e) => handleChange("prodTypical", +e.target.value)}
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />

            <Input
              label="Wide-Open (bdft/hr)"
              value={String(
                pricing.autoProductivity
                  ? Math.round((pricing.prodTypical || 0) * 1.4)
                  : pricing.prodWideOpen ?? ""
              )}
              onChange={(e) => handleChange("prodWideOpen", +e.target.value)}
              isDisabled={!!pricing.autoProductivity}
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />

            <Input
              label="Tight (bdft/hr)"
              value={String(
                pricing.autoProductivity
                  ? Math.round((pricing.prodTypical || 0) * 0.7)
                  : pricing.prodTight ?? ""
              )}
              onChange={(e) => handleChange("prodTight", +e.target.value)}
              isDisabled={!!pricing.autoProductivity}
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />
          </div>
        </Card>

        {/* === MATERIAL CONFIG === */}
        <Card className="p-5 rounded-xl border border-default/20 bg-default/40 dark:bg-background/40 backdrop-blur-md shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
          <h3 className="font-semibold text-base mb-3">Material Configuration</h3>
          <div className="grid gap-3">

            {/* Open-Cell Cost */}
            <Input
              label="Open-Cell Cost ($/bdft)"
              type="number"
              value={pricing.materialOC?.toString() ?? ""}
              onChange={(e) => handleChange("materialOC", e.target.value)} // raw string
              onBlur={(e) => handleChange("materialOC", parseFloat(e.target.value) || 0)} // parse on blur
              step="0.01"
              min="0"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />

            {/* Closed-Cell Cost */}
            <Input
              label="Closed-Cell Cost ($/bdft)"
              type="number"
              value={pricing.materialCC?.toString() ?? ""}
              onChange={(e) => handleChange("materialCC", e.target.value)}
              onBlur={(e) => handleChange("materialCC", parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />

            {/* Material Markup */}
            <Input
              label="Material Markup"
              value={String(pricing.materialMarkup ?? "")}
              onChange={(e) => handleChange("materialMarkup", +e.target.value)}
              step="0.01"
              endContent={<span className="text-foreground/70 font-medium">%</span>}
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />
          </div>
        </Card>
        {/* === OVERHEAD & PROFIT === */}
        <Card className="p-5 rounded-xl border border-default/20 bg-default/40 dark:bg-background/40 backdrop-blur-md shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
          <h3 className="font-semibold text-base mb-3">Overhead & Profit</h3>
          <div className="grid gap-3">
            <Input
              label="Overhead"
              value={String(pricing.overhead ?? "")}
              onChange={(e) => handleChange("overhead", +e.target.value)}
              endContent={<span className="text-foreground/70 font-medium">%</span>}
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />

            <Input
              label="Profit Margin"
              value={String(pricing.profitMargin ?? "")}
              onChange={(e) => handleChange("profitMargin", +e.target.value)}
              endContent={<span className="text-foreground/70 font-medium">%</span>}
              classNames={{
                inputWrapper: [
                  "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                  "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                  "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
                ].join(" "),
                label: "text-default-700 dark:text-default-700 font-normal",
                input: "text-foreground",
              }}
            />
          </div>
        </Card>

        {/* === DEFAULTS === */}
        <Card className="p-5 rounded-xl border border-default/20 bg-default/40 dark:bg-background/40 backdrop-blur-md shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
          <h3 className="font-semibold text-base mb-3">Defaults & Surcharges</h3>
          <Input
            label="Mobilization Fee"
            value={String(pricing.mobilizationFee ?? "")}
            onChange={(e) => handleChange("mobilizationFee", +e.target.value)}
            startContent={<span className="text-foreground/70 font-medium">$</span>}
            classNames={{
              inputWrapper: [
                "bg-default/70 dark:bg-background/40 backdrop-blur-md",
                "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
              ].join(" "),
              label: "text-default-700 dark:text-default-700 font-normal",
              input: "text-foreground",
            }}
          />
        </Card>
      </div>

      {/*==== Right Side Panel ====*/}
      <PricingPreview
        materialType={materialType}
        setMaterialType={setMaterialType}
        condition={condition}        
        setCondition={setCondition}  
        conditionLabel={conditionLabel}
        productivity={productivity}
        laborHours={laborHours}
        laborCost={laborCost}
        markedUpMaterial={markedUpMaterial}
        overhead={overhead}
        profitMargin={profitMargin}
        estimatedSell={estimatedSell}
      />
    </div>
  );
}
