import { supabase } from "@/lib/supabaseClient"

export function usePricingSettings() {
  const getSettings = async (businessId: string) => {
    const { data, error } = await supabase
      .from("pricing_settings")
      .select("*")
      .eq("business_id", businessId)
    if (error) throw error
    return data
  }

  const updateSetting = async (id: string, updates: any) => {
    const { error } = await supabase.from("pricing_settings").update(updates).eq("id", id)
    if (error) throw error
  }

  return { getSettings, updateSetting }
}
