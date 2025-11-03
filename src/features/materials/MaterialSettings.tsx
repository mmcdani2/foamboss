"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Skeleton,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import { FolderPlus, Plus } from "lucide-react";
import { toast } from "sonner";

import { MaterialTable } from "@/features/materials/components/MaterialTable";
import { MaterialSummary } from "@/features/materials/components/MaterialSummary";
import { MaterialFormModal } from "@/features/materials/components/MaterialFormModal";
import { CategoryTypeModal } from "@/features/materials/components/CategoryTypeModal";
import { useMaterialsData } from "@/features/materials/hooks/useMaterialsData";
import type {
  Material,
  MaterialCategory,
  MaterialType,
} from "@/features/materials/lib/Materials.types";

interface MaterialFormState {
  material_name: string;
  category_id: string;
  material_type_id: string;
  unit_price: string;
  yield_per_unit: string;
  unit_type: string;
  quantity_on_hand: string;
  notes: string;
}

interface CategoryFormState {
  name: string;
  description: string;
}

interface TypeFormState {
  name: string;
  category_id: string;
  unit: string;
}

const INITIAL_FORM: MaterialFormState = {
  material_name: "",
  category_id: "",
  material_type_id: "",
  unit_price: "",
  yield_per_unit: "",
  unit_type: "",
  quantity_on_hand: "",
  notes: "",
};

const INITIAL_CATEGORY: CategoryFormState = {
  name: "",
  description: "",
};

const INITIAL_TYPE: TypeFormState = {
  name: "",
  category_id: "",
  unit: "",
};

const DESKTOP_QUERY = "(min-width: 640px)";

export default function MaterialSettings() {
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
  } = useMaterialsData();

  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCategoryTypeModalOpen, setIsCategoryTypeModalOpen] = useState(false);

  const [editing, setEditing] = useState<Material | null>(null);
  const [form, setForm] = useState<MaterialFormState>(INITIAL_FORM);
  const [newCategory, setNewCategory] = useState<CategoryFormState>(INITIAL_CATEGORY);
  const [newType, setNewType] = useState<TypeFormState>(INITIAL_TYPE);

  const updateForm = (key: keyof MaterialFormState, value: string) => {
    setForm((prev) => {
      if (key === "category_id") {
        return {
          ...prev,
          category_id: value,
          material_type_id: "",
        };
      }
      return { ...prev, [key]: value };
    });
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditing(null);
  };

  const handleAddMaterial = async () => {
    const {
      material_name,
      material_type_id,
      unit_price,
      yield_per_unit,
      unit_type,
      quantity_on_hand,
      notes,
    } = form;

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
      notes: notes || undefined,
    });

    resetForm();
    setIsAddOpen(false);
  };

  const handleEditMaterial = async () => {
    if (!editing) return;

    await editMaterial(editing.id, {
      material_name: form.material_name,
      material_type_id: form.material_type_id,
      unit_price: Number(form.unit_price),
      yield_per_unit: Number(form.yield_per_unit),
      unit_type: form.unit_type,
      quantity_on_hand: Number(form.quantity_on_hand) || 0,
      notes: form.notes || undefined,
      updated_at: new Date().toISOString(),
    });

    resetForm();
    setIsEditOpen(false);
  };

  const handleDeleteMaterial = async (id: string) => {
    await removeMaterial(id);
  };

  const handleAddCategory = async () => {
    const trimmedName = newCategory.name.trim();
    if (!trimmedName) {
      toast.error("Category name required");
      return;
    }

    await addCategory({
      category_name: trimmedName,
      description: newCategory.description.trim() || undefined,
    });

    setNewCategory(INITIAL_CATEGORY);
    setIsCategoryTypeModalOpen(false);
  };

  const handleAddType = async () => {
    const trimmedName = newType.name.trim();
    if (!trimmedName || !newType.category_id) {
      toast.error("Type name and category required");
      return;
    }

    const categoryExists = categories.some((c) => c.id === newType.category_id);
    if (!categoryExists) {
      toast.error("Selected category is not available");
      return;
    }

    await addType({
      type_name: trimmedName,
      category_id: newType.category_id,
      default_unit: newType.unit.trim() || undefined,
    });

    setNewType(INITIAL_TYPE);
    setIsCategoryTypeModalOpen(false);
  };

  const totalInventoryValue = useMemo(() =>
    materials.reduce((sum, item) => {
      const unitPrice = Number(item.unit_price ?? 0);
      const quantity = Number(item.quantity_on_hand ?? 0);
      return sum + unitPrice * quantity;
    }, 0),
  [materials]);

  const topYield = useMemo(() => {
    if (materials.length === 0) return null;
    return materials.reduce<Material | null>((currentTop, candidate) => {
      if (!currentTop) return candidate;
      return (candidate.yield_per_unit ?? 0) > (currentTop.yield_per_unit ?? 0)
        ? candidate
        : currentTop;
    }, null);
  }, [materials]);

  const handleCloseModal = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    resetForm();
  };

  const renderMaterialEditor = (material: Material) => {
    setEditing(material);
    setForm({
      material_name: material.material_name,
      category_id: material.material_types?.category_id ?? "",
      material_type_id: material.material_type_id,
      unit_price: material.unit_price != null ? String(material.unit_price) : "",
      yield_per_unit: material.yield_per_unit != null ? String(material.yield_per_unit) : "",
      unit_type: material.unit_type ?? "",
      quantity_on_hand:
        material.quantity_on_hand != null ? String(material.quantity_on_hand) : "",
      notes: material.notes ?? "",
    });
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-default-500">Materials</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Material Pricing &amp; Inventory</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              color="secondary"
              variant="flat"
              startContent={<FolderPlus className="w-5 h-5" />}
              className="min-h-10 px-4"
              onPress={() => setIsCategoryTypeModalOpen(true)}
            >
              Add Category / Type
            </Button>
            <Button
              color="secondary"
              startContent={<Plus className="w-5 h-5" />}
              className="min-h-10 px-4"
              onPress={() => {
                resetForm();
                setIsAddOpen(true);
              }}
            >
              Add Material
            </Button>
          </div>
        </div>

        <Card shadow="md" className="bg-content2 border border-default/20">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="font-semibold text-lg text-foreground">Inventory</h2>
            {!loading && (
              <p className="text-default-500 text-sm">
                {materials.length} material{materials.length === 1 ? "" : "s"}
              </p>
            )}
          </CardHeader>
          <CardBody className="p-0">
            {loading ? (
              <div className="flex flex-col gap-4 p-6">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : isDesktop ? (
              <div className="overflow-x-auto">
                <MaterialTable
                  materials={materials}
                  categories={categories}
                  onEdit={renderMaterialEditor}
                  onDelete={handleDeleteMaterial}
                />
              </div>
            ) : (
              <MaterialMobileList
                materials={materials}
                categories={categories}
                onEdit={renderMaterialEditor}
                onDelete={handleDeleteMaterial}
              />
            )}
          </CardBody>
        </Card>

        {!loading && materials.length > 0 && (
          <MaterialSummary totalInventoryValue={totalInventoryValue} topYield={topYield} />
        )}

        <MaterialFormModal
          isOpen={isAddOpen || isEditOpen}
          isEdit={isEditOpen}
          form={form}
          categories={categories as MaterialCategory[]}
          types={types as MaterialType[]}
          onChange={(key, value) => updateForm(key as keyof MaterialFormState, value)}
          onSave={isEditOpen ? handleEditMaterial : handleAddMaterial}
          onCancel={handleCloseModal}
        />

        <CategoryTypeModal
          isOpen={isCategoryTypeModalOpen}
          categories={categories as MaterialCategory[]}
          newCategory={newCategory}
          newType={newType}
          onCategoryChange={(key, value) => setNewCategory((prev) => ({ ...prev, [key]: value }))}
          onTypeChange={(key, value) => setNewType((prev) => ({ ...prev, [key]: value }))}
          onAddCategory={handleAddCategory}
          onAddType={handleAddType}
          onClearCategory={() => setNewCategory(INITIAL_CATEGORY)}
          onClearType={() => setNewType(INITIAL_TYPE)}
          onClose={() => setIsCategoryTypeModalOpen(false)}
        />
      </div>
    </div>
  );
}

interface MobileListProps {
  materials: Material[];
  categories: MaterialCategory[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const MaterialMobileList = ({ materials, categories, onEdit, onDelete }: MobileListProps) => {
  if (materials.length === 0) {
    return <p className="p-6 text-center text-default-500">No materials found.</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {materials.map((material) => {
        const categoryName =
          categories.find((c) => c.id === material.material_types?.category_id)?.category_name ??
          "Uncategorized";
        const quantity = Number(material.quantity_on_hand ?? 0);

        return (
          <article
            key={material.id}
            className="rounded-2xl bg-content1 border border-default/20 p-4 space-y-3 shadow-sm"
          >
            <header className="flex justify-between items-start gap-3">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {material.material_name}
                </p>
                <p className="text-xs text-default-500">{categoryName}</p>
              </div>
              <div className="flex gap-2">
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
            </header>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-default-500">Material Type</dt>
                <dd className="font-medium text-foreground">
                  {material.material_types?.type_name ?? "—"}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-default-500">Unit Price</dt>
                <dd className="font-medium text-foreground">
                  ${Number(material.unit_price ?? 0).toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-default-500">Yield</dt>
                <dd className="font-medium text-foreground">
                  {material.yield_per_unit ?? "—"}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-default-500">On-hand</dt>
                <dd className="font-medium text-foreground">
                  {material.quantity_on_hand ?? "—"}
                </dd>
              </div>
            </dl>

            <footer className="flex justify-between text-xs text-default-500">
              <span>
                {quantity === 0
                  ? "Out of stock"
                  : quantity < 5
                  ? "Reorder soon"
                  : "In stock"}
              </span>
              <span>Cost/bdft: ${Number(material.cost_per_bdft ?? 0).toFixed(2)}</span>
            </footer>
          </article>
        );
      })}
    </div>
  );
};
