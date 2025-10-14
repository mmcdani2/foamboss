import {
    Button,
    Progress,
} from "@heroui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEstimatorStore } from "@/state/estimatorStore";
import AddAssemblyModal from "@/features/estimator/components/AddAssemblyModal";
import EstimateSetupCard from "./components/EstimateSetupCard";
import AssemblyListCard from "./components/AssemblyListCard";
import SummaryCard from "./components/SummaryCard";

export default function EstimatorPage() {
    const steps = ["Estimate Setup", "Add Assemblies", "Summary"];
    const [currentStep, setCurrentStep] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const { saveEstimate } = useEstimatorStore();

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
                        {currentStep === 0 && <EstimateSetupCard onNext={() => setCurrentStep(1)} />}



                        {/* --- Step 2: Add Assemblies --- */}
                        {currentStep === 1 && <AssemblyListCard onNext={() => setCurrentStep(2)} />}


                        {/* --- Step 3: Summary --- */}
                        {currentStep === 2 && <SummaryCard onBack={() => setCurrentStep(1)} />}


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
