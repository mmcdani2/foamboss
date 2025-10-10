import { Button } from "@heroui/react";
import { PlugZap, CreditCard, Mail } from "lucide-react";

export default function IntegrationSettings() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-2">
      <Button color="primary" startContent={<PlugZap className="w-4 h-4" />}>Connect QuickBooks</Button>
      <Button color="secondary" startContent={<CreditCard className="w-4 h-4" />}>Connect Stripe</Button>
      <Button color="default" startContent={<Mail className="w-4 h-4" />}>Email Setup</Button>
    </div>
  );
}
