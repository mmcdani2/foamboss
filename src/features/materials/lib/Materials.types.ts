// Shared type definitions for all Material-related modules

export interface MaterialCategory {
  id: string;
  business_id?: string;
  category_name: string;
  description?: string;
  is_system?: boolean;
  created_at?: string;
}

export interface MaterialType {
  id: string;
  business_id?: string;
  category_id: string;
  type_name: string;
  description?: string;
  default_unit?: string;
  is_system?: boolean;
  created_at?: string;
}

export interface Material {
  id: string;
  business_id?: string;
  material_name: string;
  material_type_id: string;
  unit_price: number;
  yield_per_unit: number;
  unit_type: string;
  quantity_on_hand: number;
  reorder_level?: number;
  cost_per_bdft?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  material_types?: {
    id: string;
    type_name: string;
    category_id: string;
  };
}

/* ------------------------------ Payload Inputs ------------------------------ */

export interface CreateMaterialInput {
  material_name: string;
  material_type_id: string;
  unit_price: number;
  yield_per_unit: number;
  unit_type: string;
  quantity_on_hand: number;
  notes?: string;
}

export interface UpdateMaterialInput extends Partial<CreateMaterialInput> {
  updated_at?: string;
}

export interface CreateCategoryInput {
  category_name: string;
  description?: string;
}

export interface CreateTypeInput {
  category_id: string;
  type_name: string;
  default_unit?: string;
}
