import { Textarea, Button } from "@heroui/react";
import { Eye } from "lucide-react";

interface TemplateSettingsProps {
  quoteTemplate: string;
  setQuoteTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export default function TemplateSettings({ quoteTemplate, setQuoteTemplate }: TemplateSettingsProps) {
  return (
    <div>
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
    </div>
  );
}
