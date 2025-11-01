"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Chip,
  Progress,
  Spinner,
} from "@heroui/react";
import {
  fetchMaterials,
  insertMaterial,
  updateMaterial,
  deleteMaterial,
  fetchCategories,
  fetchTypes,
  insertCategory,
  insertType,
} from "@/features/materials/lib/materials.api";
import { useState, useEffect } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { useSupabase } from "@/core/providers/SupabaseProvider";
import { useMaterialsData } from "@/features/materials/hooks/useMaterialsData";


export default function MaterialSettings() {
  const { supabase } = useSupabase();

  // --- data state ---
  const {
    categories,
    types,
    materials,
    loading,
    addMaterial,
    editMaterial,
    removeMaterial,
    addCategory,
    addType,
  } = useMaterialsData(supabase);

  // --- modal states ---
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);

  const [editing, setEditing] = useState<any | null>(null);

  const [form, setForm] = useState({
    material_name: "",
    category_id: "",
    material_type_id: "",
    unit_price: "",
    yield_per_unit: "",
    unit_type: "",
    quantity_on_hand: "",
    notes: "",
  });

  const resetForm = () =>
    setForm({
      material_name: "",
      category_id: "",
      material_type_id: "",
      unit_price: "",
      yield_per_unit: "",
      unit_type: "",
      quantity_on_hand: "",
      notes: "",
    });

  // --- add new material ---
  const handleAdd = async () => {
    const { material_name, material_type_id, unit_price, yield_per_unit, unit_type, quantity_on_hand, notes } = form;
    if (!material_name || !material_type_id || !unit_price || !yield_per_unit || !unit_type) {
      toast.error("Please complete all required fields.");
      return;
    }

    await addMaterial({
      material_name,
      material_type_id,
      unit_price: Number(unit_price),
      yield_per_unit: Number(yield_per_unit),
      unit_type,
      quantity_on_hand: Number(quantity_on_hand) || 0,
      notes,
    });

    resetForm();
    setIsAddOpen(false);
  };



  // --- edit material ---
  const handleEdit = async () => {
    if (!editing) return;

    await editMaterial(editing.id, {
      material_name: form.material_name,
      material_type_id: form.material_type_id,
      unit_price: Number(form.unit_price),
      yield_per_unit: Number(form.yield_per_unit),
      unit_type: form.unit_type,
      quantity_on_hand: Number(form.quantity_on_hand) || 0,
      notes: form.notes,
      updated_at: new Date().toISOString(),
    });

    resetForm();
    setIsEditOpen(false);
  };



  // --- delete material ---
  const handleDelete = async (id: string) => {
    await removeMaterial(id);
  };



  // --- add new category ---
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const handleAddCategory = async () => {
    if (!newCategory.name) return toast.error("Category name required");
    await addCategory({
      category_name: newCategory.name,
      description: newCategory.description,
    });
    setIsAddCategoryOpen(false);
    setNewCategory({ name: "", description: "" });
  };


  // --- add new type ---
  const [newType, setNewType] = useState({ name: "", category_id: "", unit: "" });
  const handleAddType = async () => {
    if (!newType.name || !newType.category_id) return toast.error("Type name and category required");
    await addType({
      type_name: newType.name,
      category_id: newType.category_id,
      default_unit: newType.unit,
    });
    setIsAddTypeOpen(false);
    setNewType({ name: "", category_id: "", unit: "" });
  };



  const totalInventoryValue = materials.reduce(
    (sum, m) => sum + (Number(m.unit_price || 0) * Number(m.quantity_on_hand || 0)),
    0
  );
  const topYield =
    materials.length > 0
      ? materials.reduce((a, b) =>
        (a.yield_per_unit ?? 0) > (b.yield_per_unit ?? 0) ? a : b
      )
      : null;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner color="secondary" label="Loading materials..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-secondary">Material Pricing & Inventory</h1>
        <div className="flex gap-2">
          <Button
            color="secondary"
            startContent={<FolderPlus className="w-5 h-5" />}
            variant="flat"
            onPress={() => setIsAddCategoryOpen(true)}
          >
            Add Category / Type
          </Button>
          <Button
            color="secondary"
            startContent={<Plus className="w-5 h-5" />}
            onPress={() => {
              resetForm();
              setIsAddOpen(true);
            }}
          >
            Add Material
          </Button>
        </div>
      </div>

      {/* --- MATERIAL TABLE --- */}
      <Card shadow="md" className="bg-content2 border border-default/20 mb-6">
        <CardHeader>
          <h2 className="font-semibold text-lg text-foreground">Materials</h2>
        </CardHeader>
        <CardBody className="overflow-x-auto">
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
                    {categories.find((c) => c.id === m.material_types?.category_id)?.category_name ?? "—"}
                  </TableCell>
                  <TableCell>{m.material_types?.type_name ?? "—"}</TableCell>
                  <TableCell>{m.unit_type}</TableCell>
                  <TableCell>${Number(m.unit_price).toFixed(2)}</TableCell>
                  <TableCell>{m.yield_per_unit}</TableCell>
                  <TableCell>{m.quantity_on_hand}</TableCell>

                  {/* Status Chip */}
                  <TableCell>
                    {Number(m.quantity_on_hand) === 0 ? (
                      <Chip
                        color="danger"
                        variant="flat"
                        className="bg-red-500/10 text-red-400 border border-red-500/20 font-medium"
                        startContent={<span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1" />}
                      >
                        Out of Stock
                      </Chip>
                    ) : Number(m.quantity_on_hand) < 5 ? (
                      <Chip
                        color="warning"
                        variant="flat"
                        className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-medium"
                        startContent={<span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1" />}
                      >
                        Reorder Soon
                      </Chip>
                    ) : (
                      <Chip
                        color="success"
                        variant="flat"
                        className="bg-green-500/10 text-green-400 border border-green-500/20 font-medium"
                        startContent={<span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />}
                      >
                        In Stock
                      </Chip>
                    )}
                  </TableCell>

                  <TableCell>${Number(m.cost_per_bdft ?? 0).toFixed(2)}</TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="secondary"
                        variant="flat"
                        onPress={() => {
                          setEditing(m);
                          setForm({
                            material_name: m.material_name,
                            category_id: m.material_types?.category_id ?? "",
                            material_type_id: m.material_type_id,
                            unit_price: m.unit_price,
                            yield_per_unit: m.yield_per_unit,
                            unit_type: m.unit_type,
                            quantity_on_hand: m.quantity_on_hand,
                            notes: m.notes ?? "",
                          });
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDelete(m.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </CardBody>
      </Card>

      {/* --- ANALYTICS SUMMARY --- */}
      {materials.length > 0 && (
        <Card shadow="md" className="bg-content2 border border-default/20">
          <CardHeader>
            <h2 className="font-semibold text-lg text-foreground">Summary</h2>
          </CardHeader>
          <CardBody className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-default-500 text-sm">Total Inventory Value</p>
              <p className="text-2xl font-semibold text-success">
                ${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <Progress value={(totalInventoryValue / 100000) * 100} color="success" className="mt-2" />
            </div>
            <div>
              <p className="text-default-500 text-sm">Top Yield Material</p>
              <p className="text-2xl font-semibold text-secondary">
                {topYield?.material_name ?? "N/A"}
              </p>
              <p className="text-sm text-default-500">
                {topYield?.material_types?.type_name}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ADD / EDIT MATERIAL MODAL */}
      <Modal isOpen={isAddOpen || isEditOpen} onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }} placement="center" backdrop="blur">
        <ModalContent className="bg-content2 border border-default/20">
          <ModalHeader className="text-secondary font-semibold">
            {isEditOpen ? "Edit Material" : "Add Material"}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input label="Material Name" value={form.material_name} onChange={(e) => setForm({ ...form, material_name: e.target.value })} />
            <Select label="Category" selectedKeys={form.category_id ? [form.category_id] : []} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              {categories.map((c) => <SelectItem key={c.id}>{c.category_name}</SelectItem>)}
            </Select>
            <Select label="Material Type" selectedKeys={form.material_type_id ? [form.material_type_id] : []} onChange={(e) => setForm({ ...form, material_type_id: e.target.value })}>
              {types.filter((t) => t.category_id === form.category_id).map((t) => <SelectItem key={t.id}>{t.type_name}</SelectItem>)}
            </Select>
            <Input label="Unit Type (e.g. set, 5gal, roll)" value={form.unit_type} onChange={(e) => setForm({ ...form, unit_type: e.target.value })} />
            <Input type="number" label="Unit Price ($)" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} />
            <Input type="number" label="Yield per Unit" value={form.yield_per_unit} onChange={(e) => setForm({ ...form, yield_per_unit: e.target.value })} />
            <Input type="number" label="On-Hand Quantity" value={form.quantity_on_hand} onChange={(e) => setForm({ ...form, quantity_on_hand: e.target.value })} />
            <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => { setIsAddOpen(false); setIsEditOpen(false); }}>Cancel</Button>
            <Button color="secondary" onPress={isEditOpen ? handleEdit : handleAdd}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADD CATEGORY / TYPE MODAL */}
      <Modal isOpen={isAddCategoryOpen || isAddTypeOpen} onClose={() => { setIsAddCategoryOpen(false); setIsAddTypeOpen(false); }} placement="center" backdrop="blur">
        <ModalContent className="bg-content2 border border-default/20">
          <ModalHeader className="text-secondary font-semibold">
            Add Category or Material Type
          </ModalHeader>
          <ModalBody className="space-y-6">
            {/* New Category */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                New Category
              </h3>
              <Input
                label="Category Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
              <Input
                label="Description (optional)"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="mt-2"
              />
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  color="secondary"
                  onPress={handleAddCategory}
                  isDisabled={!newCategory.name}
                >
                  Add Category
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => setNewCategory({ name: "", description: "" })}
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* New Material Type */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                New Material Type
              </h3>
              <Select
                label="Assign to Category"
                selectedKeys={newType.category_id ? [newType.category_id] : []}
                onChange={(e) =>
                  setNewType({ ...newType, category_id: e.target.value })
                }
              >
                {categories.map((c) => (
                  <SelectItem key={c.id}>{c.category_name}</SelectItem>
                ))}
              </Select>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  label="Type Name"
                  value={newType.name}
                  onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                />
                <Input
                  label="Default Unit (optional)"
                  value={newType.unit}
                  onChange={(e) => setNewType({ ...newType, unit: e.target.value })}
                />
              </div>

              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  color="secondary"
                  onPress={handleAddType}
                  isDisabled={!newType.name || !newType.category_id}
                >
                  Add Type
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() =>
                    setNewType({ name: "", category_id: "", unit: "" })
                  }
                >
                  Clear
                </Button>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => {
                setIsAddCategoryOpen(false);
                setIsAddTypeOpen(false);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
