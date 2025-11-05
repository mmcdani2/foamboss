import { supabase } from "@/lib/supabaseClient"

export function useProductionRates() {
  const getRates = async (businessId: string) => {
    const { data, error } = await supabase
      .from("production_rates")
      .select("*")
      .eq("business_id", businessId)
    if (error) throw error
    return data
  }

  const addRate = async (rate: any) => {
    const { error } = await supabase.from("production_rates").insert(rate)
    if (error) throw error
  }

  const updateRate = async (id: string, updates: any) => {
    const { error } = await supabase.from("production_rates").update(updates).eq("id", id)
    if (error) throw error
  }

  const removeRate = async (id: string) => {
    const { error } = await supabase.from("production_rates").delete().eq("id", id)
    if (error) throw error
  }

  return { getRates, addRate, updateRate, removeRate }
}
