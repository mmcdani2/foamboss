// src/constants/materialCategories.ts

export interface MaterialType {
  key: string;
  label: string;
  category: string;
  description?: string;
  unitOptions?: string[];
}

export const MATERIAL_TYPES: MaterialType[] = [
  // --- SPRAY FOAMS ---
  {
    key: "OC",
    label: "Open Cell Spray Foam",
    category: "Spray Foams",
    description: "Low-density insulation foam (approx. 0.5 lb/ft³), used for interior walls and attics.",
    unitOptions: ["set"],
  },
  {
    key: "CC",
    label: "Closed Cell Spray Foam",
    category: "Spray Foams",
    description: "High-density insulation foam (approx. 2 lb/ft³), moisture barrier and structural strength.",
    unitOptions: ["set"],
  },
  {
    key: "HFO",
    label: "HFO Closed Cell Foam",
    category: "Spray Foams",
    description: "Low-GWP closed-cell spray foam using HFO blowing agents.",
    unitOptions: ["set"],
  },
  {
    key: "PourFoam",
    label: "Two-Part Pour Foam",
    category: "Spray Foams",
    description: "Used for cavity fills, flotation, and sound dampening.",
    unitOptions: ["set"],
  },

  // --- COATINGS & SEALANTS ---
  {
    key: "Elastomeric",
    label: "Elastomeric Roof Coating",
    category: "Coatings & Sealants",
    description: "Highly elastic coating used to waterproof and reflect UV on roofing surfaces.",
    unitOptions: ["5gal", "55gal"],
  },
  {
    key: "AcrylicCoating",
    label: "Acrylic Coating",
    category: "Coatings & Sealants",
    description: "Durable, reflective coating for UV protection.",
    unitOptions: ["5gal", "55gal"],
  },
  {
    key: "SiliconeCoating",
    label: "Silicone Coating",
    category: "Coatings & Sealants",
    description: "Waterproof coating for ponding water roofs and extreme UV exposure.",
    unitOptions: ["5gal", "55gal"],
  },
  {
    key: "PolyureaCoating",
    label: "Polyurea Coating",
    category: "Coatings & Sealants",
    description: "Fast-curing, high-strength protective coating for roofs, tanks, or decks.",
    unitOptions: ["5gal", "55gal"],
  },
  {
    key: "Intumescent",
    label: "Intumescent Coating (Thermal Barrier)",
    category: "Coatings & Sealants",
    description: "Expands under heat to provide a fire-resistant barrier for foam insulation.",
    unitOptions: ["5gal", "55gal"],
  },
  {
    key: "IgnitionBarrier",
    label: "Ignition Barrier Paint",
    category: "Coatings & Sealants",
    description: "Fire-retardant coating for exposed spray foam in attics or crawlspaces.",
    unitOptions: ["5gal", "55gal"],
  },
  {
    key: "Sealant",
    label: "Sealant / Caulk",
    category: "Coatings & Sealants",
    description: "Used for air sealing joints and penetrations.",
    unitOptions: ["tube", "case"],
  },

  // --- PRIMERS & ADHESIVES ---
  {
    key: "Primer",
    label: "Universal Primer",
    category: "Primers & Adhesives",
    description: "General-purpose adhesion promoter for foam or coatings on metal, concrete, or wood.",
    unitOptions: ["gal", "5gal"],
  },
  {
    key: "EpoxyPrimer",
    label: "Epoxy Primer",
    category: "Primers & Adhesives",
    description: "High-performance corrosion-resistant primer for metal or concrete substrates.",
    unitOptions: ["gal", "5gal"],
  },
  {
    key: "Adhesive",
    label: "Foam Board Adhesive",
    category: "Primers & Adhesives",
    description: "Polyurethane or construction adhesive for rigid foam attachment.",
    unitOptions: ["tube", "case"],
  },
  {
    key: "ContactAdhesive",
    label: "Contact Adhesive / Tack",
    category: "Primers & Adhesives",
    description: "Used to bond spray foam to certain substrates or between layers.",
    unitOptions: ["can", "case"],
  },

  // --- SURFACE PREP & CLEANERS ---
  {
    key: "GunCleaner",
    label: "Gun Cleaner / Solvent",
    category: "Surface Prep & Cleaners",
    description: "Used to flush and clean spray guns, hoses, and proportioner systems.",
    unitOptions: ["can", "5gal"],
  },
  {
    key: "Solvent",
    label: "Surface Solvent / Degreaser",
    category: "Surface Prep & Cleaners",
    description: "Removes oils and contaminants before spraying or coating.",
    unitOptions: ["gal", "5gal"],
  },
  {
    key: "AlcoholWipe",
    label: "Alcohol Surface Wipes",
    category: "Surface Prep & Cleaners",
    description: "Surface preparation wipes for small jobs or touch-ups.",
    unitOptions: ["pack", "case"],
  },

  // --- ACCESSORIES & TAPES ---
  {
    key: "Tape",
    label: "Seam Tape",
    category: "Accessories & Tapes",
    description: "Used for vapor barrier seams and joints.",
    unitOptions: ["roll", "box"],
  },
  {
    key: "Fasteners",
    label: "Insulation Fasteners",
    category: "Accessories & Tapes",
    description: "Anchors, washers, or screws for mechanical attachment of insulation boards.",
    unitOptions: ["box", "case"],
  },
  {
    key: "Mesh",
    label: "Reinforcing Mesh",
    category: "Accessories & Tapes",
    description: "Fiberglass or nylon mesh used in coating systems.",
    unitOptions: ["roll"],
  },
  {
    key: "VaporBarrier",
    label: "Vapor Barrier / Plastic Sheeting",
    category: "Accessories & Tapes",
    description: "Used under slabs or walls to prevent vapor transmission.",
    unitOptions: ["roll"],
  },
  {
    key: "FoamGun",
    label: "Foam Gun / Applicator",
    category: "Accessories & Tapes",
    description: "For can foam and sealant applications.",
    unitOptions: ["ea"],
  },

  // --- PPE ---
  {
    key: "Respirator",
    label: "Respirator Cartridges",
    category: "PPE",
    description: "Filters for organic vapors and particulates.",
    unitOptions: ["pair", "box"],
  },
  {
    key: "Coveralls",
    label: "Disposable Coveralls",
    category: "PPE",
    description: "Protective clothing for spray foam applicators.",
    unitOptions: ["each", "case"],
  },
  {
    key: "Gloves",
    label: "Chemical-Resistant Gloves",
    category: "PPE",
    description: "Protects hands from isocyanates and solvents.",
    unitOptions: ["pair", "box"],
  },
  {
    key: "BootCovers",
    label: "Boot Covers",
    category: "PPE",
    description: "Protects shoes and legs from overspray.",
    unitOptions: ["pair", "case"],
  },
  {
    key: "EyeProtection",
    label: "Eye Protection / Goggles",
    category: "PPE",
    description: "Safety glasses or goggles for spray work.",
    unitOptions: ["each", "case"],
  },

  // --- EQUIPMENT & CONSUMABLES ---
  {
    key: "Hose",
    label: "Heated Hose Assembly",
    category: "Equipment & Consumables",
    description: "For spray foam proportioner systems.",
    unitOptions: ["ea"],
  },
  {
    key: "GunParts",
    label: "Spray Gun Parts",
    category: "Equipment & Consumables",
    description: "O-rings, mix chambers, side seals, and repair kits.",
    unitOptions: ["set", "kit"],
  },
  {
    key: "Filters",
    label: "Inline Filters",
    category: "Equipment & Consumables",
    description: "Material or air filters for guns or proportioners.",
    unitOptions: ["each", "box"],
  },
  {
    key: "Lubricant",
    label: "Gun Lubricant / Grease",
    category: "Equipment & Consumables",
    description: "Lubricant used for gun maintenance.",
    unitOptions: ["tube", "bottle"],
  },

  // --- MISC / GENERAL BUILDING MATERIALS ---
  {
    key: "Drywall",
    label: "Drywall / Sheetrock",
    category: "Building Materials",
    description: "Wall substrate for interior builds.",
    unitOptions: ["sheet"],
  },
  {
    key: "Plywood",
    label: "Plywood / OSB Panels",
    category: "Building Materials",
    description: "Sheathing for walls, ceilings, and roofs.",
    unitOptions: ["sheet"],
  },
  {
    key: "FoamBoard",
    label: "Rigid Foam Board",
    category: "Building Materials",
    description: "Polyiso or EPS boards used for insulation.",
    unitOptions: ["sheet"],
  },
  {
    key: "SealantTape",
    label: "Sealant Tape",
    category: "Building Materials",
    description: "Used for sealing penetrations and edges.",
    unitOptions: ["roll"],
  },
];
