"use client"

import { useEffect, useState } from "react"
import { Button, Input, Card, CardHeader, CardBody, Spacer } from "@heroui/react"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useLaborProfiles } from "./hooks/useLaborProfiles"
import { useBusinessId } from "@/hooks/useBusinessId"

export default function Labor() {
  const [profiles, setProfiles] = useState<any[]>([])
  const { getProfiles, addProfile, updateProfile, removeProfile } = useLaborProfiles()
  const { businessId, loading } = useBusinessId()

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || loading) return
      try {
        const data = await getProfiles(businessId)
        setProfiles(data)
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load labor profiles")
      }
    }
    fetchData()
  }, [businessId, loading])

  const handleAddProfile = async () => {
    if (!businessId) {
      toast.error("Business context not found")
      return
    }

    try {
      const newProfile = {
        business_id: businessId,
        role_name: "New Role",
        pay_type: "hourly",
        pay_value: 0,
        unit: "$/hr",
        default_profile: false,
      }
      await addProfile(newProfile)
      toast.success("Profile added")
      setProfiles(await getProfiles(businessId))
    } catch (err: any) {
      toast.error("Error adding profile")
      console.error(err)
    }
  }

  if (loading) return null
  if (!businessId) return null

  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Labor Pay Profiles</h3>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onClick={handleAddProfile}
          startContent={<PlusCircle size={16} />}
        >
          Add Profile
        </Button>
      </CardHeader>

      <CardBody className="space-y-4">
        {profiles.length === 0 ? (
          <p className="text-sm text-default-500">
            No profiles found. Add your first labor pay profile.
          </p>
        ) : (
          profiles.map((profile) => (
            <Card key={profile.id} className="p-4 bg-content2 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  label="Role"
                  value={profile.role_name}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === profile.id
                          ? { ...p, role_name: e.target.value }
                          : p
                      )
                    )
                  }
                />
                <Input
                  label="Pay Type"
                  value={profile.pay_type}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === profile.id
                          ? { ...p, pay_type: e.target.value }
                          : p
                      )
                    )
                  }
                />
                <Input
                  label="Value"
                  type="number"
                  value={profile.pay_value}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === profile.id
                          ? { ...p, pay_value: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  label="Unit"
                  value={profile.unit || ""}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === profile.id
                          ? { ...p, unit: e.target.value }
                          : p
                      )
                    )
                  }
                />
              </div>

              <Spacer y={2} />

              <div className="flex justify-end gap-2 mt-3 md:mt-0">
                <Button
                  size="sm"
                  color="secondary"
                  variant="flat"
                  onClick={() => updateProfile(profile.id, profile)}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onClick={() => removeProfile(profile.id)}
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
