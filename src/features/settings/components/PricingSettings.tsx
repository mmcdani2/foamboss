import {
  Card,
  Input,
  Switch,
} from "@heroui/react";
import InfoTip from "@/components/ui/InfoTip";
import { useState, useEffect, useMemo } from "react";
import PricingPreview from "./PricingPreview";
import {
  usePricingSettings,
  type PricingSettings as PricingSettingsState,
} from "@/state/usePricingSettings";
import { calculatePricingPreview } from "@/lib/pricingPreviewCalculator";
import { deriveAutoProductivityRates } from "@/lib/productivity";

const numericFields = [
  "laborRate",
  "crewSize",
  "prodTypical",
  "prodWideOpen",
  "prodTight",
  "materialOC",
  "materialCC",
  "materialMarkup",
  "overhead",
  "profitMargin",
  "mobilizationFee",
] as const;

type NumericField = (typeof numericFields)[number];
type DraftState = Record<NumericField, string>;

const formatNumber = (value: number | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? String(value) : "";

const toDraft = (pricing: PricingSettingsState): DraftState => ({
  laborRate: formatNumber(pricing.laborRate),
  crewSize: formatNumber(pricing.crewSize),
  prodTypical: formatNumber(pricing.prodTypical),
  prodWideOpen: formatNumber(pricing.prodWideOpen),
  prodTight: formatNumber(pricing.prodTight),
  materialOC: formatNumber(pricing.materialOC),
  materialCC: formatNumber(pricing.materialCC),
  materialMarkup: formatNumber(pricing.materialMarkup),
  overhead: formatNumber(pricing.overhead),
  profitMargin: formatNumber(pricing.profitMargin),
  mobilizationFee: formatNumber(pricing.mobilizationFee),
});

export default function PricingSettings() {
  const pricing = usePricingSettings((s) => s.pricing);
  const updatePricing = usePricingSettings((s) => s.updatePricing);

  const [materialType, setMaterialType] = useState<"OC" | "CC">("OC");
  const [condition, setCondition] = useState<"wide" | "typical" | "tight">("typical");
  const [draft, setDraft] = useState<DraftState>(() => toDraft(pricing));

  useEffect(() => {
    const next = toDraft(pricing);
    setDraft((prev) => {
      for (const key of numericFields) {
        if (prev[key] !== next[key]) {
          return next;
        }
      }
      return prev;
    });
  }, [pricing]);

  const withTip = (label: string, tip: string) => (
    <span className="flex items-center gap-1">
      {label}
      <InfoTip content={tip} />
    </span>
  );

  const handleNumericChange = (key: NumericField, raw: string) => {
    setDraft((prev) => (prev[key] === raw ? prev : { ...prev, [key]: raw }));

    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "-" || trimmed === "." || trimmed === "-.") {
      return;
    }

    const numeric = Number(trimmed);
    if (!Number.isFinite(numeric)) return;

    const updated: Partial<PricingSettingsState> = { [key]: numeric };

    if (key === "prodTypical" && pricing.autoProductivity) {
      const autoRates = deriveAutoProductivityRates(numeric);
      updated.prodWideOpen = autoRates.wide;
      updated.prodTight = autoRates.tight;
    }

    updatePricing(updated);

    if (key === "materialOC") {
      setMaterialType("OC");
    } else if (key === "materialCC") {
      setMaterialType("CC");
    }
  };

  const handleAutoToggle = (checked: boolean) => {
    if (pricing.autoProductivity === checked) return;

    const updates: Partial<PricingSettingsState> = { autoProductivity: checked };
    if (checked) {
      const autoRates = deriveAutoProductivityRates(pricing.prodTypical);
      updates.prodWideOpen = autoRates.wide;
      updates.prodTight = autoRates.tight;
      setDraft((prev) => ({
        ...prev,
        prodWideOpen: formatNumber(autoRates.wide),
        prodTight: formatNumber(autoRates.tight),
      }));
    }

    updatePricing(updates);
  };

  const preview = useMemo(
    () => calculatePricingPreview(pricing, materialType, condition),
    [pricing, materialType, condition]
  );

  const {
    boardFeet,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-3 md:px-0">
      {/* LEFT COLUMN */}
      <div className="space-y-4 sm:space-y-6 order-last sm:order-first">
        {/* === LABOR CONFIG === */}
        <Card className="p-5 rounded-xl border border-default/20 bg-default/40 dark:bg-background/40 backdrop-blur-md shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
          <h3 className="font-semibold text-base mb-3">Labor Configuration</h3>
          <div className="grid gap-3">
            <Input
              label={withTip("Crew Labor Rate","Hourly wage per technician used when estimating labor cost.")}
              value={draft.laborRate}
              onChange={(e) => handleNumericChange("laborRate", e.target.value)}
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
              label={withTip("Average Crew Size","Number of technicians assumed to be on the crew for previews.")}
              value={draft.crewSize}
              onChange={(e) => handleNumericChange("crewSize", e.target.value)}
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
              <span className="text-xs text-foreground/60 flex items-center gap-1">
                Auto
                <InfoTip content="When enabled, wide and tight productivity values follow the multipliers from the typical rate." />
              </span>
              <Switch
                size="sm"
                isSelected={pricing.autoProductivity}
                onValueChange={handleAutoToggle}
                color="primary"
                className="scale-90"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Input
              label={withTip("Typical (bdft/hr)","Baseline production rate in board feet per hour.")}
              value={draft.prodTypical}
              onChange={(e) => handleNumericChange("prodTypical", e.target.value)}
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
              label={withTip("Wide-Open (bdft/hr)","Faster production rate for open areas. Auto mode derives this from the typical rate.")}
              value={draft.prodWideOpen}
              onChange={(e) => handleNumericChange("prodWideOpen", e.target.value)}
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
              label={withTip("Tight (bdft/hr)","Slower production rate for tight spaces. Auto mode derives this from the typical rate.")}
              value={draft.prodTight}
              onChange={(e) => handleNumericChange("prodTight", e.target.value)}
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
              label={withTip("Open-Cell Cost ($/bdft)","Material cost per board foot for open-cell foam.")}
              type="number"
              value={draft.materialOC}
              onChange={(e) => handleNumericChange("materialOC", e.target.value)}
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
              label={withTip("Closed-Cell Cost ($/bdft)","Material cost per board foot for closed-cell foam.")}
              type="number"
              value={draft.materialCC}
              onChange={(e) => handleNumericChange("materialCC", e.target.value)}
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
              label={withTip("Material Markup","Percentage added to raw material cost before overhead and profit.")}
              value={draft.materialMarkup}
              onChange={(e) => handleNumericChange("materialMarkup", e.target.value)}
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
              label={withTip("Overhead","Percentage applied on the subtotal to cover overhead expenses.")}
              value={draft.overhead}
              onChange={(e) => handleNumericChange("overhead", e.target.value)}
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
              label={withTip("Profit Margin","Percentage of profit applied after overhead.")}
              value={draft.profitMargin}
              onChange={(e) => handleNumericChange("profitMargin", e.target.value)}
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
            label={withTip("Mobilization Fee","Flat fee added to cover travel and job start-up costs.")}
            value={draft.mobilizationFee}
            onChange={(e) => handleNumericChange("mobilizationFee", e.target.value)}
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
        boardFeet={boardFeet}
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





