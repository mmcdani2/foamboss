// src/utils/calcAssembly.ts
import { Assembly } from "@/features/estimator/store/estimatorStore";

export function calculateAssemblyValues(a: Assembly) {
  let boardFeet = 0;
  let materialCost = 0;
  let laborCost = 0;

  // Basic foam yield values per set (example numbers)
  const yields = {
    open: 16000, // bdft per set
    closed: 4000,
  };

  // Cost per set
  const costs = {
    open: 700, // dollars per set
    closed: 1200,
  };

  // Labor rate per board foot (simple model)
  const laborRate = 0.25; // $ per bdft

  // --- Board feet calc by type ---
  switch (a.type) {
    case "Wall":
      if (a.area && a.height && a.thickness) {
        boardFeet = a.area * a.height * (a.thickness / 12);
      }
      break;
    case "Attic":
      if (a.area && a.pitch && a.thickness) {
        boardFeet = a.area * a.pitch * (a.thickness / 12);
      }
      break;
    case "Roof":
    case "Flat Roof":
      if (a.area && a.thickness) {
        boardFeet = a.area * (a.thickness / 12);
      }
      break;
    case "Crawl":
      if (a.area && a.thickness) {
        boardFeet = a.area * (a.thickness / 12);
      }
      break;
    default:
      boardFeet = 0;
  }

  // --- Material cost ---
  const foamKey = a.foamType.toLowerCase().includes("closed")
    ? "closed"
    : "open";
  const costPerBdft = costs[foamKey] / yields[foamKey];
  materialCost = boardFeet * costPerBdft;

  // --- Labor cost ---
  laborCost = boardFeet * laborRate;

  // --- Total cost w/ margin ---
  const subtotal = materialCost + laborCost;
  const totalCost = subtotal * (1 + a.margin / 100);

  return {
    ...a,
    boardFeet: Math.round(boardFeet),
    materialCost: Math.round(materialCost),
    laborCost: Math.round(laborCost),
    totalCost: Math.round(totalCost),
  };
}
