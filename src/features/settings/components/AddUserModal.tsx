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
import {
  useSettingsStore,
  PayType,
  UserSetting,
} from "@/features/settings/store/settingsStore";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const { addUser } = useSettingsStore();

  const [form, setForm] = useState<Partial<UserSetting>>({
    name: "",
    role: "",
    status: "Active",
    payType: "None",
  });

  const handleSave = () => {
    if (!form.name || !form.role) {
      alert("Name and role are required.");
      return;
    }

    addUser({
      id: crypto.randomUUID(),
      name: form.name,
      role: form.role,
      status: form.status || "Active",
      payType: form.payType || "None",
      hourlyRate: form.hourlyRate,
      percentageRate: form.percentageRate,
    } as UserSetting);

    onClose();
    setForm({ name: "", role: "", status: "Active", payType: "None" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="md">
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <Input
            label="Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Role"
            value={form.role || ""}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />

          <Select
            label="Pay Type"
            selectedKeys={[form.payType || "None"]}
            onChange={(e) =>
              setForm({ ...form, payType: e.target.value as PayType })
            }
          >
            {["None", "Hourly", "Percentage"].map((p) => (
              <SelectItem key={p}>{p}</SelectItem>
            ))}
          </Select>

          {form.payType === "Hourly" && (
            <Input
              label="Hourly Rate ($)"
              type="number"
              value={form.hourlyRate?.toString() || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  hourlyRate: parseFloat(e.target.value),
                })
              }
            />
          )}

          {form.payType === "Percentage" && (
            <Input
              label="Profit Share (%)"
              type="number"
              value={form.percentageRate?.toString() || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  percentageRate: parseFloat(e.target.value),
                })
              }
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="secondary" onPress={handleSave}>
            Save User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
