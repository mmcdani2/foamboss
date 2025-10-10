import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Input,
  Switch,
  Textarea,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Upload, Eye, UserPlus, PlugZap, CreditCard, Mail } from "lucide-react";
import { useHydratedSettings } from "@/features/settings/store/settingsStore";

export default function SettingsPage() {
  const { settings, updateSettings, hydrated } = useHydratedSettings();

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

  const users = [
    { name: "Alex McDaniel", role: "COO", status: "Active" },
    { name: "John Taylor", role: "Owner", status: "Active" },
    { name: "Daylon Smith", role: "Lead Installer", status: "Inactive" },
  ];

  // Wait for store to hydrate before loading data
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

  if (!hydrated)
    return (
      <div className="p-6 text-default-500 text-sm">Loading settings...</div>
    );

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
          <Tabs color="secondary" variant="underlined" aria-label="Settings Tabs">
            {/* --- Company --- */}
            <Tab key="company" title="Company">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Company Name"
                  value={company.name}
                  onChange={(e) =>
                    setCompany({ ...company, name: e.target.value })
                  }
                />
                <Input
                  label="License #"
                  value={company.license}
                  onChange={(e) =>
                    setCompany({ ...company, license: e.target.value })
                  }
                />
                <Input
                  label="Address"
                  value={company.address}
                  onChange={(e) =>
                    setCompany({ ...company, address: e.target.value })
                  }
                  className="sm:col-span-2"
                />
                <Input
                  label="Phone"
                  value={company.phone}
                  onChange={(e) =>
                    setCompany({ ...company, phone: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button startContent={<Upload className="w-4 h-4" />}>
                  Upload Logo
                </Button>
              </div>
            </Tab>

            {/* --- Pricing --- */}
            <Tab key="pricing" title="Pricing">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Default Labor Rate ($/bdft)"
                  type="number"
                  value={pricing.laborRate}
                  onChange={(e) =>
                    setPricing({ ...pricing, laborRate: e.target.value })
                  }
                />
                <Input
                  label="Margin (%)"
                  type="number"
                  value={pricing.margin}
                  onChange={(e) =>
                    setPricing({ ...pricing, margin: e.target.value })
                  }
                />
                <Input
                  label="Mobilization Fee ($)"
                  type="number"
                  value={pricing.mobilization}
                  onChange={(e) =>
                    setPricing({ ...pricing, mobilization: e.target.value })
                  }
                />
                <div className="flex items-center gap-3 mt-2">
                  <Switch
                    isSelected={pricing.fuelSurcharge}
                    onValueChange={(val) =>
                      setPricing({ ...pricing, fuelSurcharge: val })
                    }
                  >
                    Include Fuel Surcharge
                  </Switch>
                </div>
              </div>
            </Tab>

            {/* --- Templates --- */}
            <Tab key="templates" title="Templates">
              <Textarea
                label="Quote Terms & Conditions"
                value={quoteTemplate}
                onChange={(e) => setQuoteTemplate(e.target.value)}
                minRows={5}
                className="mb-4"
              />
              <Button color="secondary" startContent={<Eye className="w-4 h-4" />}>
                Preview Template
              </Button>
            </Tab>

            {/* --- Users --- */}
            <Tab key="users" title="Users">
              <div className="flex justify-end mb-3">
                <Button color="secondary" startContent={<UserPlus className="w-4 h-4" />}>
                  Invite User
                </Button>
              </div>
              <Table
                aria-label="Users Table"
                shadow="none"
                classNames={{
                  th: "bg-content3 text-default-600 font-semibold",
                  td: "text-foreground text-sm",
                }}
              >
                <TableHeader>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Role</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                  {users.map((u, i) => (
                    <TableRow key={i}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>
                        <Chip
                          color={u.status === "Active" ? "success" : "warning"}
                          variant="flat"
                          size="sm"
                        >
                          {u.status}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="flat" color="danger">
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>

            {/* --- Integrations --- */}
            <Tab key="integrations" title="Integrations">
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Button color="primary" startContent={<PlugZap className="w-4 h-4" />}>
                  Connect QuickBooks
                </Button>
                <Button color="secondary" startContent={<CreditCard className="w-4 h-4" />}>
                  Connect Stripe
                </Button>
                <Button color="default" startContent={<Mail className="w-4 h-4" />}>
                  Email Setup
                </Button>
              </div>
            </Tab>
          </Tabs>

          {/* --- SAVE BUTTON --- */}
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
