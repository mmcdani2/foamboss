"use client"

import { useEffect, useState } from "react"
import { Button, Input, Switch, Spacer, Card, CardHeader, CardBody } from "@heroui/react"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useMarkupProfiles } from "./hooks/useMarkupProfiles"
import { useBusinessId } from "@/hooks/useBusinessId"

export default function Markup() {
  const [profiles, setProfiles] = useState<any[]>([])
  const { getProfiles, addProfile, updateProfile, removeProfile } = useMarkupProfiles()
  const { businessId, loading } = useBusinessId()

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || loading) return
      try {
        const data = await getProfiles(businessId)
        setProfiles(data)
      } catch (err: any) {
        console.error(err)
        toast.error("Failed to load markup profiles")
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
        profile_name: "New Profile",
        target_margin_percent: 40,
        markup_multiplier: 1.67,
        min_bid_amount: 0,
        apply_to_category: null,
        default_profile: false,
      }
      await addProfile(newProfile)
      toast.success("Profile added")

      const data = await getProfiles(businessId)
      setProfiles(data)
    } catch (err: any) {
      console.error(err)
      toast.error("Error adding profile")
    }
  }

  if (loading) return null
  if (!businessId) return null

  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Markup Profiles</h3>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onClick={handleAddProfile}
          startContent={<PlusCircle size={16} />}
        >
          Add Profile
        </Button>
      </CardHeader>

      <CardBody className="space-y-4">
        {profiles.length === 0 ? (
          <p className="text-sm text-default-500">
            No profiles found. Add your first markup profile.
          </p>
        ) : (
          profiles.map((profile) => (
            <Card key={profile.id} className="p-4 bg-content2 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
                <Input
                  label="Name"
                  value={profile.profile_name}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === profile.id ? { ...p, profile_name: e.target.value } : p
                      )
                    )
                  }
                />
                <Input
                  label="Margin %"
                  type="number"
                  value={profile.target_margin_percent}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === profile.id
                          ? { ...p, target_margin_percent: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  label="Multiplier"
                  type="number"
                  step="0.01"
                  value={profile.markup_multiplier}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === profile.id
                          ? { ...p, markup_multiplier: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />
                <Input
                  label="Min Bid"
                  type="number"
                  value={profile.min_bid_amount}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((p) =>
                        p.id === profile.id
                          ? { ...p, min_bid_amount: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                />

                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs text-default-600 mb-1">Default</span>
                  <Switch
                    isSelected={profile.default_profile}
                    onValueChange={(checked: boolean) =>
                      setProfiles((prev) =>
                        prev.map((p) =>
                          p.id === profile.id
                            ? { ...p, default_profile: checked }
                            : { ...p, default_profile: false }
                        )
                      )
                    }
                  />
                </div>
              </div>

              <Spacer y={2} />

              <div className="flex justify-end gap-2 mt-3 md:mt-0">
                <Button
                  size="sm"
                  color="secondary"
                  variant="flat"
                  onClick={async () => {
                    try {
                      await updateProfile(profile.id, { ...profile })
                      toast.success("Profile saved successfully")
                      // Give Supabase a short moment to persist before refetching
                      setTimeout(async () => {
                        const refreshed = await getProfiles(businessId)
                        setProfiles(refreshed)
                      }, 200)
                    } catch (err: any) {
                      console.error(err)
                      toast.error("Error saving profile")
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
                      await removeProfile(profile.id)
                      toast.success("Profile deleted successfully")
                      const refreshed = await getProfiles(businessId)
                      setProfiles(refreshed)
                    } catch (err: any) {
                      console.error(err)
                      toast.error("Error deleting profile")
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
