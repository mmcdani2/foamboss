import { supabase } from "@/lib/supabaseClient"

export function useOverhead() {
  const getOverheads = async (businessId: string) => {
    const { data, error } = await supabase
      .from("overhead_inputs")
      .select("*")
      .eq("business_id", businessId)
    if (error) throw error
    return data
  }

  const addOverhead = async (item: any) => {
    const { error } = await supabase.from("overhead_inputs").insert(item)
    if (error) throw error
  }

  const updateOverhead = async (id: string, updates: any) => {
    const { error } = await supabase.from("overhead_inputs").update(updates).eq("id", id)
    if (error) throw error
  }

  const removeOverhead = async (id: string) => {
    const { error } = await supabase.from("overhead_inputs").delete().eq("id", id)
    if (error) throw error
  }

  return { getOverheads, addOverhead, updateOverhead, removeOverhead }
}
