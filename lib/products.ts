export type SizeId = "small-medium" | "large";
export type ColourId = "clay" | "moss" | "sandstone";
export type AddOnId = "scent-pod";

export const FREE_DELIVERY_THRESHOLD = 4999;

export interface SizeOption {
  id: SizeId;
  label: string;
  shortLabel: string;
  price: number;
  weightRange: string;
  dimensions: string;
  hopperCapacity: string;
  puzzleZones: number;
  sessionsPerDay: string;
  kibbleSize: string;
}

export interface ColourOption {
  id: ColourId;
  label: string;
  swatch: string;
  edge: string;
  description: string;
}

export interface AddOnOption {
  id: AddOnId;
  label: string;
  price: number;
  description: string;
}

export const SIZES: SizeOption[] = [
  {
    id: "small-medium",
    label: "Small / Medium dogs",
    shortLabel: "Small / Medium",
    price: 4999,
    weightRange: "5–25 kg (small breeds too)",
    dimensions: "28 × 28 × 22 cm",
    hopperCapacity: "3 kg of kibble",
    puzzleZones: 4,
    sessionsPerDay: "up to 6",
    kibbleSize: "up to 15 mm",
  },
  {
    id: "large",
    label: "Large dogs",
    shortLabel: "Large",
    price: 5999,
    weightRange: "25 kg and up",
    dimensions: "34 × 34 × 28 cm",
    hopperCapacity: "5 kg of kibble",
    puzzleZones: 6,
    sessionsPerDay: "up to 6",
    kibbleSize: "up to 20 mm",
  },
];

export const COLOURS: ColourOption[] = [
  {
    id: "clay",
    label: "Clay",
    swatch: "#c96f4a",
    edge: "#a8532f",
    description: "Warm burnt orange",
  },
  {
    id: "moss",
    label: "Moss",
    swatch: "#6b7f59",
    edge: "#556845",
    description: "Calm sage green",
  },
  {
    id: "sandstone",
    label: "Sandstone",
    swatch: "#d9c7a7",
    edge: "#b8a382",
    description: "Soft desert beige",
  },
];

export const ADD_ONS: AddOnOption[] = [
  {
    id: "scent-pod",
    label: "Scent Pod",
    price: 499,
    description:
      "A swap-in pod that sits under the tray and holds a treat or a drop of your dog-friendly scent. It pulls your dog back to the puzzle between sessions — especially useful in the first week.",
  },
];

export const SCENT_POD_PRICE = ADD_ONS[0].price;

export const MAX_FREE_DELIVERY_NOTE = "Free delivery included · Pay on delivery";

export function getSize(id: SizeId): SizeOption {
  return SIZES.find((s) => s.id === id) ?? SIZES[0];
}

export function getColour(id: ColourId): ColourOption {
  return COLOURS.find((c) => c.id === id) ?? COLOURS[0];
}

export function getAddOn(id: AddOnId): AddOnOption {
  return ADD_ONS.find((a) => a.id === id) ?? ADD_ONS[0];
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
