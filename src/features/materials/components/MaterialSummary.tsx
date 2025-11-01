import { Card, CardHeader, CardBody, Progress } from "@heroui/react";
import { FC } from "react";

interface MaterialSummaryProps {
    totalInventoryValue: number;
    topYield: { material_name: string; material_types?: { type_name?: string } } | null;
}

export const MaterialSummary: FC<MaterialSummaryProps> = ({
    totalInventoryValue,
    topYield,
}) => {
    return (
        <Card shadow="md" className="bg-content2 border border-default/20">
            <CardHeader>
                <h2 className="font-semibold text-lg text-foreground">Summary</h2>
            </CardHeader>
            <CardBody className="grid sm:grid-cols-2 gap-6">
                <div>
                    <p className="text-default-500 text-sm">Total Inventory Value</p>
                    <p className="text-2xl font-semibold text-success">
                        $
                        {totalInventoryValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                    <Progress
                        value={(totalInventoryValue / 100000) * 100}
                        color="success"
                        className="mt-2"
                    />
                </div>
                <div>
                    <p className="text-default-500 text-sm">Top Yield Material</p>
                    <p className="text-2xl font-semibold text-secondary">
                        {topYield?.material_name ?? "N/A"}
                    </p>
                    <p className="text-sm text-default-500">
                        {topYield?.material_types?.type_name ?? ""}
                    </p>
                </div>
            </CardBody>
        </Card>
    );
};
