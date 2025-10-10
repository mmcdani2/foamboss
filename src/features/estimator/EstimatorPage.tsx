import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Select,
    SelectItem,
    Button,
    Progress,
    Divider,
    Chip,
} from "@heroui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useEstimatorStore } from "@/features/estimator/store/estimatorStore";
import AddAssemblyModal from "@/features/assemblies/AddAssemblyModal";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useMaterialStore } from "@/features/materials/store/materialStore";


export default function EstimatorPage() {
    const steps = ["Estimate Setup", "Add Assemblies", "Summary"];
    const [currentStep, setCurrentStep] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { settings } = useSettingsStore();
    const { materials } = useMaterialStore();

    const { estimate, setEstimate, assemblies, removeAssembly } = useEstimatorStore();

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-background text-foreground">
            {/* --- Sticky Top Progress --- */}
            <div className="sticky top-0 z-20 bg-content2 border-b border-default/20 p-4">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-semibold text-secondary tracking-tight">
                        Estimator
                    </h1>
                    <span className="text-sm text-default-500">
                        Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
                    </span>
                </div>
                <Progress
                    value={((currentStep + 1) / steps.length) * 100}
                    color="secondary"
                    className="h-2"
                />
            </div>

            {/* --- Main Content --- */}
            <div className="flex-1 p-6 flex flex-col items-center justify-start">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-4xl"
                    >
                        {/* --- Step 1: Estimate Setup --- */}
                        {currentStep === 0 && (
                            <Card shadow="md" className="bg-content2 border border-default/20 max-w-2xl mx-auto">
                                <CardHeader>
                                    <h2 className="text-lg font-semibold text-foreground">Estimate Setup</h2>
                                </CardHeader>
                                <CardBody className="flex flex-col gap-4">
                                    <Input
                                        label="Job Name"
                                        placeholder="Ex: Smith Residence"
                                        value={estimate.jobName || ""}
                                        onChange={(e) =>
                                            setEstimate({ ...estimate, jobName: e.target.value })
                                        }
                                    />
                                    <Input
                                        label="Customer Name"
                                        placeholder="Ex: John Smith"
                                        value={estimate.customerName || ""}
                                        onChange={(e) =>
                                            setEstimate({ ...estimate, customerName: e.target.value })
                                        }
                                    />
                                    <Select
                                        label="Building Type"
                                        selectedKeys={[estimate.buildingType || "Residential"]}
                                        onChange={(e) =>
                                            setEstimate({ ...estimate, buildingType: e.target.value })
                                        }
                                    >
                                        {["Residential", "Commercial", "Pole Barn", "Metal Building"].map(
                                            (type) => (
                                                <SelectItem key={type}>{type}</SelectItem>
                                            )
                                        )}
                                    </Select>

                                    <Select
                                        label="Default Foam Type"
                                        selectedKeys={[estimate.defaultFoam || "Open-Cell"]}
                                        onChange={(e) =>
                                            setEstimate({ ...estimate, defaultFoam: e.target.value })
                                        }
                                    >
                                        {["Open-Cell", "Closed-Cell", "Roof Deck"].map((foam) => (
                                            <SelectItem key={foam}>{foam}</SelectItem>
                                        ))}
                                    </Select>
                                </CardBody>
                                <CardFooter className="flex justify-end">
                                    <Button
                                        color="secondary"
                                        variant="solid"
                                        onPress={() => setCurrentStep(1)}
                                    >
                                        Next →
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}


                        {/* --- Step 2: Add Assemblies --- */}
                        {currentStep === 1 && (
                            <div className="flex flex-col gap-6">
                                <Card shadow="md" className="bg-content2 border border-default/20">
                                    <CardHeader className="flex justify-between items-center">
                                        <h2 className="font-semibold text-lg text-foreground">
                                            Assemblies
                                        </h2>
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
                                                            <p>
                                                                <strong>Foam:</strong> {asm.foamType}
                                                            </p>
                                                            <p>
                                                                <strong>Board Feet:</strong>{" "}
                                                                {asm.boardFeet.toLocaleString()}
                                                            </p>
                                                            <p>
                                                                <strong>Total Cost:</strong> $
                                                                {asm.totalCost.toFixed(2)}
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
                            </div>
                        )}

                        {/* --- Step 3: Summary (Placeholder) --- */}
                        {currentStep === 2 && (
                            <div className="flex flex-col gap-6">
                                <Card shadow="md" className="bg-content2 border border-default/20">
                                    <CardHeader>
                                        <h2 className="font-semibold text-lg text-foreground">
                                            Estimate Summary
                                        </h2>
                                    </CardHeader>

                                    <CardBody className="flex flex-col gap-6">
                                        {/* --- Assembly Summary List --- */}
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
                                                            <Chip color="secondary" size="sm" variant="flat">
                                                                {asm.type}
                                                            </Chip>
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

                                        {/* --- Total Summary + Chart --- */}
                                        {assemblies.length > 0 && (
                                            <Card shadow="sm" className="bg-content3 border border-default/10">
                                                <CardHeader>
                                                    <h3 className="font-semibold text-md text-foreground">
                                                        Total Summary
                                                    </h3>
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
                                            <Button color="secondary" variant="flat">
                                                Preview Quote
                                            </Button>
                                            <Button color="secondary" variant="solid">
                                                Save Estimate
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* --- Sticky Footer Navigation --- */}
            <div className="sticky bottom-0 z-20 bg-content2 border-t border-default/20 p-4 flex justify-between items-center">
                <Button
                    color="default"
                    variant="flat"
                    onPress={prevStep}
                    isDisabled={currentStep === 0}
                >
                    Back
                </Button>

                <Button
                    color="secondary"
                    onPress={nextStep}
                    isDisabled={currentStep === steps.length - 1}
                >
                    {currentStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
            </div>

            {/* --- Add Assembly Modal --- */}
            <AddAssemblyModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
