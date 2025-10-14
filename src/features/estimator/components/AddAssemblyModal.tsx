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
import { calculateAssembly } from "@/lib/calculator";

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
  const [foamType, setFoamType] = useState<"Open-Cell" | "Closed-Cell">("Open-Cell");
  const [thickness, setThickness] = useState("3");
  const [area, setArea] = useState("");
  const [height, setHeight] = useState("");
  const [pitch, setPitch] = useState("");
  const [mobilization, setMobilization] = useState(settings.mobilizationFee.toString());
  const [boardFeet, setBoardFeet] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  /* ---------- Auto-recalculate totals ---------- */
  useEffect(() => {
    const a = parseFloat(area) || 0;
    const h = parseFloat(height) || 0;
    const p = parseFloat(pitch) || 1;
    const t = parseFloat(thickness) || 0;
    const mob = parseFloat(mobilization) || 0;

    if (!selectedMaterial || !a || !t) {
      setBoardFeet(0);
      setTotalCost(0);
      return;
    }

    const mat = materials.find((m) => m.name === selectedMaterial);
    const costPerBdFt = mat?.costPerBdFt ?? 0.067;

    // Determine effective area
    const areaToUse = type === "Wall" ? a * h : type === "Attic" ? a * p : a;

    const assemblyInput = {
      name: assemblyName || "Preview",
      area: areaToUse,
      thickness: t,
      isLinear: type === "Wall",
      materialType: foamType === "Open-Cell" ? "OC" : "CC" as "OC" | "CC",
      materialCostPerBdFt: costPerBdFt,
    };

    const result = calculateAssembly(assemblyInput, {
      laborRate: settings.laborRate ?? 35,
      crewSize: settings.crewSize ?? 2,
      materialCostPerBdFt: assemblyInput.materialCostPerBdFt,
      mobilizationFee: mob,
      overhead: settings.overhead ?? 10,
      profitMargin: settings.profitMargin ?? settings.marginPercent ?? 20,
      defaultMargin: (settings.marginPercent ?? 20) / 100,
      fuelSurchargePerMile: 0,
      productionRateBdFtPerHour: settings.prodTypical ?? 900,
      exampleBoardFeet: 1000,
    });


    setBoardFeet(result.boardFeet);
    setTotalCost(result.totalCostWithMargin);
  }, [
    area,
    height,
    pitch,
    thickness,
    mobilization,
    type,
    selectedMaterial,
    materials,
    settings,
    assemblyName,
    foamType,
  ]);

  /* ---------- Save handler ---------- */
  const handleSave = () => {
    if (!assemblyName) return alert("Assembly name required.");
    if (!selectedMaterial) return alert("Please select a material.");

    const mat = materials.find((m) => m.name === selectedMaterial);
    const costPerBdFt = mat?.costPerBdFt ?? 0.067;

    const a = parseFloat(area) || 0;
    const h = parseFloat(height) || 0;
    const p = parseFloat(pitch) || 1;
    const t = parseFloat(thickness) || 0;
    const mob = parseFloat(mobilization) || 0;

    const areaToUse = type === "Wall" ? a * h : type === "Attic" ? a * p : a;

    const assemblyInput = {
      name: assemblyName,
      area: areaToUse,
      thickness: t,
      isLinear: type === "Wall",
      materialType: foamType === "Open-Cell" ? "OC" : "CC" as "OC" | "CC",
      materialCostPerBdFt: costPerBdFt,
    };

    const result = calculateAssembly(assemblyInput, {
      laborRate: settings.laborRate ?? 35,
      crewSize: settings.crewSize ?? 2,
      materialCostPerBdFt: assemblyInput.materialCostPerBdFt,
      mobilizationFee: mob,
      overhead: settings.overhead ?? 10,
      profitMargin: settings.profitMargin ?? settings.marginPercent ?? 20,
      defaultMargin: settings.marginPercent ? settings.marginPercent / 100 : 0.2,
      fuelSurchargePerMile: 0,
      productionRateBdFtPerHour: settings.prodTypical ?? 900,
      exampleBoardFeet: 1000,
    });


    addAssembly({
      id: crypto.randomUUID(),
      name: assemblyName,
      materialName: selectedMaterial,
      foamType,
      type,
      thickness: t,
      area: a,
      height: h,
      pitch: p,
      margin: settings.marginPercent,
      laborRate: settings.laborRate,
      mobilization: mob,
      totalCost: result.totalCostWithMargin, // ✅ Add this line
      ...result,
    });


    recalcTotals();
    onClose();
    resetForm();
  };

  /* ---------- Reset form ---------- */
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

  /* ---------- UI ---------- */
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
                setFoamType(
                  mat.foamType === "Closed-Cell" ? "Closed-Cell" : "Open-Cell"
                );
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
