import { Input, Switch } from "@heroui/react";

interface PricingSettingsProps {
  pricing: {
    laborRate: string;
    margin: string;
    mobilization: string;
    fuelSurcharge: boolean;
  };
  setPricing: React.Dispatch<
    React.SetStateAction<{
      laborRate: string;
      margin: string;
      mobilization: string;
      fuelSurcharge: boolean;
    }>
  >;
}

export default function PricingSettings({ pricing, setPricing }: PricingSettingsProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <Input
        label="Default Labor Rate ($/bdft)"
        type="number"
        value={pricing.laborRate}
        onChange={(e) => setPricing({ ...pricing, laborRate: e.target.value })}
      />
      <Input
        label="Margin (%)"
        type="number"
        value={pricing.margin}
        onChange={(e) => setPricing({ ...pricing, margin: e.target.value })}
      />
      <Input
        label="Mobilization Fee ($)"
        type="number"
        value={pricing.mobilization}
        onChange={(e) => setPricing({ ...pricing, mobilization: e.target.value })}
      />
      <div className="flex items-center gap-3 mt-2">
        <Switch
          isSelected={pricing.fuelSurcharge}
          onValueChange={(val) => setPricing({ ...pricing, fuelSurcharge: val })}
        >
          Include Fuel Surcharge
        </Switch>
      </div>
    </div>
  );
}
