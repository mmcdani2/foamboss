import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Chip,
  Progress,
} from "@heroui/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useMaterialStore } from "@/state/materialStore";

export default function Material() {
  const { materials, addMaterial, updateMaterial, removeMaterial } =
    useMaterialStore();

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    foamType: "",
    yield: "",
    costSet: "",
  });

  const resetForm = () =>
    setForm({ name: "", foamType: "", yield: "", costSet: "" });

  // ---------- ADD MATERIAL ----------
  const handleAddMaterial = () => {
    const { name, foamType, yield: yieldVal, costSet } = form;
    if (!name || !foamType || !yieldVal || !costSet) {
      toast.error("Please complete all fields before saving.");
      return;
    }

    const costBdft = Number(costSet) / Number(yieldVal);

    addMaterial({
      id: crypto.randomUUID(),
      name,
      foamType,
      yieldBdFt: Number(yieldVal),
      costPerSet: Number(costSet),
      costPerBdFt: parseFloat(costBdft.toFixed(3)),
    });

    toast.success(`Material "${name}" added successfully.`);
    resetForm();
    setIsAddModalOpen(false);
  };

  // ---------- EDIT MATERIAL ----------
  const handleEditSave = () => {
    const costBdft = Number(form.costSet) / Number(form.yield);
    updateMaterial(editing.id, {
      name: form.name,
      foamType: form.foamType,
      yieldBdFt: Number(form.yield),
      costPerSet: Number(form.costSet),
      costPerBdFt: parseFloat(costBdft.toFixed(3)),
    });
    toast.info(`"${form.name}" updated successfully.`);
    resetForm();
    setIsEditModalOpen(false);
  };

  // ---------- DELETE MATERIAL ----------
  const handleDelete = (id: string) => {
    const mat = materials.find((m) => m.id === id);
    removeMaterial(id);
    toast.warning(`Material "${mat?.name ?? "Unknown"}" deleted.`);
  };

  // ---------- ANALYTICS ----------
  const totalCost = materials.reduce((sum, m) => sum + m.costPerSet, 0);
  const topFoam =
    materials.length > 0
      ? materials.reduce((a, b) => (a.yieldBdFt > b.yieldBdFt ? a : b))
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-secondary">Materials</h1>
        <Button
          color="secondary"
          startContent={<Plus className="w-5 h-5" />}
          onPress={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          Add Material
        </Button>
      </div>

      {/* --- TABLE --- */}
      <Card shadow="md" className="bg-content2 border border-default/20 mb-6">
        <CardHeader>
          <h2 className="font-semibold text-lg text-foreground">
            Material List
          </h2>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <Table
            aria-label="Material Table"
            shadow="none"
            classNames={{
              th: "bg-content3 text-default-600 font-semibold",
              td: "text-foreground text-sm",
            }}
          >
            <TableHeader>
              <TableColumn>Material Name</TableColumn>
              <TableColumn>Foam Type</TableColumn>
              <TableColumn>Yield (bdft/set)</TableColumn>
              <TableColumn>Cost/Set ($)</TableColumn>
              <TableColumn>Cost/BdFt ($)</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No materials added yet.">
              {materials.map((mat) => (
                <TableRow key={mat.id}>
                  <TableCell>{mat.name}</TableCell>
                  <TableCell>
                    <Chip
                      color={
                        mat.foamType === "Open Cell" ? "primary" : "secondary"
                      }
                      variant="flat"
                    >
                      {mat.foamType}
                    </Chip>
                  </TableCell>
                  <TableCell>{mat.yieldBdFt.toLocaleString()}</TableCell>
                  <TableCell>${mat.costPerSet.toFixed(2)}</TableCell>
                  <TableCell>${mat.costPerBdFt.toFixed(3)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="secondary"
                        variant="flat"
                        onPress={() => {
                          setEditing(mat);
                          setForm({
                            name: mat.name,
                            foamType: mat.foamType,
                            yield: mat.yieldBdFt.toString(),
                            costSet: mat.costPerSet.toString(),
                          });
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDelete(mat.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* --- ANALYTICS SUMMARY --- */}
      {materials.length > 0 && (
        <Card shadow="md" className="bg-content2 border border-default/20">
          <CardHeader>
            <h2 className="font-semibold text-lg text-foreground">
              Material Analytics
            </h2>
          </CardHeader>
          <CardBody className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-default-500 text-sm">
                Total Material Cost This Month
              </p>
              <p className="text-2xl font-semibold text-success">
                ${totalCost.toLocaleString()}
              </p>
              <Progress
                value={(totalCost / 50000) * 100}
                color="success"
                className="mt-2"
                aria-label="Material Cost Progress"
              />
            </div>
            <div>
              <p className="text-default-500 text-sm">Top Used Foam</p>
              <p className="text-2xl font-semibold text-secondary">
                {topFoam?.name ?? "N/A"}
              </p>
              <p className="text-sm text-default-500">{topFoam?.foamType}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* --- ADD MODAL --- */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        placement="center"
        backdrop="blur"
        motionProps={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
      >
        <ModalContent className="bg-content2 border border-default/20">
          <ModalHeader className="text-secondary font-semibold">
            Add Material
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Material Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Select
              label="Foam Type"
              selectedKeys={form.foamType ? [form.foamType] : []}
              onChange={(e) => setForm({ ...form, foamType: e.target.value })}
            >
              <SelectItem key="Open Cell">Open Cell</SelectItem>
              <SelectItem key="Closed Cell">Closed Cell</SelectItem>
            </Select>
            <Input
              type="number"
              label="Yield (bdft/set)"
              value={form.yield}
              onChange={(e) => setForm({ ...form, yield: e.target.value })}
            />
            <Input
              type="number"
              label="Cost per Set ($)"
              value={form.costSet}
              onChange={(e) => setForm({ ...form, costSet: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button color="secondary" onPress={handleAddMaterial}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* --- EDIT MODAL --- */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-content2 border border-default/20">
          <ModalHeader className="text-secondary font-semibold">
            Edit Material
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Material Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Select
              label="Foam Type"
              selectedKeys={form.foamType ? [form.foamType] : []}
              onChange={(e) => setForm({ ...form, foamType: e.target.value })}
            >
              <SelectItem key="Open Cell">Open Cell</SelectItem>
              <SelectItem key="Closed Cell">Closed Cell</SelectItem>
            </Select>
            <Input
              type="number"
              label="Yield (bdft/set)"
              value={form.yield}
              onChange={(e) => setForm({ ...form, yield: e.target.value })}
            />
            <Input
              type="number"
              label="Cost per Set ($)"
              value={form.costSet}
              onChange={(e) => setForm({ ...form, costSet: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button color="secondary" onPress={handleEditSave}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
