// src/features/settings/components/PricingPreview.tsx
import React from "react";
import { Card, CardBody, Switch, Tabs, Tab } from "@heroui/react";

interface PricingPreviewProps {
  materialType: "OC" | "CC";
  setMaterialType: (type: "OC" | "CC") => void;
  conditionLabel: (key: string) => string;
  productivity: number;
  laborHours: number;
  laborCost: number;
  markedUpMaterial: number;
  overhead: number;
  profitMargin: number;
  estimatedSell: number; 
}

export default function PricingPreview({
  materialType,
  setMaterialType,
  conditionLabel,
  productivity,
  laborHours,
  laborCost,
  markedUpMaterial,
  overhead,
  profitMargin,
  estimatedSell,
}: PricingPreviewProps) {
  return (
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
              className={`text-xs ${
                materialType === "OC"
                  ? "text-primary font-semibold"
                  : "text-foreground/50"
              }`}
            >
              OC
            </span>

            <Switch
              size="sm"
              isSelected={materialType === "CC"}
              onChange={(e) =>
                setMaterialType(e.target.checked ? "CC" : "OC")
              }
              color="primary"
              className="scale-90"
            />

            <span
              className={`text-xs ${
                materialType === "CC"
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
                    <span className="font-medium text-foreground/80">
                      Job Size:
                    </span>{" "}
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
  );
}
