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

const getSelectionValue = (keys: any) => {
  const value = Array.from(keys)[0] as string | undefined;
  return value ?? "";
};

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent className="bg-content2 border border-default/20 max-w-full sm:max-w-2xl">
        <ModalHeader className="text-secondary font-semibold">
          Add Category or Material Type
        </ModalHeader>
        <ModalBody className="space-y-8 px-4 sm:px-6 pb-6">
          <section className="space-y-3">
            <header>
              <h3 className="text-lg font-semibold text-foreground">New Category</h3>
              <p className="text-xs text-default-500">
                Create categories to group related materials and types.
              </p>
            </header>
            <Input
              label="Category Name"
              value={newCategory.name}
              onChange={(e) => onCategoryChange("name", e.target.value)}
            />
            <Input
              label="Description (optional)"
              value={newCategory.description}
              onChange={(e) => onCategoryChange("description", e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                color="secondary"
                onPress={onAddCategory}
                isDisabled={!newCategory.name}
                className="min-h-10"
              >
                Add Category
              </Button>
              <Button size="sm" variant="flat" onPress={onClearCategory} className="min-h-10">
                Clear
              </Button>
            </div>
          </section>

          <section className="space-y-3">
            <header>
              <h3 className="text-lg font-semibold text-foreground">New Material Type</h3>
              <p className="text-xs text-default-500">
                Assign the material type to a category for accurate filtering.
              </p>
            </header>
            <Select
              label="Assign to Category"
              selectedKeys={newType.category_id ? [newType.category_id] : []}
              onSelectionChange={(keys) => onTypeChange("category_id", getSelectionValue(keys))}
            >
              {categories.map((c) => (
                <SelectItem key={c.id}>{c.category_name}</SelectItem>
              ))}
            </Select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                color="secondary"
                onPress={onAddType}
                isDisabled={!newType.name || !newType.category_id}
                className="min-h-10"
              >
                Add Type
              </Button>
              <Button size="sm" variant="flat" onPress={onClearType} className="min-h-10">
                Clear
              </Button>
            </div>
          </section>
        </ModalBody>
        <ModalFooter className="px-4 sm:px-6 pb-6">
          <Button variant="flat" className="min-h-10 w-full" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
