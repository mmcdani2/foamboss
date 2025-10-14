// src/features/settings/components/PricingSettings.tsx
import {
  Card,
  CardBody,
  Input,
  Switch,
  Tabs,
  Tab,
} from "@heroui/react";
import InfoTip from "@/components/ui/InfoTip";
import { useMemo, useState } from "react";
import { useSettingsStore } from "@/state/settingsStore";

export default function PricingSettings() {
  const { settings, updateSettings } = useSettingsStore();

  // === UI States ===
  const [materialType, setMaterialType] = useState<"OC" | "CC">("OC");
  const [condition, setCondition] = useState<"wide" | "typical" | "tight">("typical");

  // === Handler ===
  const handleChange = (key: string, value: number | string | boolean) => {
    const updated: Record<string, any> = { [key]: value };

    // Auto productivity recalculation
    if (
      (key === "prodTypical" && settings.autoProductivity) ||
      (key === "autoProductivity" && value === true)
    ) {
      const typical = key === "prodTypical" ? Number(value) : settings.prodTypical;
      updated.prodWideOpen = Math.round(typical * 1.4);
      updated.prodTight = Math.round(typical * 0.7);
    }

    updateSettings(updated);
  };

  // === Derived Calculations (Reactive) ===
  const {
    productivity,
    markedUpMaterial,
    laborHours,
    laborCost,
    estimatedSell,
    overhead,
    profitMargin,
  } = useMemo(() => {
    const exampleBoardFeet = 1000;
    const ocCost = settings.materialOC ?? 0.45;
    const ccCost = settings.materialCC ?? 1.0;
    const materialCostPerBdft = materialType === "OC" ? ocCost : ccCost;

    const materialMarkup = settings.materialMarkup ?? 15;
    const mobilizationFee = settings.mobilizationFee ?? 50;
    const overhead = settings.overhead ?? 10;
    const profitMargin = settings.profitMargin ?? 20;
    const laborRate = settings.laborRate ?? 35;
    const crewSize = settings.crewSize ?? 2;

    const prodTypical = settings.prodTypical ?? 900;
    const prodWide = settings.autoProductivity ? Math.round(prodTypical * 1.4) : settings.prodWideOpen ?? 1200;
    const prodTight = settings.autoProductivity ? Math.round(prodTypical * 0.7) : settings.prodTight ?? 600;

    const productivity =
      condition === "wide" ? prodWide : condition === "typical" ? prodTypical : prodTight;

    const rawMaterialCost = materialCostPerBdft * exampleBoardFeet;
    const markedUpMaterial = rawMaterialCost * (1 + materialMarkup / 100);
    const laborHours = exampleBoardFeet / productivity;
    const laborCost = laborHours * laborRate * crewSize;
    const jobCost = laborCost + markedUpMaterial + mobilizationFee;
    const overheadMult = 1 + overhead / 100;
    const profitMult = 1 + profitMargin / 100;
    const estimatedSell = (jobCost * overheadMult * profitMult).toFixed(2);

    return {
      productivity,
      markedUpMaterial,
      laborHours,
      laborCost,
      estimatedSell,
      overhead,
      profitMargin,
    };
  }, [settings, materialType, condition]);

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
              value={String(settings.laborRate ?? "")}
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
              value={String(settings.crewSize ?? "")}
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
                isSelected={settings.autoProductivity}
                onChange={(e) => handleChange("autoProductivity", e.target.checked)}
                color="primary"
                className="scale-90"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Input
              label="Typical (bdft/hr)"
              value={String(settings.prodTypical ?? "")}
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
                settings.autoProductivity
                  ? Math.round((settings.prodTypical || 0) * 1.4)
                  : settings.prodWideOpen ?? ""
              )}
              onChange={(e) => handleChange("prodWideOpen", +e.target.value)}
              isDisabled={!!settings.autoProductivity}
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
                settings.autoProductivity
                  ? Math.round((settings.prodTypical || 0) * 0.7)
                  : settings.prodTight ?? ""
              )}
              onChange={(e) => handleChange("prodTight", +e.target.value)}
              isDisabled={!!settings.autoProductivity}
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
            <Input
              label="Open-Cell Cost ($/bdft)"
              value={String(settings.materialOC ?? "")}
              onChange={(e) => handleChange("materialOC", +e.target.value)}
              step="0.01"
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
              label="Closed-Cell Cost ($/bdft)"
              value={String(settings.materialCC ?? "")}
              onChange={(e) => handleChange("materialCC", +e.target.value)}
              step="0.01"
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
              label="Material Markup"
              value={String(settings.materialMarkup ?? "")}
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
              value={String(settings.overhead ?? "")}
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
              value={String(settings.profitMargin ?? "")}
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
            value={String(settings.mobilizationFee ?? "")}
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

      {/* RIGHT COLUMN — PREVIEW */}
      <div className="order-last sm:order-last">
        <Card
          className={[
            "p-5 rounded-xl",
            "bg-default/40 dark:bg-background/40 backdrop-blur-md",
            "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
            "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300",
          ].join(" ")}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base sm:text-lg text-default-700 dark:text-default-700">
              Real-World Preview
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${materialType === "OC"
                    ? "text-primary font-semibold"
                    : "text-foreground/50"
                  }`}
              >
                OC
              </span>
              <Switch
                size="sm"
                isSelected={materialType === "CC"}
                onChange={(e) => setMaterialType(e.target.checked ? "CC" : "OC")}
                color="primary"
                className="scale-90"
              />
              <span
                className={`text-xs ${materialType === "CC"
                    ? "text-primary font-semibold"
                    : "text-foreground/50"
                  }`}
              >
                CC
              </span>
            </div>
          </div>

          <Tabs
            aria-label="Settings Tabs"
            color="secondary"
            variant="solid"
            classNames={{
              tabList: [
                // remove border, add soft background & shadow
                "bg-default/30 dark:bg-background/30 backdrop-blur-sm",
                "shadow-sm dark:shadow-md",
                "rounded-xl p-1",
                "transition-all duration-300",
              ].join(" "),
              tabContent: [
                "text-[15px] font-normal transition-colors",
                "text-foreground dark:text-foreground",
              ].join(" "),
            }}
          >
            {["wide", "typical", "tight"].map((key) => (
              <Tab key={key} title={conditionLabel(key)}>
                <Card
                  className={[
                    "rounded-xl bg-default/40 dark:bg-background/40 backdrop-blur-md",
                    "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                    "p-4 transition-all duration-300",
                  ].join(" ")}
                >
                  <CardBody className="space-y-4 text-sm sm:text-[15px]">
                    <p>
                      <span className="font-medium text-foreground/80">
                        Material Type:
                      </span>{" "}
                      {materialType === "OC" ? "Open-Cell" : "Closed-Cell"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">Job Size:</span>{" "}
                      1,000 bdft
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">
                        Productivity:
                      </span>{" "}
                      {productivity} bdft/hr
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">
                        Estimated Spray Time:
                      </span>{" "}
                      {laborHours.toFixed(1)} hrs
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">
                        Crew Labor Cost:
                      </span>{" "}
                      ${laborCost.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">
                        Material Cost (with markup):
                      </span>{" "}
                      ${markedUpMaterial.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">
                        Overhead & Margin:
                      </span>{" "}
                      {overhead}% / {profitMargin}%
                    </p>
                    <hr className="border-default/20 my-4" />
                    <div
                      className={[
                        "mt-4 rounded-lg bg-default/40 dark:bg-background/40 backdrop-blur-md",
                        "p-4 border border-default/30 flex flex-col sm:flex-row sm:items-center sm:justify-between",
                        "shadow-[0_3px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.25)]",
                      ].join(" ")}
                    >
                      <span className="text-sm sm:text-base font-semibold text-foreground/80 uppercase tracking-wide">
                        Estimated Sell Price
                      </span>
                      <span className="text-xl sm:text-xl font-semibold text-foreground/80 tracking-tight mt-2 sm:mt-0">
                        ${isNaN(Number(estimatedSell)) ? "0.00" : estimatedSell}
                      </span>
                    </div>
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
