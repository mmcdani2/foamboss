import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Button,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useCompanySettings } from "@/state/useCompanySettings";
import { usePricingSettings } from "@/state/usePricingSettings";
import { useUserSettings } from "@/state/useUserSettings";
import CompanySettings from "./components/CompanySettings";
import PricingSettings from "./components/PricingSettings";
import TemplateSettings from "./components/TemplateSettings";
import UserSettings from "./components/UserSettings";
import IntegrationSettings from "./components/IntegrationSettings";
import { toast } from "sonner";
import { Building2, DollarSign, FileText, Users, Plug } from "lucide-react";
import type { User, Team, PayType } from "@/types/user";
import { TEAM_OPTIONS } from "@/types/user";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useMediaQuery } from "@react-hook/media-query";


const PAY_TYPES: PayType[] = ["Hourly", "Percentage", "Salary", "None"];

interface LegacySettings {
  companyName: string;
  address: string;
  phone: string;
  licenseNumber: string;
  laborRate: number;
  marginPercent: number;
  mobilizationFee: number;
  includeFuelSurcharge: boolean;
  prodTypical: number;
  prodWideOpen: number;
  prodTight: number;
  autoProductivity: boolean;
  crewSize: number;
  materialOC: number;
  materialCC: number;
  materialMarkup: number;
  overhead: number;
  profitMargin: number;
  users: unknown[];
}

const LEGACY_SETTINGS_STORAGE_KEY = "foamboss-settings-storage";
const LEGACY_DEFAULTS: LegacySettings = {
  companyName: "",
  address: "",
  phone: "",
  licenseNumber: "",
  laborRate: 35,
  marginPercent: 25,
  mobilizationFee: 50,
  includeFuelSurcharge: false,
  prodTypical: 900,
  prodWideOpen: 1260,
  prodTight: 630,
  autoProductivity: true,
  crewSize: 3,
  materialOC: 0.45,
  materialCC: 1.0,
  materialMarkup: 15,
  overhead: 10,
  profitMargin: 20,
  users: [],
};

const readLegacySettings = (): LegacySettings => {
  if (typeof window === "undefined") return { ...LEGACY_DEFAULTS };
  try {
    const raw = window.localStorage.getItem(LEGACY_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...LEGACY_DEFAULTS };
    const parsed = JSON.parse(raw);
    const stored =
      (parsed?.state?.settings as LegacySettings | undefined) ??
      (parsed?.settings as LegacySettings | undefined);
    if (!stored) return { ...LEGACY_DEFAULTS };
    return { ...LEGACY_DEFAULTS, ...stored };
  } catch {
    return { ...LEGACY_DEFAULTS };
  }
};

const persistLegacySettings = (settings: LegacySettings) => {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      state: { settings },
      version: 2,
    });
    window.localStorage.setItem(LEGACY_SETTINGS_STORAGE_KEY, payload);
  } catch {
    // Swallow storage exceptions (e.g., quota exceeded) to avoid runtime crashes.
  }
};

function useHydratedSettings() {
  const [settings, setSettings] = useState<LegacySettings>(() => readLegacySettings());
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setSettings(readLegacySettings());
    setHydrated(true);
  }, []);

  const updateSettings = (data: Partial<LegacySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...data };
      persistLegacySettings(next);
      return next;
    });
  };

  return { settings, updateSettings, hydrated };
}

export default function SettingsPage() {
  const { settings, updateSettings, hydrated } = useHydratedSettings();
  const company = useCompanySettings((s) => s.company);
  const updateCompany = useCompanySettings((s) => s.updateCompany);
  const pricingSettings = usePricingSettings((s) => s.pricing);
  const updatePricing = usePricingSettings((s) => s.updatePricing);
  const setUsers = useUserSettings((s) => s.setUsers);
  const users = useUserSettings((s) => s.users);
  const [activeTab, setActiveTab] = useState("company");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [quoteTemplate, setQuoteTemplate] = useState(
    "All work performed according to manufacturer’s specifications. Payment due upon completion unless otherwise noted."
  );

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!hydrated || initializedRef.current) return;
    initializedRef.current = true;

    const nextCompany = {
      companyName: settings.companyName,
      licenseNumber: settings.licenseNumber,
      address: settings.address,
      phone: settings.phone,
    };

    updateCompany(nextCompany);

    if (Array.isArray(settings.users)) {
      const defaultTeam: Team = "Helpers";
      const mappedUsers: User[] = (settings.users as unknown as any[]).map((legacy) => {
        const payType = PAY_TYPES.includes(legacy.payType as PayType)
          ? (legacy.payType as PayType)
          : "None";
        const team = TEAM_OPTIONS.includes(legacy.team as Team)
          ? (legacy.team as Team)
          : defaultTeam;
        return {
          id: legacy.id ?? crypto.randomUUID(),
          name: legacy.name ?? "",
          role: legacy.role ?? "",
          status: legacy.status ?? "Active",
          payType,
          team,
          email: legacy.email ?? "",
          hourlyRate:
            typeof legacy.hourlyRate === "number" ? legacy.hourlyRate : undefined,
          percentageRate:
            typeof legacy.percentageRate === "number"
              ? legacy.percentageRate
              : undefined,
          avatar: legacy.avatar,
        };
      });
      setUsers(mappedUsers);
    }

    const nextPricing = {
      laborRate: settings.laborRate,
      crewSize: settings.crewSize,
      prodTypical: settings.prodTypical,
      prodWideOpen: settings.prodWideOpen,
      prodTight: settings.prodTight,
      autoProductivity: settings.autoProductivity,
      materialOC: settings.materialOC,
      materialCC: settings.materialCC,
      materialMarkup: settings.materialMarkup,
      overhead: settings.overhead,
      profitMargin: settings.profitMargin,
      mobilizationFee: settings.mobilizationFee,
    };

    updatePricing(nextPricing);
  }, [hydrated, settings, updateCompany, updatePricing, setUsers]);

  const handleSave = () => {
    updateSettings({
      companyName: company.companyName,
      address: company.address,
      phone: company.phone,
      licenseNumber: company.licenseNumber,
      laborRate: pricingSettings.laborRate,
      marginPercent: settings.marginPercent,
      mobilizationFee: pricingSettings.mobilizationFee,
      includeFuelSurcharge: settings.includeFuelSurcharge,
      crewSize: pricingSettings.crewSize,
      prodTypical: pricingSettings.prodTypical,
      prodWideOpen: pricingSettings.prodWideOpen,
      prodTight: pricingSettings.prodTight,
      autoProductivity: pricingSettings.autoProductivity,
      materialOC: pricingSettings.materialOC,
      materialCC: pricingSettings.materialCC,
      materialMarkup: pricingSettings.materialMarkup,
      overhead: pricingSettings.overhead,
      profitMargin: pricingSettings.profitMargin,
      users: users.map((user) => ({ ...user })),
    });

    toast.success("Settings saved successfully!", {
      description: "All configuration changes have been updated.",
    });
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
          {isMobile ? (
            // --- Mobile: HeroUI Dropdown ---
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  color="secondary"
                  className="w-full justify-between bg-purple-500/20 border border-purple-400/30 text-white font-medium backdrop-blur-lg"
                >
                  {(() => {
                    switch (activeTab) {
                      case "company":
                        return <>🏢 Company</>;
                      case "pricing":
                        return <>💵 Pricing</>;
                      case "templates":
                        return <>📄 Templates</>;
                      case "users":
                        return <>👥 Users</>;
                      case "integrations":
                        return <>🔌 Integrations</>;
                      default:
                        return <>Select Section</>;
                    }
                  })()}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Settings Menu"
                variant="flat"
                color="secondary"
                className="min-w-[200px]"
                onAction={(key) => setActiveTab(key as string)}
                selectedKeys={[activeTab]}
              >
                <DropdownItem key="company">🏢 Company</DropdownItem>
                <DropdownItem key="pricing">💵 Pricing</DropdownItem>
                <DropdownItem key="templates">📄 Templates</DropdownItem>
                <DropdownItem key="users">👥 Users</DropdownItem>
                <DropdownItem key="integrations">🔌 Integrations</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            // --- Desktop: Original HeroUI Tabs (unchanged styling) ---
            <Tabs
              aria-label="Settings Tabs"
              color="secondary"
              variant="solid"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              classNames={{
                tabList: [
                  "bg-default/30 dark:bg-background/30 backdrop-blur-sm",
                  "shadow-sm dark:shadow-md rounded-xl p-1 transition-all duration-300",
                ].join(" "),
                tabContent: [
                  "text-[15px] font-normal transition-colors",
                  "text-foreground dark:text-foreground",
                ].join(" "),
              }}
            >
              <Tab
              key="company"
              title={
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  Company
                </span>
              }
            />
              <Tab
              key="pricing"
              title={
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" aria-hidden="true" />
                  Pricing
                </span>
              }
            />
              <Tab
              key="templates"
              title={
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Templates
                </span>
              }
            />
              <Tab
              key="users"
              title={
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Users
                </span>
              }
            />
              <Tab
              key="integrations"
              title={
                <span className="flex items-center gap-2">
                  <Plug className="h-4 w-4" aria-hidden="true" />
                  Integrations
                </span>
              }
            />
            </Tabs>
          )}
          <div className="mt-6">
            {activeTab === "company" && <CompanySettings />}
            {activeTab === "pricing" && <PricingSettings />}
            {activeTab === "templates" && (
              <TemplateSettings
                quoteTemplate={quoteTemplate}
                setQuoteTemplate={setQuoteTemplate}
              />
            )}
            {activeTab === "users" && <UserSettings />}
            {activeTab === "integrations" && <IntegrationSettings />}
          </div>

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







