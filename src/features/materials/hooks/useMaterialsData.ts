import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useSupabase } from "@/core/providers/SupabaseProvider";
import { useBusinessContext } from "./useBusinessContext";

import {
  fetchCategories,
  fetchTypes,
  fetchMaterials,
  insertMaterial,
  updateMaterial,
  deleteMaterial,
  insertCategory,
  insertType,
} from "@/features/materials/lib/materials.api";

import type {
  MaterialCategory,
  MaterialType,
  Material,
  CreateMaterialInput,
  UpdateMaterialInput,
} from "@/features/materials/lib/Materials.types";

const getErrorMessage = (error: unknown): string => {
  if (!error) return "Unknown error";
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const normalizeMaterialRow = (row: any): Material => {
  const relatedType = Array.isArray(row?.material_types)
    ? row.material_types[0]
    : row.material_types;

  return {
    id: row.id,
    business_id: row.business_id ?? relatedType?.business_id,
    material_name: row.material_name,
    material_type_id: row.material_type_id,
    unit_price: Number(row.unit_price) || 0,
    unit_type: row.unit_type,
    yield_per_unit: Number(row.yield_per_unit) || 0,
    quantity_on_hand: Number(row.quantity_on_hand) || 0,
    reorder_level: row.reorder_level != null ? Number(row.reorder_level) : undefined,
    cost_per_bdft: row.cost_per_bdft != null ? Number(row.cost_per_bdft) : undefined,
    notes: row.notes ?? undefined,
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
    material_types: relatedType
      ? {
          id: relatedType.id,
          type_name: relatedType.type_name,
          category_id: relatedType.category_id,
        }
      : undefined,
  };
};

export function useMaterialsData() {
  const { supabase } = useSupabase();
  const { businessId, user, loading: businessLoading } = useBusinessContext();

  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [types, setTypes] = useState<MaterialType[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [catRes, typeRes, matRes] = await Promise.all([
        fetchCategories({ supabase, businessId }),
        fetchTypes({ supabase, businessId }),
        fetchMaterials({ supabase, businessId }),
      ]);

      if (catRes.error) throw catRes.error;
      if (typeRes.error) throw typeRes.error;
      if (matRes.error) throw matRes.error;

      setCategories((catRes.data ?? []) as MaterialCategory[]);
      setTypes((typeRes.data ?? []) as MaterialType[]);
      setMaterials((matRes.data ?? []).map(normalizeMaterialRow));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [supabase, businessId]);

  const addMaterial = useCallback(
    async (payload: CreateMaterialInput) => {
      if (!businessId) return toast.error("Business context not loaded.");
      const { error } = await insertMaterial(
        { supabase, businessId, userId: user?.id },
        payload
      );
      if (error) return toast.error(getErrorMessage(error));

      toast.success(`${payload.material_name} added`);
      setMaterials((prev) => {
        const relatedType = types.find((t) => t.id === payload.material_type_id);
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            business_id: relatedType?.business_id,
            material_name: payload.material_name,
            material_type_id: payload.material_type_id,
            unit_price: payload.unit_price,
            unit_type: payload.unit_type,
            yield_per_unit: payload.yield_per_unit,
            quantity_on_hand: payload.quantity_on_hand,
            notes: payload.notes,
            material_types: relatedType
              ? {
                  id: relatedType.id,
                  type_name: relatedType.type_name,
                  category_id: relatedType.category_id,
                }
              : undefined,
          },
        ];
      });

      await refresh();
    },
    [supabase, businessId, user, refresh, types]
  );

  const editMaterial = useCallback(
    async (id: string, payload: UpdateMaterialInput) => {
      if (!businessId) return toast.error("Business context not loaded.");
      const { error } = await updateMaterial(
        { supabase, businessId, userId: user?.id },
        id,
        payload
      );
      if (error) return toast.error(getErrorMessage(error));

      toast.success(`${payload.material_name} updated`);
      setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, ...payload } : m)));
      await refresh();
    },
    [supabase, businessId, user, refresh]
  );

  const removeMaterial = useCallback(
    async (id: string) => {
      if (!businessId) return toast.error("Business context not loaded.");
      const { error } = await deleteMaterial(
        { supabase, businessId, userId: user?.id },
        id
      );
      if (error) return toast.error(getErrorMessage(error));

      toast.warning("Material deleted");
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      await refresh();
    },
    [supabase, businessId, user, refresh]
  );

  const addCategory = useCallback(
    async (payload: Pick<MaterialCategory, "category_name" | "description">) => {
      if (!businessId) return toast.error("Business context not loaded.");
      const { error } = await insertCategory(
        { supabase, businessId, userId: user?.id },
        payload
      );
      if (error) return toast.error(getErrorMessage(error));

      toast.success("Category added");
      await refresh();
    },
    [supabase, businessId, user, refresh]
  );

  const addType = useCallback(
    async (payload: Pick<MaterialType, "category_id" | "type_name" | "default_unit">) => {
      if (!businessId) return toast.error("Business context not loaded.");
      const { error } = await insertType(
        { supabase, businessId, userId: user?.id },
        payload
      );
      if (error) return toast.error(getErrorMessage(error));

      toast.success("Material type added");
      await refresh();
    },
    [supabase, businessId, user, refresh]
  );

  useEffect(() => {
    if (!businessLoading && businessId) {
      refresh();
    }
  }, [businessLoading, businessId, refresh]);

  return {
    categories,
    types,
    materials,
    loading,
    refresh,
    addMaterial,
    editMaterial,
    removeMaterial,
    addCategory,
    addType,
  };
}
