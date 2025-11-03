import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Material,
  MaterialCategory,
  MaterialType,
  CreateMaterialInput,
  UpdateMaterialInput,
  CreateCategoryInput,
  CreateTypeInput,
} from "./Materials.types";

/* -------------------------------------------------------------------------- */
/*                             CONTEXT TYPE DEFINITION                        */
/* -------------------------------------------------------------------------- */

export interface ApiContext {
  supabase: SupabaseClient;
  businessId: string;
  userId?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  FETCHERS                                  */
/* -------------------------------------------------------------------------- */

export async function fetchCategories({ supabase, businessId }: ApiContext) {
  return await supabase
    .from("material_categories")
    .select(
      "id, business_id, category_name, description, is_system, created_at"
    )
    .or(`business_id.eq.${businessId},is_system.eq.true`)
    .order("category_name", { ascending: true });
}

export async function fetchTypes({ supabase, businessId }: ApiContext) {
  return await supabase
    .from("material_types")
    .select(
      "id, business_id, category_id, type_name, default_unit, description, is_system, created_at"
    )
    .or(`business_id.eq.${businessId},is_system.eq.true`)
    .order("type_name", { ascending: true });
}

export async function fetchMaterials({ supabase, businessId }: ApiContext) {
  return await supabase
    .from("material_pricing_yields")
    .select(
      `
      id,
      material_name,
      material_type_id,
      unit_price,
      unit_type,
      yield_per_unit,
      quantity_on_hand,
      reorder_level,
      cost_per_bdft,
      notes,
      created_at,
      updated_at,
      material_types (
        id,
        type_name,
        category_id,
        business_id,
        is_system
      )
    `
    )
    .or(
      `business_id.eq.${businessId},is_system.eq.true`,
      { foreignTable: "material_types" }
    )
    .order("material_name", { ascending: true });
}

/* -------------------------------------------------------------------------- */
/*                                  INSERTS                                   */
/* -------------------------------------------------------------------------- */

export async function insertMaterial(
  { supabase, businessId, userId }: ApiContext,
  payload: CreateMaterialInput
) {
  return await supabase
    .from("material_pricing_yields")
    .insert([
      {
        ...payload,
        created_by: userId,
      },
    ])
    .select("id");
}

export async function insertCategory(
  { supabase, businessId, userId }: ApiContext,
  payload: CreateCategoryInput
) {
  return await supabase
    .from("material_categories")
    .insert([
      {
        ...payload,
        business_id: businessId,
      },
    ])
    .select("id");
}

export async function insertType(
  { supabase, businessId, userId }: ApiContext,
  payload: CreateTypeInput
) {
  return await supabase
    .from("material_types")
    .insert([
      {
        ...payload,
        business_id: businessId,
      },
    ])
    .select("id");
}

/* -------------------------------------------------------------------------- */
/*                                  UPDATES                                   */
/* -------------------------------------------------------------------------- */

export async function updateMaterial(
  { supabase, businessId }: ApiContext,
  id: string,
  payload: UpdateMaterialInput
) {
  return await supabase
    .from("material_pricing_yields")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id");
}

/* -------------------------------------------------------------------------- */
/*                                  DELETES                                   */
/* -------------------------------------------------------------------------- */

export async function deleteMaterial(
  { supabase, businessId }: ApiContext,
  id: string
) {
  return await supabase
    .from("material_pricing_yields")
    .delete()
    .eq("id", id);
}







