"use client"

import { useEffect, useState } from "react"
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  Spacer,
  Select,
  SelectItem,
} from "@heroui/react"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useProductionRates } from "./hooks/useProductionRates"
import { useBusinessId } from "@/hooks/useBusinessId"

export default function Production() {
  const [rates, setRates] = useState<any[]>([])
  const { getRates, addRate, updateRate, removeRate } = useProductionRates()
  const { businessId, loading } = useBusinessId()

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || loading) return
      try {
        const data = await getRates(businessId)
        setRates(data)
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load production rates")
      }
    }
    fetchData()
  }, [businessId, loading])

  const handleAddRate = async () => {
    if (!businessId) {
      toast.error("Business context not found")
      return
    }

    try {
      const newRate = {
        business_id: businessId,
        application_type: "open_cell",
        description: "Open Cell Foam - Standard",
        rate_tight: 800,
        rate_average: 1000,
        rate_open: 1200,
        unit: "BF/hr",
        crew_size: 3,
        notes: "",
      }
      await addRate(newRate)
      toast.success("Production rate added")
      const data = await getRates(businessId)
      setRates(data)
    } catch (err: any) {
      console.error(err)
      toast.error("Error adding production rate")
    }
  }

  if (loading) return null
  if (!businessId) return null

  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Production Rates</h3>
        <Button
          color="primary"
          variant="flat"
          onClick={handleAddRate}
          startContent={<PlusCircle size={16} />}
        >
          Add Rate
        </Button>
      </CardHeader>

      <CardBody className="space-y-4">
        {rates.length === 0 ? (
          <p className="text-sm text-default-500">
            No production rates found. Add your first rate profile.
          </p>
        ) : (
          rates.map((r) => (
            <Card key={r.id} className="p-4 bg-content2 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                  label="Application Type"
                  selectedKeys={[r.application_type]}
                  onSelectionChange={(val) =>
                    setRates((prev) =>
                      prev.map((p) =>
                        p.id === r.id
                          ? { ...p, application_type: Array.from(val)[0] }
                          : p
                      )
                    )
                  }
                >
                  <SelectItem key="open_cell">Open Cell Foam</SelectItem>
                  <SelectItem key="closed_cell">Closed Cell Foam</SelectItem>
                  <SelectItem key="coatings">Coatings</SelectItem>
                  <SelectItem key="primers">Primers</SelectItem>
                  <SelectItem key="prep">Surface Prep</SelectItem>
                  <SelectItem key="masking">Masking</SelectItem>
                </Select>

                <Input
                  label="Description"
                  value={r.description}
                  onChange={(e) =>
                    setRates((prev) =>
                      prev.map((p) =>
                        p.id === r.id
                          ? { ...p, description: e.target.value }
                          : p
                      )
                    )
                  }
                />

                <Input
                  type="number"
                  label="Crew Size"
                  value={r.crew_size}
                  onChange={(e) =>
                    setRates((prev) =>
                      prev.map((p) =>
                        p.id === r.id
                          ? { ...p, crew_size: parseInt(e.target.value) }
                          : p
                      )
                    )
                  }
                />

                <Input
                  type="number"
                  label="Tight Rate"
                  value={r.rate_tight}
                  onChange={(e) =>
                    setRates((prev) =>
                      prev.map((p) =>
                        p.id === r.id
                          ? { ...p, rate_tight: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />

                <Input
                  type="number"
                  label="Average Rate"
                  value={r.rate_average}
                  onChange={(e) =>
                    setRates((prev) =>
                      prev.map((p) =>
                        p.id === r.id
                          ? { ...p, rate_average: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />

                <Input
                  type="number"
                  label="Open Rate"
                  value={r.rate_open}
                  onChange={(e) =>
                    setRates((prev) =>
                      prev.map((p) =>
                        p.id === r.id
                          ? { ...p, rate_open: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />

                <Select
                  label="Unit"
                  selectedKeys={[r.unit]}
                  onSelectionChange={(val) =>
                    setRates((prev) =>
                      prev.map((p) =>
                        p.id === r.id ? { ...p, unit: Array.from(val)[0] } : p
                      )
                    )
                  }
                >
                  <SelectItem key="BF/hr">BF/hr</SelectItem>
                  <SelectItem key="SF/hr">SF/hr</SelectItem>
                  <SelectItem key="LF/hr">LF/hr</SelectItem>
                </Select>

                <Input
                  label="Notes"
                  value={r.notes || ""}
                  onChange={(e) =>
                    setRates((prev) =>
                      prev.map((p) =>
                        p.id === r.id
                          ? { ...p, notes: e.target.value }
                          : p
                      )
                    )
                  }
                />
              </div>

              <Spacer y={2} />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  color="secondary"
                  variant="flat"
                  onClick={async () => {
                    try {
                      await updateRate(r.id, { ...r })
                      toast.success("Production rate saved successfully")
                      // small delay before refetch to ensure Supabase persistence
                      setTimeout(async () => {
                        const refreshed = await getRates(businessId)
                        setRates(refreshed)
                      }, 200)
                    } catch (err: any) {
                      console.error(err)
                      toast.error("Error saving production rate")
                    }
                  }}
                >
                  Save
                </Button>

                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onClick={async () => {
                    try {
                      await removeRate(r.id)
                      toast.success("Production rate deleted successfully")
                      const refreshed = await getRates(businessId)
                      setRates(refreshed)
                    } catch (err: any) {
                      console.error(err)
                      toast.error("Error deleting production rate")
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </CardBody>
    </Card>
  )
}
