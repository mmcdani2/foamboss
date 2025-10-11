import { Textarea, Button, Card } from "@heroui/react";
import { Eye } from "lucide-react";

interface TemplateSettingsProps {
  quoteTemplate: string;
  setQuoteTemplate: React.Dispatch<React.SetStateAction<string>>;
}

export default function TemplateSettings({ quoteTemplate, setQuoteTemplate }: TemplateSettingsProps) {
  return (
    <Card
      className={[
        "p-5 rounded-xl",
        "bg-default/40 dark:bg-background/40 backdrop-blur-md",
        "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
        "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300",
      ].join(" ")}
    >
      <h3 className="font-semibold text-base sm:text-lg text-default-700 dark:text-default-700 mb-4">
        Quote Template
      </h3>

      <Textarea
        label="Quote Terms & Conditions"
        value={quoteTemplate}
        onChange={(e) => setQuoteTemplate(e.target.value)}
        minRows={5}
        classNames={{
          inputWrapper: [
            "bg-default/70 dark:bg-background/40 backdrop-blur-md",
            "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
            "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
          ].join(" "),
          label: "text-default-700 dark:text-default-700 font-normal",
          input: "text-foreground",
        }}
        className="mb-5"
      />

      <div className="flex justify-end">
        <Button
          startContent={<Eye className="w-4 h-4" />}
          className={[
            "text-foreground bg-secondary",
            "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
            "hover:opacity-90 transition-all duration-300 text-sm h-[40px]",
          ].join(" ")}
        >
          Preview Template
        </Button>
      </div>
    </Card>
  );
}
