import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
} from "@heroui/react";
import { UserPlus } from "lucide-react";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

export default function UserSettings() {
  const { settings, addUser, updateUser, removeUser } = useSettingsStore();
  const users = settings.users;

  const handleAddUser = () => {
    const name = prompt("Enter user name:");
    const role = prompt("Enter role:");
    if (!name || !role) return;
    addUser({
      id: crypto.randomUUID(),
      name,
      role,
      status: "Active",
      hourlyRate: 0,
    });
  };

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button color="secondary" startContent={<UserPlus className="w-4 h-4" />} onPress={handleAddUser}>
          Add User
        </Button>
      </div>

      <Table
        aria-label="Users Table"
        shadow="none"
        classNames={{
          th: "bg-content3 text-default-600 font-semibold",
          td: "text-foreground text-sm",
        }}
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Hourly Rate ($)</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                <Chip
                  color={u.status === "Active" ? "success" : "warning"}
                  variant="flat"
                  size="sm"
                >
                  {u.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  size="sm"
                  value={u.hourlyRate?.toString() ?? ""}
                  onChange={(e) =>
                    updateUser(u.id, { hourlyRate: parseFloat(e.target.value) })
                  }
                  className="w-28"
                />
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => removeUser(u.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
