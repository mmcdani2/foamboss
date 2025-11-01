import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
} from "@heroui/react";
import { FC } from "react";

interface MaterialTableProps {
    materials: any[];
    categories: any[];
    onEdit: (material: any) => void;
    onDelete: (id: string) => void;
}

export const MaterialTable: FC<MaterialTableProps> = ({
    materials,
    categories,
    onEdit,
    onDelete,
}) => {
    return (
        <Table aria-label="Material Table" isStriped>
            <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Category</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Unit</TableColumn>
                <TableColumn>Price ($)</TableColumn>
                <TableColumn>Yield</TableColumn>
                <TableColumn>On Hand</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Cost / BdFt ($)</TableColumn>
                <TableColumn>Actions</TableColumn>
            </TableHeader>

            <TableBody emptyContent="No materials found.">
                {materials.map((m) => (
                    <TableRow
                        key={m.id}
                        className={
                            Number(m.quantity_on_hand) === 0
                                ? "bg-red-500/5"
                                : Number(m.quantity_on_hand) < 5
                                    ? "bg-yellow-500/5"
                                    : ""
                        }
                    >
                        <TableCell>{m.material_name}</TableCell>
                        <TableCell>
                            {categories.find(
                                (c) => c.id === m.material_types?.category_id
                            )?.category_name ?? "—"}
                        </TableCell>
                        <TableCell>{m.material_types?.type_name ?? "—"}</TableCell>
                        <TableCell>{m.unit_type}</TableCell>
                        <TableCell>${Number(m.unit_price).toFixed(2)}</TableCell>
                        <TableCell>{m.yield_per_unit}</TableCell>
                        <TableCell>{m.quantity_on_hand}</TableCell>
                        <TableCell>
                            {Number(m.quantity_on_hand) === 0 ? (
                                <Chip color="danger" variant="flat">
                                    Out of Stock
                                </Chip>
                            ) : Number(m.quantity_on_hand) < 5 ? (
                                <Chip color="warning" variant="flat">
                                    Reorder Soon
                                </Chip>
                            ) : (
                                <Chip color="success" variant="flat">
                                    In Stock
                                </Chip>
                            )}
                        </TableCell>
                        <TableCell>${Number(m.cost_per_bdft ?? 0).toFixed(2)}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    color="secondary"
                                    variant="flat"
                                    onPress={() => onEdit(m)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    onPress={() => onDelete(m.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
