import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useEstimatorStore } from "@/state/estimatorStore";
import { useMaterialStore } from "@/state/materialStore";
import { useSettingsStore } from "@/state/settingsStore";
import { calculateAssemblyValues } from "@/lib/calcAssembly";

interface AddAssemblyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAssemblyModal({ isOpen, onClose }: AddAssemblyModalProps) {
  const { addAssembly, recalcTotals } = useEstimatorStore();
  const settings = useSettingsStore((s) => s.settings);
  const materials = useMaterialStore((s) => s.materials);

  // 🧱 Local state
  const [assemblyName, setAssemblyName] = useState("");
  const [type, setType] = useState("Wall");
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]?.name ?? "");
  const [foamType, setFoamType] = useState("Open-Cell");
  const [thickness, setThickness] = useState("3");
  const [area, setArea] = useState("");
  const [height, setHeight] = useState("");
  const [pitch, setPitch] = useState("");
  const [mobilization, setMobilization] = useState(settings.mobilizationFee.toString());
  const [boardFeet, setBoardFeet] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // 🧮 Auto-recalculate totals when inputs change
  useEffect(() => {
    const a = parseFloat(area) || 0;
    const h = parseFloat(height) || 0;
    const p = parseFloat(pitch) || 1;
    const t = parseFloat(thickness) || 0;
    const mob = parseFloat(mobilization) || 0;

    // Pull admin-defined rates
    const l = settings.laborRate;
    const m = settings.marginPercent;

    let bf = 0;
    if (type === "Wall" && a && h && t) bf = a * h * t;
    else if (type === "Attic" && a && p && t) bf = a * p * t;
    else if (a && t) bf = a * t;
    setBoardFeet(bf);

    if (!selectedMaterial || bf === 0) {
      setTotalCost(0);
      return;
    }

    const mat = materials.find((m) => m.name === selectedMaterial);
    const costPerBdFt = mat?.costPerBdFt ?? 0.067;

    const materialCost = bf * costPerBdFt;
    const laborCost = bf * l;
    const subtotal = materialCost + laborCost + mob;
    const marginValue = subtotal * (m / 100);
    setTotalCost(subtotal + marginValue);
  }, [
    area,
    height,
    pitch,
    thickness,
    mobilization,
    type,
    foamType,
    selectedMaterial,
    materials,
    settings.laborRate,
    settings.marginPercent,
  ]);

  // 💾 Save handler
  const handleSave = () => {
    if (!assemblyName) return alert("Assembly name required.");
    if (!selectedMaterial) return alert("Please select a material.");

    const formData = {
      id: crypto.randomUUID(),
      name: assemblyName,
      materialName: selectedMaterial,
      foamType,
      type,
      thickness: parseFloat(thickness),
      area: parseFloat(area) || 0,
      height: parseFloat(height) || 0,
      pitch: parseFloat(pitch) || 1,
      margin: settings.marginPercent,
      laborRate: settings.laborRate,
      mobilization: parseFloat(mobilization),
      boardFeet: 0,
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
    };

    const calculated = calculateAssemblyValues(formData, settings, materials);
    addAssembly(calculated);
    recalcTotals();
    onClose();
    resetForm();
  };

  // ♻️ Reset form
  const resetForm = () => {
    setAssemblyName("");
    setType("Wall");
    setSelectedMaterial("");
    setFoamType("Open-Cell");
    setThickness("3");
    setArea("");
    setHeight("");
    setPitch("");
    setMobilization(settings.mobilizationFee.toString());
    setBoardFeet(0);
    setTotalCost(0);
  };

  // 🧱 UI
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" placement="center">
      <ModalContent>
        <ModalHeader>Add New Assembly</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          {/* Assembly Info */}
          <Input
            label="Assembly Name"
            value={assemblyName}
            onChange={(e) => setAssemblyName(e.target.value)}
          />

          <Select
            label="Assembly Type"
            selectedKeys={[type]}
            onChange={(e) => setType(e.target.value)}
          >
            {["Wall", "Attic", "Roof", "Crawlspace", "Flat Roof"].map((t) => (
              <SelectItem key={t}>{t}</SelectItem>
            ))}
          </Select>

          {/* Material Selector */}
          <Select
            label="Material"
            selectedKeys={[selectedMaterial]}
            onChange={(e) => {
              const key = e.target.value;
              const mat = materials.find((m) => m.name === key);
              if (mat) {
                setSelectedMaterial(mat.name);
                setFoamType(mat.foamType);
              }
            }}
          >
            {materials.map((m) => (
              <SelectItem key={m.name}>
                {`${m.name} — ${m.foamType} ($${m.costPerBdFt.toFixed(3)}/bdft)`}
              </SelectItem>
            ))}
          </Select>

          {/* Dimensional Inputs */}
          <Input
            label="Thickness (inches)"
            type="number"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
          />

          {type === "Wall" && (
            <>
              <Input
                label="Linear Feet"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <Input
                label="Height (ft)"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </>
          )}

          {type === "Attic" && (
            <>
              <Input
                label="Area (sqft)"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
              <Input
                label="Pitch"
                type="number"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
              />
            </>
          )}

          {type !== "Wall" && type !== "Attic" && (
            <Input
              label="Area (sqft)"
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          )}

          {/* Cost Inputs */}
          <Input
            label="Mobilization Fee ($)"
            type="number"
            value={mobilization}
            onChange={(e) => setMobilization(e.target.value)}
          />

          {/* Summary */}
          <div className="flex justify-between text-sm text-default-600">
            <span>
              Board Feet:{" "}
              <strong>
                {boardFeet.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>
            </span>
            <span>
              Total: <strong>${totalCost.toFixed(2)}</strong>
            </span>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="secondary" onPress={handleSave}>
            Save Assembly
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
