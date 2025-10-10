import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Select,
    SelectItem,
    Button,
} from "@heroui/react";
import { useState } from "react";
import { Calculator } from "lucide-react";

interface JobFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JobForm({ isOpen, onClose }: JobFormProps) {
    const [customer, setCustomer] = useState("");
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");
    const [foamType, setFoamType] = useState("");
    const [thickness, setThickness] = useState("");
    const [rValue, setRValue] = useState("");

    const foamOptions = [
        { key: "open", label: "Open-Cell Foam" },
        { key: "closed", label: "Closed-Cell Foam" },
    ];

    const handleGenerateEstimate = () => {
        if (!customer || !address || !area || !foamType) {
            alert("Please complete all required fields.");
            return;
        }
        alert(
            `Estimate generated for ${customer} — ${area} sq ft of ${foamType} foam at ${thickness}" thickness, target R-Value ${rValue}`
        );
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            size="lg"
            backdrop="blur"
            scrollBehavior="inside"
        >
            <ModalContent className="bg-content2 border border-default/20 text-foreground">
                <ModalHeader className="text-xl font-semibold text-secondary">
                    New Job Estimate
                </ModalHeader>

                <ModalBody className="space-y-4">
                    <Input
                        label="Customer Name"
                        placeholder="Enter customer name"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        isRequired
                    />
                    <Input
                        label="Address"
                        placeholder="Enter job address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        isRequired
                    />
                    <Input
                        label="Area (sq ft)"
                        type="number"
                        placeholder="e.g. 2500"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        isRequired
                    />
                    <Select
                        label="Foam Type"
                        selectedKeys={foamType ? [foamType] : []}
                        onChange={(e) => setFoamType(e.target.value)}
                        isRequired
                    >
                        {foamOptions.map((opt) => (
                            <SelectItem key={opt.key}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="Thickness (inches)"
                        type="number"
                        placeholder="e.g. 6"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                    />
                    <Input
                        label="Target R-Value"
                        type="number"
                        placeholder="e.g. 19"
                        value={rValue}
                        onChange={(e) => setRValue(e.target.value)}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="flat" color="default" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color="secondary"
                        variant="solid"
                        startContent={<Calculator className="w-4 h-4" />}
                        onPress={handleGenerateEstimate}
                    >
                        Generate Estimate
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
