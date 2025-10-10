import { Input, Button } from "@heroui/react";
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
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <Input
        label="Company Name"
        value={company.name}
        onChange={(e) => setCompany({ ...company, name: e.target.value })}
      />
      <Input
        label="License #"
        value={company.license}
        onChange={(e) => setCompany({ ...company, license: e.target.value })}
      />
      <Input
        label="Address"
        className="sm:col-span-2"
        value={company.address}
        onChange={(e) => setCompany({ ...company, address: e.target.value })}
      />
      <Input
        label="Phone"
        value={company.phone}
        onChange={(e) => setCompany({ ...company, phone: e.target.value })}
      />
      <div className="flex items-center gap-3 mt-4">
        <Button startContent={<Upload className="w-4 h-4" />}>Upload Logo</Button>
      </div>
    </div>
  );
}
