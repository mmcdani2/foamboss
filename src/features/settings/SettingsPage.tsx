import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useHydratedSettings } from "@/features/settings/store/settingsStore";
import CompanySettings from "./components/Companysettings";
import PricingSettings from "./components/Pricingsettings";
import TemplateSettings from "./components/TemplateSettings";
import UserSettings from "./components/UserSettings";
import IntegrationSettings from "./components/IntegrationSettings";

export default function SettingsPage() {
  const { settings, updateSettings, hydrated } = useHydratedSettings();

  // --- Local UI state mirrors persisted data ---
  const [company, setCompany] = useState({
    name: "",
    address: "",
    phone: "",
    license: "",
  });

  const [pricing, setPricing] = useState({
    laborRate: "",
    margin: "",
    mobilization: "",
    fuelSurcharge: false,
  });

  const [quoteTemplate, setQuoteTemplate] = useState(
    "All work performed according to manufacturer’s specifications. Payment due upon completion unless otherwise noted."
  );

  // --- Hydration sync ---
  useEffect(() => {
    if (hydrated) {
      setCompany({
        name: settings.companyName || "",
        address: settings.address || "",
        phone: settings.phone || "",
        license: settings.licenseNumber || "",
      });
      setPricing({
        laborRate: settings.laborRate.toString(),
        margin: settings.marginPercent.toString(),
        mobilization: settings.mobilizationFee.toString(),
        fuelSurcharge: settings.includeFuelSurcharge,
      });
    }
  }, [hydrated, settings]);

  // --- Loading guard ---
  if (!hydrated)
    return (
      <div className="p-6 text-default-500 text-sm">
        Loading settings...
      </div>
    );

  // --- Persist updates ---
  const handleSave = () => {
    updateSettings({
      companyName: company.name,
      address: company.address,
      phone: company.phone,
      licenseNumber: company.license,
      laborRate: parseFloat(pricing.laborRate),
      marginPercent: parseFloat(pricing.margin),
      mobilizationFee: parseFloat(pricing.mobilization),
      includeFuelSurcharge: pricing.fuelSurcharge,
    });

    alert("Settings saved successfully!");
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold text-secondary mb-6">Settings</h1>

      <Card shadow="md" className="bg-content2 border border-default/20">
        <CardHeader>
          <h2 className="font-semibold text-lg text-foreground">
            Configuration Center
          </h2>
        </CardHeader>

        <CardBody>
          <Tabs
            color="secondary"
            variant="underlined"
            aria-label="Settings Tabs"
          >
            <Tab key="company" title="Company">
              <CompanySettings
                company={company}
                setCompany={setCompany}
              />
            </Tab>

            <Tab key="pricing" title="Pricing">
              <PricingSettings
                pricing={pricing}
                setPricing={setPricing}
              />
            </Tab>

            <Tab key="templates" title="Templates">
              <TemplateSettings
                quoteTemplate={quoteTemplate}
                setQuoteTemplate={setQuoteTemplate}
              />
            </Tab>

            <Tab key="users" title="Users">
              <UserSettings />
            </Tab>

            <Tab key="integrations" title="Integrations">
              <IntegrationSettings />
            </Tab>
          </Tabs>

          {/* --- Save Button --- */}
          <div className="flex justify-end mt-6">
            <Button color="secondary" onPress={handleSave}>
              Save All Settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
