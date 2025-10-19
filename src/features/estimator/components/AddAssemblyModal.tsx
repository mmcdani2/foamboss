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
import { useEffect, useMemo, useState } from "react";
import { useEstimatorStore } from "@/state/estimatorStore";
import { useMaterialStore } from "@/state/materialStore";
import { usePricingSettings } from "@/state/usePricingSettings";


// 🔑 use the composition layer (not primitives)
import {
  calculateAssembly,
  type EstimatorConfig,
  type MaterialType,
  type Condition,
  type AssemblyInput,
  type JobTotalsConfig,
} from "@/lib/estimatorCalculator";

interface AddAssemblyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAssemblyModal({ isOpen, onClose }: AddAssemblyModalProps) {
  const { addAssembly, recalcTotals } = useEstimatorStore();
  const pricing = usePricingSettings((state) => state.pricing);
  const materials = useMaterialStore((s) => s.materials);

  // ── Local form state ─────────────────────────────────────────────
  const [assemblyName, setAssemblyName] = useState("");
  const [type, setType] = useState<"Wall" | "Attic" | "Roof" | "Crawlspace" | "Flat Roof">("Wall");
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]?.name ?? "");
  const [foamType, setFoamType] = useState<"Open-Cell" | "Closed-Cell">("Open-Cell");
  const [thickness, setThickness] = useState("3");
  const [area, setArea] = useState("");      // sqft OR linear feet (for walls)
  const [height, setHeight] = useState("");  // ft (walls only)
  const [pitch, setPitch] = useState("");    // rise over 12 (attic only)
  const [mobilization, setMobilization] = useState(pricing.mobilizationFee.toString());

  // Live preview (calculator output)
  const [boardFeet, setBoardFeet] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const jobPricing: JobTotalsConfig = useMemo(
    () => ({
      mobilizationFee: Number(mobilization) || 0,
      overheadPct: pricing.overhead ?? 0,
      profitPct: pricing.profitMargin ?? 0,
    }),
    [pricing, mobilization]
  );

  // Map settings into an EstimatorConfig (memoized)
  const config: EstimatorConfig = useMemo(() => {
    return {
      laborRatePerHour: pricing.laborRate ?? 35,
      crewSize: pricing.crewSize ?? 2,
      materialMarkupPct: pricing.materialMarkup ?? 0,
      materialCosts: {
        OC: pricing.materialOC ?? undefined,
        CC: pricing.materialCC ?? undefined,
      },
      overheadPct: pricing.overhead ?? 10,
      profitPct: pricing.profitMargin ?? 20,
      mobilizationFee: Number(mobilization) || 0,

      // productivity
      autoProductivity: pricing.autoProductivity ?? true,
      prodTypical: pricing.prodTypical ?? 900,
      prodWideOpen: pricing.prodWideOpen ?? undefined,
      prodTight: pricing.prodTight ?? undefined,
    };
  }, [pricing, mobilization]);

  // Build an AssemblyInput from UI values (memo’d)
  const assemblyInput: AssemblyInput | null = useMemo(() => {
    const t = parseFloat(thickness) || 0;
    const a = parseFloat(area) || 0;
    const h = parseFloat(height) || 0;
    const p = parseFloat(pitch) || 0;

    // pick selected material (for costPerBdFt override if present)
    const mat = materials.find((m) => m.name === selectedMaterial);

    // calculator expects "OC" | "CC"
    const materialType: MaterialType = foamType === "Closed-Cell" ? "CC" : "OC";

    if (t <= 0) return null;
    if (!selectedMaterial || !mat) return null;

    // Map UI type → geometry kind + fields
    if (type === "Wall") {
      if (a <= 0 || h <= 0) return null;
      return {
        kind: "wall",
        name: assemblyName || "Preview",
        materialType,
        materialCostPerBdFt: mat.costPerBdFt, // override if you store real cost here
        thicknessInches: t,
        condition: "typical",
        linearFeet: a,
        heightFeet: h,
      };
    }

    if (type === "Attic") {
      if (a <= 0 || p <= 0) return null;
      return {
        kind: "attic",
        name: assemblyName || "Preview",
        materialType,
        materialCostPerBdFt: mat.costPerBdFt,
        thicknessInches: t,
        condition: "tight", // often slower in attics; adjust if you want
        areaSqft: a,
        pitch: p,
        pitchIsRiseOver12: true,
      };
    }

    // Flat-ish: Roof, Crawlspace, Flat Roof → treat as flat
    if (a <= 0) return null;
    return {
      kind: "flat",
      name: assemblyName || "Preview",
      materialType,
      materialCostPerBdFt: mat.costPerBdFt,
      thicknessInches: t,
      condition: "wide", // generally easier than attic/walls; tweak as desired
      areaSqft: a,
    };
  }, [assemblyName, type, foamType, thickness, area, height, pitch, materials, selectedMaterial]);

  // Recompute preview via estimator calculator
  useEffect(() => {
    if (!assemblyInput) {
      setBoardFeet(0);
      setTotalCost(0);
      return;
    }

    const result = calculateAssembly(assemblyInput, config);
    // We only preview the assembly total (O&P applied at assembly level)
    setBoardFeet(result.boardFeet);
    setTotalCost(result.totalWithMargin);
  }, [assemblyInput, config]);

  // ── Save handler ────────────────────────────────────────────────
  const handleSave = () => {
    if (!assemblyInput) {
      alert("Please complete the required fields.");
      return;
    }

    const result = calculateAssembly(assemblyInput, config);

    // Persist into your estimator store shape
    addAssembly({
      id: crypto.randomUUID(),
      name: assemblyInput.name,
      materialName: selectedMaterial,
      foamType,
      type,
      thickness: parseFloat(thickness) || 0,
      area: parseFloat(area) || 0,
      height: parseFloat(height) || 0,
      pitch: parseFloat(pitch) || 0,
      margin: pricing.profitMargin,
      laborRate: pricing.laborRate,
      mobilization: Number(mobilization) || 0,

      // calculator results we actually store
      boardFeet: result.boardFeet,
      materialCost: result.materialCost,
      laborCost: result.laborCost,
      totalCost: result.totalWithMargin,
    }, jobPricing);

    recalcTotals(jobPricing);
    onClose();
    resetForm();
  };

  // ── Reset form ──────────────────────────────────────────────────
  const resetForm = () => {
    setAssemblyName("");
    setType("Wall");
    setSelectedMaterial(materials[0]?.name ?? "");
    setFoamType("Open-Cell");
    setThickness("3");
    setArea("");
    setHeight("");
    setPitch("");
    setMobilization((pricing.mobilizationFee ?? 50).toString());
    setBoardFeet(0);
    setTotalCost(0);
  };

  // ── UI ──────────────────────────────────────────────────────────
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
            onChange={(e) => setType(e.target.value as typeof type)}
          >
            {["Wall", "Attic", "Roof", "Crawlspace", "Flat Area"].map((t) => (
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
                setFoamType(mat.foamType === "Closed-Cell" ? "Closed-Cell" : "Open-Cell");
              }
            }}
          >
            {materials.map((m) => (
              <SelectItem key={m.name}>
                {`${m.name} — ${m.foamType} ($${m.costPerBdFt.toFixed(3)}/bdft)`}
              </SelectItem>
            ))}
          </Select>

          {/* Dimensions */}
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
                label="Pitch (rise over 12, e.g. 4 for 4/12)"
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

          {/* Fees */}
          <Input
            label="Mobilization Fee ($)"
            type="number"
            value={mobilization}
            onChange={(e) => setMobilization(e.target.value)}
          />

          {/* Live Preview */}
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




