// src/features/materials/lib/materials.api.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export interface MaterialPayload {
  material_name: string;
  material_type_id: string;
  unit_price: number;
  yield_per_unit: number;
  unit_type: string;
  quantity_on_hand?: number;
  notes?: string;
  updated_at?: string;
}

export interface CategoryPayload {
  category_name: string;
  description?: string;
}

export interface TypePayload {
  type_name: string;
  category_id: string;
  default_unit?: string;
}

// --- Material Pricing & Yields ---
export async function fetchMaterials(supabase: SupabaseClient) {
  return supabase
    .from("material_pricing_yields")
    .select("*, material_types(type_name, category_id)")
    .order("material_name");
}

export async function insertMaterial(
  supabase: SupabaseClient,
  payload: MaterialPayload
) {
  return supabase.from("material_pricing_yields").insert([payload]);
}

export async function updateMaterial(
  supabase: SupabaseClient,
  id: string,
  payload: Partial<MaterialPayload>
) {
  return supabase.from("material_pricing_yields").update(payload).eq("id", id);
}

export async function deleteMaterial(supabase: SupabaseClient, id: string) {
  return supabase.from("material_pricing_yields").delete().eq("id", id);
}

// --- Categories ---
export async function fetchCategories(supabase: SupabaseClient) {
  return supabase
    .from("material_categories")
    .select("*")
    .order("category_name");
}

export async function insertCategory(
  supabase: SupabaseClient,
  payload: CategoryPayload
) {
  return supabase.from("material_categories").insert([payload]);
}

// --- Types ---
export async function fetchTypes(supabase: SupabaseClient) {
  return supabase.from("material_types").select("*").order("type_name");
}

export async function insertType(
  supabase: SupabaseClient,
  payload: TypePayload
) {
  return supabase.from("material_types").insert([payload]);
}
