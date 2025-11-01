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

interface CategoryTypeModalProps {
    isOpen: boolean;
    categories: any[];
    newCategory: { name: string; description: string };
    newType: { name: string; category_id: string; unit: string };
    onCategoryChange: (key: string, value: string) => void;
    onTypeChange: (key: string, value: string) => void;
    onAddCategory: () => void;
    onAddType: () => void;
    onClearCategory: () => void;
    onClearType: () => void;
    onClose: () => void;
}

export const CategoryTypeModal: FC<CategoryTypeModalProps> = ({
    isOpen,
    categories,
    newCategory,
    newType,
    onCategoryChange,
    onTypeChange,
    onAddCategory,
    onAddType,
    onClearCategory,
    onClearType,
    onClose,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
            <ModalContent className="bg-content2 border border-default/20">
                <ModalHeader className="text-secondary font-semibold">
                    Add Category or Material Type
                </ModalHeader>
                <ModalBody className="space-y-6">
                    {/* Category Form */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            New Category
                        </h3>
                        <Input
                            label="Category Name"
                            value={newCategory.name}
                            onChange={(e) => onCategoryChange("name", e.target.value)}
                        />
                        <Input
                            label="Description (optional)"
                            value={newCategory.description}
                            onChange={(e) =>
                                onCategoryChange("description", e.target.value)
                            }
                            className="mt-2"
                        />
                        <div className="mt-2 flex gap-2">
                            <Button
                                size="sm"
                                color="secondary"
                                onPress={onAddCategory}
                                isDisabled={!newCategory.name}
                            >
                                Add Category
                            </Button>
                            <Button size="sm" variant="flat" onPress={onClearCategory}>
                                Clear
                            </Button>
                        </div>
                    </div>

                    {/* Type Form */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            New Material Type
                        </h3>
                        <Select
                            label="Assign to Category"
                            selectedKeys={newType.category_id ? [newType.category_id] : []}
                            onChange={(e) => onTypeChange("category_id", e.target.value)}
                        >
                            {categories.map((c) => (
                                <SelectItem key={c.id}>{c.category_name}</SelectItem>
                            ))}
                        </Select>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                                label="Type Name"
                                value={newType.name}
                                onChange={(e) => onTypeChange("name", e.target.value)}
                            />
                            <Input
                                label="Default Unit (optional)"
                                value={newType.unit}
                                onChange={(e) => onTypeChange("unit", e.target.value)}
                            />
                        </div>
                        <div className="mt-2 flex gap-2">
                            <Button
                                size="sm"
                                color="secondary"
                                onPress={onAddType}
                                isDisabled={!newType.name || !newType.category_id}
                            >
                                Add Type
                            </Button>
                            <Button size="sm" variant="flat" onPress={onClearType}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
