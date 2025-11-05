// src/hooks/useBusinessId.ts
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function useBusinessId() {
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBusinessId = async () => {
      setLoading(true)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error("Auth error:", userError)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("users") // 👈 change from "profiles"
        .select("business_id")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Business lookup error:", error)
      }

      setBusinessId(data?.business_id || null)
      setLoading(false)
    }

    fetchBusinessId()
  }, [])

  return { businessId, loading }
}
