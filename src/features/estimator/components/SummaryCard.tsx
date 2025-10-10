import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Divider,
} from "@heroui/react";
import { useEstimatorStore } from "@/features/estimator/store/estimatorStore";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface SummaryCardProps {
  onBack: () => void;
}

export default function SummaryCard({ onBack }: SummaryCardProps) {
  const { assemblies, estimate } = useEstimatorStore();

  return (
    <Card shadow="md" className="bg-content2 border border-default/20">
      <CardHeader>
        <h2 className="font-semibold text-lg text-foreground">Estimate Summary</h2>
      </CardHeader>

      <CardBody className="flex flex-col gap-6">
        {/* --- Assembly Summary --- */}
        {assemblies.length === 0 ? (
          <p className="text-default-500 italic">
            No assemblies added. Go back and add at least one assembly.
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
                </CardHeader>
                <CardBody className="text-sm text-default-600">
                  <p><strong>Foam:</strong> {asm.foamType}</p>
                  <p><strong>Thickness:</strong> {asm.thickness}"</p>
                  <p><strong>Board Feet:</strong> {asm.boardFeet.toLocaleString()}</p>
                  <p><strong>Total Cost:</strong> ${asm.totalCost.toFixed(2)}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* --- Totals Summary --- */}
        {assemblies.length > 0 && (
          <Card shadow="sm" className="bg-content3 border border-default/10">
            <CardHeader>
              <h3 className="font-semibold text-md text-foreground">Total Summary</h3>
            </CardHeader>

            <CardBody className="flex flex-col sm:flex-row gap-8 items-center justify-between">
              <div>
                <p className="text-default-500 text-sm">Total Board Feet</p>
                <p className="text-2xl font-semibold text-foreground">
                  {estimate.totalBoardFeet.toLocaleString()}
                </p>

                <p className="text-default-500 text-sm mt-4">Total Estimate Cost</p>
                <p className="text-2xl font-semibold text-success">
                  ${estimate.totalCost.toFixed(2)}
                </p>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Material", value: estimate.totalCost * 0.6 },
                      { name: "Labor", value: estimate.totalCost * 0.3 },
                      { name: "Margin", value: estimate.totalCost * 0.1 },
                    ]}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill="#7828c8" />
                    <Cell fill="#17c964" />
                    <Cell fill="#f5a524" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(30,30,30,0.9)",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}

        {/* --- Action Buttons --- */}
        <div className="flex justify-end gap-4 mt-6">
          <Button color="default" variant="flat" onPress={onBack}>
            ← Back
          </Button>
          <Button color="secondary" variant="flat">
            Preview Quote
          </Button>
          <Button color="secondary" variant="solid">
            Save Estimate
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
