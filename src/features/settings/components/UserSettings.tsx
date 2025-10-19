import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User as UserAvatar,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import { Key, SortDescriptor } from "@react-types/shared";
import { Eye, Edit3, Trash2 } from "lucide-react";
import { useUserSettings } from "@/state/useUserSettings";
import type { User, Team } from "@/types/user";
import { TEAM_OPTIONS } from "@/types/user";
import AddUserModal from "./AddUserModal";

// ---------- Types ----------
type UserColumnKey = "id" | "name" | "role" | "team" | "email" | "status" | "actions";
type SortableUserColumnKey = Exclude<UserColumnKey, "actions">;

interface ColumnType {
  name: string;
  uid: UserColumnKey | "actions";
  sortable?: boolean;
}

interface StatusOption {
  name: string;
  uid: string;
}

interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

// ---------- Constants ----------
export const columns: ColumnType[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "TEAM", uid: "team", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions: StatusOption[] = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];


const teamOptions: StatusOption[] = TEAM_OPTIONS.map((team) => ({
  name: team,
  uid: team.toLowerCase(),
}));

const statusMenuItems: StatusOption[] = [
  { name: "All Statuses", uid: "all" },
  ...statusOptions,
];

const teamMenuItems: StatusOption[] = [
  { name: "All Teams", uid: "all" },
  ...teamOptions,
];

interface ColumnMenuItem {
  uid: ColumnType["uid"];
  label: string;
}

const columnMenuItems: ColumnMenuItem[] = columns.map((column) => ({
  uid: column.uid,
  label: column.name,
}));


interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (updates: Partial<User>) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, user, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        role: user.role,
        status: user.status,
        team: user.team,
        email: user.email,
        payType: user.payType,
        hourlyRate: user.hourlyRate,
        percentageRate: user.percentageRate,
        avatar: user.avatar,
      });
    }
  }, [user, isOpen]);

  if (!user) return null;

  const handleSave = () => {
    if (!form.name || !form.role || !form.email) {
      alert("Name, role, and email are required.");
      return;
    }

    onSave({
      name: form.name,
      role: form.role,
      status: form.status ?? user.status,
      team: (form.team as Team) ?? user.team ?? "Helpers",
      email: form.email ?? user.email ?? "",
      payType: form.payType ?? user.payType,
      hourlyRate: form.hourlyRate,
      percentageRate: form.percentageRate,
      avatar: form.avatar,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="md">
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <Input
            label="Name"
            value={form.name ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label="Role"
            value={form.role ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          />
          <Select
            label="Team"
            selectedKeys={[form.team ?? user.team ?? "Admin"]}
            onChange={(e) => setForm((prev) => ({ ...prev, team: e.target.value as Team }))}
          >
            {TEAM_OPTIONS.map((team) => (
              <SelectItem key={team}>{team}</SelectItem>
            ))}
          </Select>
          <Input
            label="Email"
            type="email"
            value={form.email ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <Select
            label="Status"
            selectedKeys={[form.status ?? user.status ?? "Active"]}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            {statusOptions.map((status) => (
              <SelectItem key={status.name}>{status.name}</SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="secondary" onPress={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// ---------- Utilities ----------
export const capitalize = (s: string): string =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

// ---------- Icons ----------
export const PlusIcon: React.FC<IconProps> = ({ size = 24, width, height, ...props }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height={size || height}
    width={size || width}
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
    viewBox="0 0 24 24"
  >
    <path d="M6 12h12M12 18V6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const VerticalDotsIcon: React.FC<IconProps> = ({ size = 24, width, height, ...props }) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    height={size || height}
    width={size || width}
    {...props}
    viewBox="0 0 24 24"
  >
    <path d="M12 10a2 2 0 100 4 2 2 0 000-4zm0-6a2 2 0 100 4 2 2 0 000-4zm0 12a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    width="1em"
    role="presentation"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      d="M11.5 21C16.7 21 21 16.7 21 11.5C21 6.25 16.7 2 11.5 2C6.25 2 2 6.25 2 11.5C2 16.7 6.25 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ strokeWidth = 1.5, ...props }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="1em"
    width="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={strokeWidth}
    />
  </svg>
);

// ---------- Data Maps ----------
const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

// ---------- Component ----------
export default function UserSettings() {
  const users = useUserSettings((state) => state.users);
  const removeUser = useUserSettings((state) => state.removeUser);
  const updateUser = useUserSettings((state) => state.updateUser);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<Key>>(
    new Set(["name", "role", "team", "email", "status", "actions"])
  );
  const [statusFilter, setStatusFilter] = useState<Set<Key>>(new Set(["all"]));
  const [teamFilter, setTeamFilter] = useState<Set<Key>>(new Set(["all"]));
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);
  const normalizedStatusFilter = useMemo(() => {
    const values = Array.from(statusFilter).map((status) =>
      String(status).toLowerCase()
    );
    return values.includes("all") ? [] : values;
  }, [statusFilter]);

  const normalizedTeamFilter = useMemo(() => {
    const values = Array.from(teamFilter).map((team) =>
      String(team).toLowerCase()
    );
    return values.includes("all") ? [] : values;
  }, [teamFilter]);

  // ---------- CRUD State ----------
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ---------- CRUD Handlers ----------
  const handleView = useCallback((user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  }, []);

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      removeUser(id);
    },
    [removeUser]
  );

  const handleUpdateUser = useCallback(
    (updates: Partial<User>) => {
      if (!selectedUser) return;
      updateUser(selectedUser.id, updates);
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
    [selectedUser, updateUser]
  );

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  }, []);


  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns.has("all")) return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];
    if (hasSearchFilter) {
      const query = filterValue.toLowerCase();
      filteredUsers = filteredUsers.filter((user) => {
        const haystack = [user.name, user.email, user.team, user.role];
        return haystack.some((value) =>
          (value ?? "").toString().toLowerCase().includes(query)
        );
      });
    }
    if (normalizedStatusFilter.length) {
      filteredUsers = filteredUsers.filter((user) =>
        normalizedStatusFilter.includes((user.status ?? "").toLowerCase())
      );
    }
    if (normalizedTeamFilter.length) {
      filteredUsers = filteredUsers.filter((user) =>
        normalizedTeamFilter.includes((user.team ?? "").toLowerCase())
      );
    }
    return filteredUsers;
  }, [filterValue, normalizedStatusFilter, normalizedTeamFilter, users]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const items = filteredItems.slice(start, end);

  const sortedItems = useMemo<User[]>(() => {
    if (!sortDescriptor.column || sortDescriptor.column === "actions") {
      return items;
    }
    const column = sortDescriptor.column as UserColumnKey;
    if (column === "actions") {
      return items;
    }

    const getComparableValue = (user: User): string | number => {
      const key = column as SortableUserColumnKey;
      switch (key) {
        case "id":
          return user.id ?? "";
        case "name":
          return user.name ?? "";
        case "role":
          return user.role ?? "";
        case "team":
          return user.team ?? "";
        case "email":
          return user.email ?? "";
        case "status":
          return user.status ?? "";
        default:
          return "";
      }
    };

    return [...items].sort((a, b) => {
      const first = getComparableValue(a);
      const second = getComparableValue(b);
      const normalize = (value: unknown) => {
        if (value == null) return "";
        if (typeof value === "number") return value;
        return String(value).toLowerCase();
      };
      const firstValue = normalize(first);
      const secondValue = normalize(second);
      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return sortDescriptor.direction === "descending"
          ? secondValue - firstValue
          : firstValue - secondValue;
      }
      const cmp = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback(
    (user: User, columnKey: Key) => {
      const key = columnKey as UserColumnKey;
      switch (key) {
        case "name":
        return (
          <UserAvatar
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={user.name}
          />
        );
        case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{user.role}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{capitalize(user.team)}</p>
          </div>
        );
        case "team":
          return capitalize(user.team);
        case "email":
          return user.email ? (
            <a className="text-secondary" href={`mailto:${user.email}`}>{user.email}</a>
          ) : (
            <span className="text-default-300">N/A</span>
          );
        case "id":
          return user.id.slice(0, 8).toUpperCase();
        case "status":
        const statusKey = (user.status ?? "active").toLowerCase() as keyof typeof statusColorMap;
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[statusKey] ?? "default"}
            size="sm"
            variant="flat"
          >
            {user.status}
          </Chip>
        );
        case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="primary"
              aria-label="View"
              className="min-w-[28px] h-[28px]"
              onPress={() => handleView(user)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="secondary"
              aria-label="Edit"
              className="min-w-[28px] h-[28px]"
              onPress={() => handleEdit(user)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              aria-label="Delete"
              className="min-w-[28px] h-[28px]"
              onPress={() => handleDelete(user.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

          </div>
        );

        default:
        return "";
    }
    },
    [handleDelete, handleEdit, handleView]
  );

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon className="text-foreground" />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
            classNames={{
              inputWrapper: [
                "bg-default/70 dark:bg-background/70 backdrop-blur-md",
                "shadow-[0_3px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.4)]",
                "hover:shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 rounded-lg",
              ].join(" "),
              label: "text-default-700 dark:text-default-700 font-normal",
              input: "text-foreground",
            }}
          />

          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                closeOnSelect={false}
                items={statusMenuItems}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => setStatusFilter(keys as Set<Key>)}
              >
                {(status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.uid === "all" ? "All Statuses" : capitalize(status.name)}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  Team
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Team Filter"
                closeOnSelect={false}
                items={teamMenuItems}
                selectedKeys={teamFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => setTeamFilter(keys as Set<Key>)}
              >
                {(team) => (
                  <DropdownItem key={team.uid} className="capitalize">
                    {team.uid === "all" ? "All Teams" : team.name}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                items={columnMenuItems}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => setVisibleColumns(keys as Set<Key>)}
              >
                {(column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>

            <Button color="primary" endContent={<PlusIcon />} onPress={() => setIsAddModalOpen(true)}>
              Add New
            </Button>
            <AddUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-default-800 text-small">Total {users.length} users</span>
          <label className="flex items-center text-default-800 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, teamFilter, visibleColumns, onRowsPerPageChange, onSearchChange, users, isAddModalOpen]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-800">
          {selectedKeys.has("all")
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>

        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={setPage}
        />

        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            color="default"
            variant="ghost"
            onPress={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            color="default"
            variant="ghost"
            onPress={() => setPage((p) => Math.min(p + 1, pages))}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, page, pages, filteredItems.length]);

  return (
    <>
      <Table
        isHeaderSticky
        aria-label="User settings table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<Key>)}
        onSortChange={setSortDescriptor}
        classNames={{
          wrapper: "max-h-[382px]",
          thead: "backdrop-blur-md",
          th: "bg-default/70 dark:bg-background/70 text-foreground font-semibold text-sm uppercase tracking-wide",
        }}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent="No users found" items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={handleCloseEditModal}
        onSave={handleUpdateUser}
      />
      {isViewModalOpen && selectedUser && <div className="hidden">View {selectedUser.name}</div>}
    </>
  );
}









