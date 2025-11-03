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
import { FC, useMemo } from "react";

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
  const categoryLookup = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => {
      if (c?.id) map.set(c.id, c.category_name ?? "");
    });
    return map;
  }, [categories]);

  return (
    <Table
      aria-label="Material inventory table"
      isStriped
      isCompact
      removeWrapper
      className="min-w-full"
    >
      <TableHeader>
        <TableColumn scope="col">Name</TableColumn>
        <TableColumn scope="col">Category</TableColumn>
        <TableColumn scope="col">Type</TableColumn>
        <TableColumn scope="col" className="hidden lg:table-cell">
          Unit
        </TableColumn>
        <TableColumn scope="col">Price ($)</TableColumn>
        <TableColumn scope="col" className="hidden xl:table-cell">
          Yield
        </TableColumn>
        <TableColumn scope="col">On Hand</TableColumn>
        <TableColumn scope="col" className="hidden xl:table-cell">
          Status
        </TableColumn>
        <TableColumn scope="col" className="hidden xl:table-cell">
          Cost / BdFt ($)
        </TableColumn>
        <TableColumn scope="col" className="w-[140px] text-right">
          Actions
        </TableColumn>
      </TableHeader>

      <TableBody emptyContent="No materials found.">
        {materials.map((material) => {
          const categoryName = categoryLookup.get(material.material_types?.category_id) ?? "—";
          const quantity = Number(material.quantity_on_hand ?? 0);

          let statusColor: "danger" | "warning" | "success" = "success";
          let statusLabel = "In Stock";
          if (quantity === 0) {
            statusColor = "danger";
            statusLabel = "Out of Stock";
          } else if (quantity < 5) {
            statusColor = "warning";
            statusLabel = "Reorder Soon";
          }

          return (
            <TableRow key={material.id}>
              <TableCell className="whitespace-nowrap font-medium">
                {material.material_name}
              </TableCell>
              <TableCell className="whitespace-nowrap text-default-500">
                {categoryName || "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap text-default-500">
                {material.material_types?.type_name ?? "—"}
              </TableCell>
              <TableCell className="hidden lg:table-cell whitespace-nowrap text-default-500">
                {material.unit_type ?? "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                ${Number(material.unit_price ?? 0).toFixed(2)}
              </TableCell>
              <TableCell className="hidden xl:table-cell whitespace-nowrap">
                {material.yield_per_unit ?? "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {material.quantity_on_hand ?? "—"}
              </TableCell>
              <TableCell className="hidden xl:table-cell whitespace-nowrap">
                <Chip color={statusColor} variant="flat" size="sm">
                  {statusLabel}
                </Chip>
              </TableCell>
              <TableCell className="hidden xl:table-cell whitespace-nowrap">
                ${Number(material.cost_per_bdft ?? 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    color="secondary"
                    variant="flat"
                    className="min-h-8"
                    onPress={() => onEdit(material)}
                    aria-label={`Edit ${material.material_name}`}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    className="min-h-8"
                    onPress={() => onDelete(material.id)}
                    aria-label={`Delete ${material.material_name}`}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
