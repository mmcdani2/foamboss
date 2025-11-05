"use client"

import { useEffect, useState } from "react"
import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useLaborProfiles } from "./hooks/useLaborProfiles"
import { useBusinessId } from "@/hooks/useBusinessId"
import { formatPayValue } from "./utils/formatters"


export default function Labor() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [newProfile, setNewProfile] = useState({
    role_name: "",
    pay_type: "hourly",
    pay_value: 0,
    unit: "$/hr",
  })
  const { getProfiles, addProfile, updateProfile, removeProfile } = useLaborProfiles()
  const { businessId, loading } = useBusinessId()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

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

  const handleAddProfile = async (onClose: () => void) => {
    if (!businessId) {
      toast.error("Business context not found")
      return
    }

    try {
      await addProfile({ ...newProfile, business_id: businessId })
      toast.success("Profile added successfully")
      const updated = await getProfiles(businessId)
      setProfiles(updated)
      setNewProfile({ role_name: "", pay_type: "hourly", pay_value: 0, unit: "$/hr" })
      onClose()
    } catch (err: any) {
      console.error(err)
      toast.error("Error adding profile")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await removeProfile(id)
      toast.success("Profile deleted successfully")
      if (!businessId) return
      const refreshed = await getProfiles(businessId)

      setProfiles(refreshed)
    } catch (err: any) {
      console.error(err)
      toast.error("Error deleting profile")
    }
  }

  const handleSave = async (profile: any) => {
    try {
      await updateProfile(profile.id, profile)
      toast.success("Profile updated successfully")
      if (!businessId) return
      const refreshed = await getProfiles(businessId)
      setProfiles(refreshed)
    } catch (err: any) {
      console.error(err)
      toast.error("Error saving profile")
    }
  }

  if (loading) return null
  if (!businessId) return null

  return (
    <Card className="p-4">
      <CardHeader className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Labor Pay Profiles</h3>
        <Button color="primary" onPress={onOpen} startContent={<PlusCircle size={16} />}>
          Add Profile
        </Button>
      </CardHeader>

      <CardBody>
        <Table aria-label="Labor Profiles Table" shadow="none">
          <TableHeader>
            <TableColumn>Role</TableColumn>
            <TableColumn>Pay Type</TableColumn>
            <TableColumn>Value</TableColumn>
            <TableColumn>Unit</TableColumn>
            <TableColumn align="end">Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No labor profiles yet.">
            {profiles.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.role_name}</TableCell>
                <TableCell>{p.pay_type}</TableCell>
                <TableCell>{formatPayValue(p.pay_value, p.pay_type)}</TableCell>
                <TableCell>{p.unit}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    color="secondary"
                    onClick={() => handleSave(p)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>

      {/* Add Profile Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add New Profile</ModalHeader>
              <ModalBody className="space-y-3">
                <Input
                  label="Role"
                  value={newProfile.role_name}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, role_name: e.target.value })
                  }
                />

                <Select
                  label="Pay Type"
                  selectedKeys={[newProfile.pay_type]}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string
                    setNewProfile({ ...newProfile, pay_type: val })
                  }}
                >
                  <SelectItem key="hourly">Hourly</SelectItem>
                  <SelectItem key="board_foot">Board Foot</SelectItem>
                  <SelectItem key="job_based">Job-Based</SelectItem>
                </Select>

                <Input
                  label="Pay Value"
                  type="number"
                  value={String(newProfile.pay_value)}
                  onChange={(e) =>
                    setNewProfile({
                      ...newProfile,
                      pay_value: parseFloat(e.target.value) || 0,
                    })
                  }
                />

                <Input
                  label="Unit"
                  value={
                    newProfile.pay_type === "hourly"
                      ? "$/hour"
                      : newProfile.pay_type === "board_foot"
                        ? "$/BF"
                        : "% of Net"
                  }
                  isReadOnly
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onClick={() => handleAddProfile(onClose)}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  )
}
