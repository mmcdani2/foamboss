"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { useSupabase } from "@/core/providers/SupabaseProvider";
import { useMaterialsData } from "@/features/materials/hooks/useMaterialsData";
import { MaterialTable } from "@/features/materials/components/MaterialTable";
import { MaterialSummary } from "@/features/materials/components/MaterialSummary";
import { MaterialFormModal } from "./components/MaterialFormModal";
import { CategoryTypeModal } from "./components/CategoryTypeModal";


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

    try {
      const user = (await supabase.auth.getUser()).data.user;

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("business_id")
        .eq("id", user?.id)
        .single();

      if (profileError || !profile?.business_id) {
        toast.error("Business ID not found for current user");
        return;
      }

      const { error } = await supabase.from("material_categories").insert([
        {
          category_name: newCategory.name,
          description: newCategory.description,
          business_id: profile.business_id,
        },
      ]);

      if (error) toast.error(error.message);
      else {
        toast.success("Category added");
        await addCategory({
          category_name: newCategory.name,
          description: newCategory.description,
        });
        setIsAddCategoryOpen(false);
        setNewCategory({ name: "", description: "" });
      }
    } catch (err: any) {
      toast.error(err.message);
    }
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
          <MaterialTable
            materials={materials}
            categories={categories}
            onEdit={(m) => {
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
            onDelete={handleDelete}
          />
        </CardBody>
      </Card>

      {/* --- ANALYTICS SUMMARY --- */}
      {materials.length > 0 && (
        <MaterialSummary
          totalInventoryValue={totalInventoryValue}
          topYield={topYield}
        />
      )}

      {/* ADD / EDIT MATERIAL MODAL */}
      <MaterialFormModal
        isOpen={isAddOpen || isEditOpen}
        isEdit={isEditOpen}
        form={form}
        categories={categories}
        types={types}
        onChange={(key, value) => setForm({ ...form, [key]: value })}
        onSave={isEditOpen ? handleEdit : handleAdd}
        onCancel={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }}
      />


      {/* ADD CATEGORY / TYPE MODAL */}
      <CategoryTypeModal
        isOpen={isAddCategoryOpen || isAddTypeOpen}
        categories={categories}
        newCategory={newCategory}
        newType={newType}
        onCategoryChange={(key, value) =>
          setNewCategory({ ...newCategory, [key]: value })
        }
        onTypeChange={(key, value) =>
          setNewType({ ...newType, [key]: value })
        }
        onAddCategory={handleAddCategory}
        onAddType={handleAddType}
        onClearCategory={() => setNewCategory({ name: "", description: "" })}
        onClearType={() => setNewType({ name: "", category_id: "", unit: "" })}
        onClose={() => {
          setIsAddCategoryOpen(false);
          setIsAddTypeOpen(false);
        }}
      />
    </div>
  );
}
