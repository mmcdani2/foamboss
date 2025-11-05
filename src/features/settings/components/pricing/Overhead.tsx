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
import { useOverhead } from "./hooks/useOverhead"
import { useBusinessId } from "@/hooks/useBusinessId"

export default function Overhead() {
  const [overheads, setOverheads] = useState<any[]>([])
  const { getOverheads, addOverhead, updateOverhead, removeOverhead } = useOverhead()
  const { businessId, loading } = useBusinessId()

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || loading) return
      try {
        const data = await getOverheads(businessId)
        setOverheads(data)
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load overhead inputs")
      }
    }
    fetchData()
  }, [businessId, loading])

  const handleAddOverhead = async () => {
    if (!businessId) {
      toast.error("Business context not found")
      return
    }

    try {
      const newItem = {
        business_id: businessId,
        category: "New Overhead Item",
        subcategory: "",
        amount: 0,
        frequency: "monthly",
        allocation_method: "labor_hours",
        notes: "",
      }
      await addOverhead(newItem)
      toast.success("Overhead added")

      const data = await getOverheads(businessId)
      setOverheads(data)
    } catch (err: any) {
      console.error(err)
      toast.error("Error adding overhead item")
    }
  }

  if (loading) return null
  if (!businessId) return null

  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Overhead Inputs</h3>
        <Button
          color="primary"
          variant="flat"
          startContent={<PlusCircle size={16} />}
          onClick={handleAddOverhead}
        >
          Add Overhead
        </Button>
      </CardHeader>

      <CardBody className="space-y-4">
        {overheads.length === 0 ? (
          <p className="text-sm text-default-500">
            No overhead records found. Add your first item.
          </p>
        ) : (
          overheads.map((o) => (
            <Card key={o.id} className="p-4 bg-content2 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  label="Category"
                  value={o.category}
                  onChange={(e) =>
                    setOverheads((prev) =>
                      prev.map((p) =>
                        p.id === o.id ? { ...p, category: e.target.value } : p
                      )
                    )
                  }
                />
                <Input
                  label="Subcategory"
                  value={o.subcategory || ""}
                  onChange={(e) =>
                    setOverheads((prev) =>
                      prev.map((p) =>
                        p.id === o.id ? { ...p, subcategory: e.target.value } : p
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Amount ($)"
                  value={o.amount}
                  onChange={(e) =>
                    setOverheads((prev) =>
                      prev.map((p) =>
                        p.id === o.id
                          ? { ...p, amount: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />

                <Select
                  label="Frequency"
                  selectedKeys={[o.frequency]}
                  onSelectionChange={(val) =>
                    setOverheads((prev) =>
                      prev.map((p) =>
                        p.id === o.id
                          ? { ...p, frequency: Array.from(val)[0] }
                          : p
                      )
                    )
                  }
                >
                  <SelectItem key="weekly">Weekly</SelectItem>
                  <SelectItem key="monthly">Monthly</SelectItem>
                  <SelectItem key="quarterly">Quarterly</SelectItem>
                  <SelectItem key="annual">Annual</SelectItem>
                </Select>

                <Select
                  label="Allocation Method"
                  selectedKeys={[o.allocation_method]}
                  onSelectionChange={(val) =>
                    setOverheads((prev) =>
                      prev.map((p) =>
                        p.id === o.id
                          ? { ...p, allocation_method: Array.from(val)[0] }
                          : p
                      )
                    )
                  }
                >
                  <SelectItem key="labor_hours">Labor Hours</SelectItem>
                  <SelectItem key="job_count">Job Count</SelectItem>
                  <SelectItem key="revenue_percent">Revenue %</SelectItem>
                  <SelectItem key="manual">Manual</SelectItem>
                </Select>

                <Input
                  label="Notes"
                  value={o.notes || ""}
                  onChange={(e) =>
                    setOverheads((prev) =>
                      prev.map((p) =>
                        p.id === o.id ? { ...p, notes: e.target.value } : p
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
                  onClick={() => updateOverhead(o.id, o)}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onClick={() => removeOverhead(o.id)}
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
