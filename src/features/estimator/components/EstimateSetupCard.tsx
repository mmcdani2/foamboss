// src/features/estimator/components/EstimateSetupCard.tsx
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { useEstimatorStore } from "@/features/estimator/store/estimatorStore";

interface EstimateSetupCardProps {
  onNext: () => void;
}

export default function EstimateSetupCard({ onNext }: EstimateSetupCardProps) {
  const { estimate, setEstimate } = useEstimatorStore();

  return (
    <Card shadow="md" className="bg-content2 border border-default/20 max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-lg font-semibold text-foreground">Estimate Setup</h2>
      </CardHeader>

      <CardBody className="flex flex-col gap-4">
        <Input
          label="Job Name"
          placeholder="Ex: Smith Residence"
          value={estimate.jobName || ""}
          onChange={(e) => setEstimate({ ...estimate, jobName: e.target.value })}
        />
        <Input
          label="Customer Name"
          placeholder="Ex: John Smith"
          value={estimate.customerName || ""}
          onChange={(e) => setEstimate({ ...estimate, customerName: e.target.value })}
        />

        <Select
          label="Building Type"
          selectedKeys={[estimate.buildingType || "Residential"]}
          onChange={(e) => setEstimate({ ...estimate, buildingType: e.target.value })}
        >
          {["Residential", "Commercial", "Pole Barn", "Metal Building"].map((type) => (
            <SelectItem key={type}>{type}</SelectItem>
          ))}
        </Select>

        <Select
          label="Default Foam Type"
          selectedKeys={[estimate.defaultFoam || "Open-Cell"]}
          onChange={(e) => setEstimate({ ...estimate, defaultFoam: e.target.value })}
        >
          {["Open-Cell", "Closed-Cell", "Roof Deck"].map((foam) => (
            <SelectItem key={foam}>{foam}</SelectItem>
          ))}
        </Select>
      </CardBody>

      <CardFooter className="flex justify-end">
        <Button color="secondary" variant="solid" onPress={onNext}>
          Next →
        </Button>
      </CardFooter>
    </Card>
  );
}
