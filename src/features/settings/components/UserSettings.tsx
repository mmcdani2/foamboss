import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
} from "@heroui/react";
import { Key, SortDescriptor } from "@react-types/shared";
import { Eye, Edit3, Trash2 } from "lucide-react";


// ---------- Types ----------
interface UserType {
  id: number;
  name: string;
  role: string;
  team: string;
  status: string;
  age: string;
  avatar: string;
  email: string;
}

interface ColumnType {
  name: string;
  uid: keyof UserType | "actions";
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
  { name: "AGE", uid: "age", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "TEAM", uid: "team" },
  { name: "EMAIL", uid: "email" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions: StatusOption[] = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

export const users: UserType[] = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  // ... (trimmed for brevity — rest of users unchanged)
];

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
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<Key>>(
    new Set(["name", "role", "status", "actions"])
  );
  const [statusFilter, setStatusFilter] = useState<Set<Key>>(new Set(["all"]));
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);

  // ---------- CRUD State ----------
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // ---------- CRUD Handlers ----------
  const handleView = (user: UserType) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    // TODO: hook this up to your store once you integrate Supabase/Zustand
    console.log("Delete user ID:", id);
  };


  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns.has("all")) return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      !statusFilter.has("all") &&
      Array.from(statusFilter).some((s) => s !== "all")
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }
    return filteredUsers;
  }, [filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const items = filteredItems.slice(start, end);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof UserType];
      const second = b[sortDescriptor.column as keyof UserType];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((user: UserType, columnKey: Key) => {
    const key = columnKey as keyof UserType;
    const cellValue = user[key];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={user.name}
          />
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{user.role}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{user.team}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status.toLowerCase()]}
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
              variant="flat"
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
        return cellValue as string;
    }
  }, []);

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
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => setStatusFilter(keys as Set<Key>)}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
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
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => setVisibleColumns(keys as Set<Key>)}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button color="secondary" endContent={<PlusIcon />}>
              Add New
            </Button>
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
  }, [filterValue, statusFilter, visibleColumns, onRowsPerPageChange, onSearchChange]);

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

      {isAddModalOpen && <div className="hidden">Add User Modal Here</div>}
      {isEditModalOpen && selectedUser && <div className="hidden">Edit {selectedUser.name}</div>}
      {isViewModalOpen && selectedUser && <div className="hidden">View {selectedUser.name}</div>}
    </>
  );
}
