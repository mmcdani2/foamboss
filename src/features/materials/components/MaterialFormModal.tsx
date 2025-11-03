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
import { FC, useMemo } from "react";

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
  const filteredTypes = useMemo(
    () => types.filter((t) => t.category_id === form.category_id),
    [types, form.category_id]
  );

  const handleSelectionChange = (key: string) => (keys: any) => {
    const value = Array.from(keys)[0] as string | undefined;
    onChange(key, value ?? "");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      placement="center"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent className="bg-content2 border border-default/20 max-w-full sm:max-w-2xl">
        <ModalHeader className="text-secondary font-semibold">
          {isEdit ? "Edit Material" : "Add Material"}
        </ModalHeader>
        <ModalBody className="space-y-6 px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Material Name"
              value={form.material_name}
              onChange={(e) => onChange("material_name", e.target.value)}
              className="sm:col-span-2"
            />
            <Select
              label="Category"
              selectedKeys={form.category_id ? [form.category_id] : []}
              onSelectionChange={handleSelectionChange("category_id")}
              className="sm:col-span-1"
            >
              {categories.map((c) => (
                <SelectItem key={c.id}>{c.category_name}</SelectItem>
              ))}
            </Select>
                      <Select
              label="Material Type"
              selectedKeys={form.material_type_id ? [form.material_type_id] : []}
              onSelectionChange={handleSelectionChange("material_type_id")}
              className="sm:col-span-1"
          >
              {filteredTypes.length > 0 ? (
                filteredTypes.map((t) => (
                  <SelectItem key={t.id}>{t.type_name}</SelectItem>
                ))
              ) : (
                <SelectItem key="no-types" isDisabled className="text-default-400">
                  {form.category_id
                    ? "No material types for this category"
                    : "Select a category first"}
                </SelectItem>
              )}
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
              className="sm:col-span-2"
            />
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-4 sm:px-6 pb-6">
          <Button
            variant="flat"
            className="min-h-10 w-full sm:w-auto"
            onPress={onCancel}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            className="min-h-10 w-full sm:w-auto"
            onPress={onSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

