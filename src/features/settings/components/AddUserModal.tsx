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
import { useUserSettings } from "@/state/useUserSettings";
import type { PayType, Team, User } from "@/types/user";
import { TEAM_OPTIONS } from "@/types/user";

const PAY_TYPES: PayType[] = ["None", "Hourly", "Percentage", "Salary"];
const DEFAULT_STATUS = "Active";
const DEFAULT_TEAM = TEAM_OPTIONS[0];

const DEFAULT_FORM: Partial<User> = {
  name: "",
  role: "",
  status: DEFAULT_STATUS,
  payType: "None",
  team: DEFAULT_TEAM,
  email: "",
};

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const addUser = useUserSettings((state) => state.addUser);

  const [form, setForm] = useState<Partial<User>>({ ...DEFAULT_FORM });

  const resetForm = () => setForm({ ...DEFAULT_FORM });

  const handleSave = () => {
    const name = form.name?.trim() ?? "";
    const role = form.role?.trim() ?? "";
    const email = form.email?.trim() ?? "";

    if (!name || !role || !email) {
      alert("Name, role, and email are required.");
      return;
    }

    const payType = PAY_TYPES.includes(form.payType as PayType)
      ? (form.payType as PayType)
      : "None";

    const team = TEAM_OPTIONS.includes(form.team as Team)
      ? (form.team as Team)
      : DEFAULT_TEAM;

    const status = form.status?.trim() || DEFAULT_STATUS;
    const hourlyRate =
      typeof form.hourlyRate === "number" && Number.isFinite(form.hourlyRate)
        ? form.hourlyRate
        : undefined;
    const percentageRate =
      typeof form.percentageRate === "number" && Number.isFinite(form.percentageRate)
        ? form.percentageRate
        : undefined;
    const avatar = form.avatar?.trim() || undefined;

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      role,
      status,
      payType,
      hourlyRate,
      percentageRate,
      email,
      team,
      avatar,
    };

    addUser(newUser);

    onClose();
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} placement="center" size="md">
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <Input
            label="Name"
            value={form.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Role"
            value={form.role ?? ""}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />

          <Input
            label="Email"
            type="email"
            value={form.email ?? ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Select
            label="Team"
            selectedKeys={[form.team ?? DEFAULT_TEAM]}
            onChange={(e) =>
              setForm({ ...form, team: e.target.value as Team })
            }
          >
            {TEAM_OPTIONS.map((team) => (
              <SelectItem key={team}>{team}</SelectItem>
            ))}
          </Select>

          <Select
            label="Pay Type"
            selectedKeys={[form.payType ?? "None"]}
            onChange={(e) =>
              setForm({ ...form, payType: e.target.value as PayType })
            }
          >
            {PAY_TYPES.map((p) => (
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
                  hourlyRate: e.target.value ? parseFloat(e.target.value) : undefined,
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
                  percentageRate: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={handleClose}>
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
