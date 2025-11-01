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
import { FC } from "react";

interface MaterialFormModalProps {
    isOpen: boolean;
    isEdit: boolean;
    form: any;
    categories: any[];
    types: any[];
    onChange: (key: string, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

export const MaterialFormModal: FC<MaterialFormModalProps> = ({
    isOpen,
    isEdit,
    form,
    categories,
    types,
    onChange,
    onSave,
    onCancel,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            placement="center"
            backdrop="blur"
        >
            <ModalContent className="bg-content2 border border-default/20">
                <ModalHeader className="text-secondary font-semibold">
                    {isEdit ? "Edit Material" : "Add Material"}
                </ModalHeader>
                <ModalBody className="space-y-4">
                    <Input
                        label="Material Name"
                        value={form.material_name}
                        onChange={(e) => onChange("material_name", e.target.value)}
                    />
                    <Select
                        label="Category"
                        selectedKeys={form.category_id ? [form.category_id] : []}
                        onChange={(e) => onChange("category_id", e.target.value)}
                    >
                        {categories.map((c) => (
                            <SelectItem key={c.id}>{c.category_name}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Material Type"
                        selectedKeys={form.material_type_id ? [form.material_type_id] : []}
                        onChange={(e) => onChange("material_type_id", e.target.value)}
                    >
                        {types
                            .filter((t) => t.category_id === form.category_id)
                            .map((t) => (
                                <SelectItem key={t.id}>{t.type_name}</SelectItem>
                            ))}
                    </Select>
                    <Input
                        label="Unit Type (e.g. set, 5gal, roll)"
                        value={form.unit_type}
                        onChange={(e) => onChange("unit_type", e.target.value)}
                    />
                    <Input
                        type="number"
                        label="Unit Price ($)"
                        value={form.unit_price}
                        onChange={(e) => onChange("unit_price", e.target.value)}
                    />
                    <Input
                        type="number"
                        label="Yield per Unit"
                        value={form.yield_per_unit}
                        onChange={(e) => onChange("yield_per_unit", e.target.value)}
                    />
                    <Input
                        type="number"
                        label="On-Hand Quantity"
                        value={form.quantity_on_hand}
                        onChange={(e) => onChange("quantity_on_hand", e.target.value)}
                    />
                    <Input
                        label="Notes"
                        value={form.notes}
                        onChange={(e) => onChange("notes", e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={onCancel}>
                        Cancel
                    </Button>
                    <Button color="secondary" onPress={onSave}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
