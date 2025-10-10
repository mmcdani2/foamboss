import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import AddUserModal from "./AddUserModal";

export default function UserSettings() {
  const { settings, removeUser } = useSettingsStore();
  const users = settings.users;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Add User Button */}
      <div className="flex justify-end mb-3">
        <Button
          color="secondary"
          startContent={<PlusCircle className="w-4 h-4" />}
          onPress={() => setIsModalOpen(true)}
        >
          Add User
        </Button>
      </div>

      {/* User Table */}
      <Table
        aria-label="User Settings"
        shadow="none"
        classNames={{
          th: "bg-content3 text-default-600 font-semibold",
          td: "text-sm",
        }}
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Pay Type</TableColumn>
          <TableColumn>Rate</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-default-500">
                No users yet
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Chip
                    color={u.status === "Active" ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                  >
                    {u.status}
                  </Chip>
                </TableCell>
                <TableCell>{u.payType}</TableCell>
                <TableCell>
                  {u.payType === "Hourly"
                    ? `$${u.hourlyRate?.toFixed(2)}`
                    : u.payType === "Percentage"
                    ? `${u.percentageRate}%`
                    : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => removeUser(u.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Add User Modal */}
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
