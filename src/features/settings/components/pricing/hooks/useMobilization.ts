import { supabase } from "@/lib/supabaseClient"

export function useMobilization() {
  const getSettings = async (businessId: string) => {
    const { data, error } = await supabase
      .from("mobilization_settings")
      .select("*")
      .eq("business_id", businessId)
    if (error) throw error
    return data
  }

  const addSetting = async (setting: any) => {
    const { error } = await supabase.from("mobilization_settings").insert(setting)
    if (error) throw error
  }

  const updateSetting = async (id: string, updates: any) => {
    const { error } = await supabase.from("mobilization_settings").update(updates).eq("id", id)
    if (error) throw error
  }

  const removeSetting = async (id: string) => {
    const { error } = await supabase.from("mobilization_settings").delete().eq("id", id)
    if (error) throw error
  }

  return { getSettings, addSetting, updateSetting, removeSetting }
}

