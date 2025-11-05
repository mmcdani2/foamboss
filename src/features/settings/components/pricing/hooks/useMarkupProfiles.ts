import { supabase } from "@/lib/supabaseClient"

export function useMarkupProfiles() {
  const getProfiles = async (businessId: string) => {
    const { data, error } = await supabase
      .from("markup_profiles")
      .select("*")
      .eq("business_id", businessId)
    if (error) throw error
    return data
  }

  const addProfile = async (profile: any) => {
    const { error } = await supabase.from("markup_profiles").insert(profile)
    if (error) throw error
  }

  const updateProfile = async (id: string, updates: any) => {
    const { error } = await supabase.from("markup_profiles").update(updates).eq("id", id)
    if (error) throw error
  }

  const removeProfile = async (id: string) => {
    const { error } = await supabase.from("markup_profiles").delete().eq("id", id)
    if (error) throw error
  }

  return { getProfiles, addProfile, updateProfile, removeProfile }
}
