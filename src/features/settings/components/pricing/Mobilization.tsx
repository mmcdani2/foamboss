"use client"

import { useEffect, useState } from "react"
import { Button, Input, Card, CardHeader, CardBody, Spacer } from "@heroui/react"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useMobilization } from "./hooks/useMobilization"
import { useBusinessId } from "@/hooks/useBusinessId"

export default function Mobilization() {
  const [settings, setSettings] = useState<any[]>([])
  const { getSettings, addSetting, updateSetting, removeSetting } = useMobilization()
  const { businessId, loading } = useBusinessId()

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || loading) return
      try {
        const data = await getSettings(businessId)
        setSettings(data)
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load mobilization settings")
      }
    }
    fetchData()
  }, [businessId, loading])

  const handleAddSetting = async () => {
    if (!businessId) {
      toast.error("Business context not found")
      return
    }

    try {
      const newSetting = {
        business_id: businessId,
        base_mobilization_fee: 0,
        fuel_cost_per_mile: 0,
        fuel_surcharge_per_mile: 0,
        lift_rental_daily: 0,
        generator_daily: 0,
        crew_travel_pay_per_hour: 0,
        daily_minimum_hours: 0,
        per_diem: 0,
      }
      await addSetting(newSetting)
      toast.success("Setting added")

      const data = await getSettings(businessId)
      setSettings(data)
    } catch (err: any) {
      toast.error("Error adding setting")
      console.error(err)
    }
  }

  if (loading) return null
  if (!businessId) return null

  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Mobilization Settings</h3>
        <Button
          color="primary"
          variant="flat"
          onClick={handleAddSetting}
          startContent={<PlusCircle size={16} />}
        >
          Add Setting
        </Button>
      </CardHeader>

      <CardBody className="space-y-4">
        {settings.length === 0 ? (
          <p className="text-sm text-default-500">
            No mobilization settings found. Add one to begin.
          </p>
        ) : (
          settings.map((s) => (
            <Card key={s.id} className="p-4 bg-content2 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="number"
                  label="Base Fee ($)"
                  value={s.base_mobilization_fee}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((p) =>
                        p.id === s.id
                          ? { ...p, base_mobilization_fee: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Fuel Cost / Mile ($)"
                  value={s.fuel_cost_per_mile}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((p) =>
                        p.id === s.id
                          ? { ...p, fuel_cost_per_mile: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Fuel Surcharge / Mile ($)"
                  value={s.fuel_surcharge_per_mile}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((p) =>
                        p.id === s.id
                          ? { ...p, fuel_surcharge_per_mile: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Lift Rental / Day ($)"
                  value={s.lift_rental_daily}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((p) =>
                        p.id === s.id
                          ? { ...p, lift_rental_daily: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Generator / Day ($)"
                  value={s.generator_daily}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((p) =>
                        p.id === s.id
                          ? { ...p, generator_daily: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Crew Travel Pay / Hour ($)"
                  value={s.crew_travel_pay_per_hour}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((p) =>
                        p.id === s.id
                          ? { ...p, crew_travel_pay_per_hour: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Daily Minimum Hours"
                  value={s.daily_minimum_hours}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((p) =>
                        p.id === s.id
                          ? { ...p, daily_minimum_hours: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Per Diem ($)"
                  value={s.per_diem}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((p) =>
                        p.id === s.id ? { ...p, per_diem: parseFloat(e.target.value) } : p
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
                      await updateSetting(s.id, { ...s })
                      toast.success("Mobilization setting saved successfully")
                      // brief delay before re-fetch
                      setTimeout(async () => {
                        const refreshed = await getSettings(businessId)
                        setSettings(refreshed)
                      }, 200)
                    } catch (err: any) {
                      console.error(err)
                      toast.error("Error saving mobilization setting")
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
                      await removeSetting(s.id)
                      toast.success("Mobilization setting deleted successfully")
                      const refreshed = await getSettings(businessId)
                      setSettings(refreshed)
                    } catch (err: any) {
                      console.error(err)
                      toast.error("Error deleting mobilization setting")
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
