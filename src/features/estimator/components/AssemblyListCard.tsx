import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Divider,
  Chip,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useEstimatorStore } from "@/state/estimatorStore";
import AddAssemblyModal from "@/features/estimator/components/AddAssemblyModal";
import { useState } from "react";

interface AssemblyListCardProps {
  onNext: () => void;
}

export default function AssemblyListCard({ onNext }: AssemblyListCardProps) {
  const { assemblies, removeAssembly } = useEstimatorStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <Card shadow="md" className="bg-content2 border border-default/20">
        <CardHeader className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-foreground">Assemblies</h2>
          <Button
            color="secondary"
            startContent={<Plus className="w-5 h-5" />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Add Assembly
          </Button>
        </CardHeader>

        <CardBody>
          {assemblies.length === 0 ? (
            <p className="text-default-500 italic">
              No assemblies added yet. Click “Add Assembly” to begin.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {assemblies.map((asm) => (
                <Card
                  key={asm.id}
                  shadow="sm"
                  className="bg-content3 border border-default/10"
                >
                  <CardHeader className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">
                      {asm.name}
                    </span>
                    <Chip color="secondary" size="sm" variant="flat">
                      {asm.type}
                    </Chip>
                  </CardHeader>
                  <CardBody className="text-sm text-default-600">
                    <p><strong>Foam:</strong> {asm.foamType}</p>
                    <p><strong>Thickness:</strong> {asm.thickness}"</p>
                    <p><strong>Board Feet:</strong> {asm.boardFeet.toLocaleString()}</p>
                    <p><strong>Material Cost:</strong> ${asm.materialCost.toFixed(2)}</p>
                    <p><strong>Labor Cost:</strong> ${asm.laborCost.toFixed(2)}</p>
                    <p><strong>Margin:</strong> {asm.margin}%</p>
                    <Divider className="my-2" />
                    <p>
                      <strong>Total Cost:</strong>{" "}
                      <span className="text-success font-semibold">
                        ${asm.totalCost.toFixed(2)}
                      </span>
                    </p>
                    <Divider className="my-2" />
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={() => removeAssembly(asm.id)}
                    >
                      Delete
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Assembly Modal */}
      <AddAssemblyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <div className="flex justify-end mt-6">
        <Button color="secondary" onPress={onNext}>
          Next →
        </Button>
      </div>
    </>
  );
}
