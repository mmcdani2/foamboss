import { Input, Button, Card, CardBody } from "@heroui/react";
import { Upload } from "lucide-react";

interface CompanySettingsProps {
  company: {
    name: string;
    address: string;
    phone: string;
    license: string;
  };
  setCompany: React.Dispatch<
    React.SetStateAction<{
      name: string;
      address: string;
      phone: string;
      license: string;
    }>
  >;
}

export default function CompanySettings({ company, setCompany }: CompanySettingsProps) {
  // --- Format phone number as user types ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // strip non-digits
    if (value.length > 10) value = value.slice(0, 10);
    const formatted =
      value.length > 6
        ? `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`
        : value.length > 3
          ? `${value.slice(0, 3)}-${value.slice(3)}`
          : value;
    setCompany({ ...company, phone: formatted });
  };

  return (
    <Card
      shadow="sm"
      className="border border-default/20 bg-default/40 dark:bg-background/40 backdrop-blur-md rounded-xl"
    >
      <CardBody className="p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
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
            label="License #"
            value={company.license}
            onChange={(e) => setCompany({ ...company, license: e.target.value })}
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
            label="Address"
            className="sm:col-span-2"
            value={company.address}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
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

          <div className="flex items-center gap-3 mt-1">
            <Input
              label="Phone"
              value={company.phone}
              onChange={handlePhoneChange}
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

            <div className="flex items-center h-full">
              <Button
                startContent={<Upload className="w-3.5 h-3.5" />}
                className="h-[50px] px-4 rounded-lrg
      bg-secondary text-foreground font-regular
      shadow-[0_3px_8px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.1)]
      hover:opacity-90 transition-all duration-300"
              >
                Upload Logo
              </Button>
            </div>
          </div>

        </div>
      </CardBody>
    </Card>
  );
}
