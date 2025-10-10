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
import { useEstimatorStore } from "@/features/estimator/store/estimatorStore";
import { useMaterialStore } from "@/features/materials/store/materialStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore"; // ✅ NEW

interface AddAssemblyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAssemblyModal({ isOpen, onClose }: AddAssemblyModalProps) {
  const { addAssembly, recalcTotals } = useEstimatorStore();
  const { materials } = useMaterialStore();
  const { settings } = useSettingsStore(); // ✅ access global settings

  const [name, setName] = useState("");
  const [type, setType] = useState("Wall");
  const [foamType, setFoamType] = useState("Open-Cell");
  const [thickness, setThickness] = useState("3");
  const [area, setArea] = useState("");
  const [height, setHeight] = useState("");
  const [pitch, setPitch] = useState("");
  const [margin, setMargin] = useState(settings.marginPercent.toString()); // ✅ from settings
  const [laborRate, setLaborRate] = useState(settings.laborRate.toString()); // ✅ from settings
  const [boardFeet, setBoardFeet] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    let bf = 0;
    if (type === "Wall" && area && height && thickness) {
      bf = parseFloat(area) * parseFloat(height) * (parseFloat(thickness) / 12);
    } else if (type === "Attic" && area && thickness && pitch) {
      bf = parseFloat(area) * parseFloat(pitch) * (parseFloat(thickness) / 12);
    } else if (area && thickness) {
      bf = parseFloat(area) * (parseFloat(thickness) / 12);
    }
    setBoardFeet(bf);

    const selectedMaterial = materials.find((m) => m.foamType === foamType);
    const costPerBdFt = selectedMaterial?.costPerBdFt ?? 0.05;

    const materialCost = bf * costPerBdFt;
    const laborCost = bf * parseFloat(laborRate);
    const subtotal = materialCost + laborCost + settings.mobilizationFee;
    const marginValue = subtotal * (parseFloat(margin) / 100);
    setTotalCost(subtotal + marginValue);
  }, [area, height, pitch, thickness, margin, laborRate, type, foamType, materials, settings.mobilizationFee]);

  const handleSave = () => {
    if (!name) return alert("Assembly name required.");

    const selectedMaterial = materials.find((m) => m.foamType === foamType);
    const costPerBdFt = selectedMaterial?.costPerBdFt ?? 0.05;
    const materialCost = boardFeet * costPerBdFt;
    const laborCost = boardFeet * parseFloat(laborRate);
    const subtotal = materialCost + laborCost + settings.mobilizationFee;
    const marginValue = subtotal * (parseFloat(margin) / 100);
    const total = subtotal + marginValue;

    addAssembly({
      id: crypto.randomUUID(),
      name,
      type,
      foamType,
      thickness: parseFloat(thickness),
      area: parseFloat(area) || 0,
      height: parseFloat(height) || 0,
      pitch: parseFloat(pitch) || 1,
      boardFeet,
      materialCost,
      laborCost,
      totalCost: total,
      margin: parseFloat(margin),
    });

    recalcTotals();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setType("Wall");
    setFoamType("Open-Cell");
    setThickness("3");
    setArea("");
    setHeight("");
    setPitch("");
    setMargin(settings.marginPercent.toString());
    setLaborRate(settings.laborRate.toString());
    setBoardFeet(0);
    setTotalCost(0);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" placement="center">
      <ModalContent>
        <ModalHeader>Add New Assembly</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <Input label="Assembly Name" value={name} onChange={(e) => setName(e.target.value)} />

          <Select label="Assembly Type" selectedKeys={[type]} onChange={(e) => setType(e.target.value)}>
            {["Wall", "Attic", "Roof", "Crawlspace", "Flat Roof"].map((t) => (
              <SelectItem key={t}>{t}</SelectItem>
            ))}
          </Select>

          <Select label="Foam Type" selectedKeys={[foamType]} onChange={(e) => setFoamType(e.target.value)}>
            {materials.length > 0 ? (
              materials.map((m) => <SelectItem key={m.foamType}>{m.foamType}</SelectItem>)
            ) : (
              <>
                <SelectItem key="Open-Cell">Open-Cell</SelectItem>
                <SelectItem key="Closed-Cell">Closed-Cell</SelectItem>
              </>
            )}
          </Select>

          <Input label="Thickness (inches)" type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} />

          {type === "Wall" && (
            <>
              <Input label="Linear Feet" type="number" value={area} onChange={(e) => setArea(e.target.value)} />
              <Input label="Height (ft)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </>
          )}

          {type === "Attic" && (
            <>
              <Input label="Area (sqft)" type="number" value={area} onChange={(e) => setArea(e.target.value)} />
              <Input label="Pitch" type="number" value={pitch} onChange={(e) => setPitch(e.target.value)} />
            </>
          )}

          {type !== "Wall" && type !== "Attic" && (
            <Input label="Area (sqft)" type="number" value={area} onChange={(e) => setArea(e.target.value)} />
          )}

          <Input label="Labor Rate ($/bdft)" type="number" value={laborRate} onChange={(e) => setLaborRate(e.target.value)} />
          <Input label="Margin (%)" type="number" value={margin} onChange={(e) => setMargin(e.target.value)} />

          <div className="flex justify-between text-sm text-default-600">
            <span>
              Board Feet:{" "}
              <strong>
                {boardFeet.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
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
