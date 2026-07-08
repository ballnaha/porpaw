export type SubscriptionPlanName = "Paw-Lite" | "Paw-Fit" | "Paw-Max";
export type PetSpecies = "dog" | "cat";

const MARKET_RATE_PER_KG: Record<PetSpecies, number> = {
  dog: 380,
  cat: 390,
};

const PLAN_DISCOUNT: Record<SubscriptionPlanName, number> = {
  "Paw-Lite": 0,
  "Paw-Fit": 0.05,
  "Paw-Max": 0.1,
};

const PACKING_AND_DELIVERY = 130;

export function calculateSubscriptionPrice({
  plan,
  species,
  gramsPerRound,
  formulaMultiplier = 1,
}: {
  plan: SubscriptionPlanName;
  species: PetSpecies;
  gramsPerRound: number;
  formulaMultiplier?: number;
}) {
  const kilograms = gramsPerRound / 1000;
  const foodPrice = kilograms * MARKET_RATE_PER_KG[species] * formulaMultiplier;
  const discountedFoodPrice = foodPrice * (1 - PLAN_DISCOUNT[plan]);
  const total = discountedFoodPrice + PACKING_AND_DELIVERY;

  return Math.max(290, Math.ceil(total / 10) * 10);
}

