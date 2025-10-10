import { Assembly } from "@/features/estimator/store/estimatorStore";
import { Settings } from "@/features/settings/store/settingsStore";
import { Material } from "@/features/materials/store/materialStore";

/**
 * Calculates assembly costs using current settings and materials.
 * Includes per-job mobilization fee override.
 */
export function calculateAssemblyValues(
  asm: Assembly,
  settings: Settings,
  materials: Material[]
): Assembly {
  let boardFeet = 0;

  // --- Board Feet ---
  switch (asm.type) {
    case "Wall":
      if (asm.area && asm.height && asm.thickness) {
        // ✅ convert inches → feet
        boardFeet = asm.area * asm.height * asm.thickness;
      }
      break;

    case "Attic":
      if (asm.area && asm.pitch && asm.thickness) {
        boardFeet = asm.area * asm.pitch * asm.thickness;
      }
      break;

    default:
      if (asm.area && asm.thickness) {
        boardFeet = asm.area * asm.thickness;
      }
      break;
  }


  // --- Material cost lookup ---
  const matchedMaterial = materials.find(
    (m) =>
      m.foamType.toLowerCase() === asm.foamType.toLowerCase() ||
      m.name.toLowerCase().includes(asm.foamType.toLowerCase())
  );

  const costPerBdft =
    matchedMaterial?.costPerBdFt ??
    (asm.foamType.toLowerCase().includes("closed") ? 0.26 : 0.067);

  const materialCost = boardFeet * costPerBdft;

  // --- Labor cost ---
  const laborRate = asm.laborRate ?? settings.laborRate; // ✅ allow per-job override
  const laborCost = boardFeet * laborRate;

  // --- Subtotal + mobilization fee ---
  const mobilizationFee =
    asm.mobilization ?? settings.mobilizationFee ?? 0; // ✅ allow per-job override
  let subtotal = materialCost + laborCost + mobilizationFee;

  // --- Optional fuel surcharge ---
  if (settings.includeFuelSurcharge) {
    subtotal *= 1.05; // 5% bump if enabled
  }

  // --- Margin ---
  const marginValue = subtotal * ((asm.margin ?? settings.marginPercent) / 100);
  const totalCost = subtotal + marginValue;

  return {
    ...asm,
    boardFeet: Math.round(boardFeet),
    materialCost: Math.round(materialCost),
    laborCost: Math.round(laborCost),
    totalCost: Math.round(totalCost),
    mobilization: mobilizationFee,
  };
}
