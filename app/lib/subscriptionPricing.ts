export type SubscriptionPlanName = "Essential" | "Plus" | "Premium";
export type PetSpecies = "dog" | "cat";
export type PetActivityLevel = "calm" | "normal" | "active";
export type PetBodyGoal = "maintain" | "lose" | "gain";
export type PetNeuterStatus = "intact" | "neutered";
export type FormulaGoalKey =
  | "skin_coat"
  | "immunity"
  | "digestion"
  | "weight"
  | "senior"
  | "sensitive";

const MARKET_RATE_PER_KG: Record<PetSpecies, number> = {
  dog: 380,
  cat: 390,
};

const TIER_MULTIPLIER: Record<SubscriptionPlanName, number> = {
  Essential: 1,
  Plus: 1.28,
  Premium: 1.62,
};

const FORMULA_MULTIPLIER: Record<FormulaGoalKey, number> = {
  skin_coat: 1.08,
  immunity: 1.06,
  digestion: 1.12,
  weight: 1.04,
  senior: 1.16,
  sensitive: 1.22,
};

export const MONTHLY_DELIVERY_DAYS = 30;
const PACKING_AND_DELIVERY = 160;
const KCAL_PER_GRAM: Record<PetSpecies, number> = {
  dog: 3.6,
  cat: 3.6,
};

const SPECIES_MAINTENANCE_FACTOR: Record<PetSpecies, number> = {
  dog: 1.6,
  cat: 1.2,
};

const ACTIVITY_MULTIPLIER: Record<PetActivityLevel, number> = {
  calm: 0.9,
  normal: 1,
  active: 1.2,
};

const BODY_GOAL_MULTIPLIER: Record<PetBodyGoal, number> = {
  maintain: 1,
  lose: 0.8,
  gain: 1.2,
};

const NEUTERED_MULTIPLIER: Record<PetSpecies, Record<PetNeuterStatus, number>> = {
  dog: { intact: 1, neutered: 0.85 },
  cat: { intact: 1, neutered: 0.8 },
};

export const PET_WEIGHT_PRESETS = {
  dog: [
    { label: "เล็ก", detail: "ประมาณ 5 kg", weightKg: 5 },
    { label: "กลาง", detail: "ประมาณ 15 kg", weightKg: 15 },
    { label: "ใหญ่", detail: "ประมาณ 30 kg", weightKg: 30 },
  ],
  cat: [
    { label: "เล็ก", detail: "ประมาณ 3 kg", weightKg: 3 },
    { label: "มาตรฐาน", detail: "ประมาณ 4.5 kg", weightKg: 4.5 },
    { label: "ตัวใหญ่", detail: "ประมาณ 6 kg", weightKg: 6 },
  ],
} as const satisfies Record<PetSpecies, ReadonlyArray<{
  label: string;
  detail: string;
  weightKg: number;
}>>;

export const PET_ACTIVITY_OPTIONS = [
  { key: "calm", label: "น้อย", detail: "นอนเป็นหลัก" },
  { key: "normal", label: "ปกติ", detail: "เดินเล่นทุกวัน" },
  { key: "active", label: "แอคทีฟมาก", detail: "ใช้พลังงานเยอะ" },
] as const satisfies ReadonlyArray<{
  key: PetActivityLevel;
  label: string;
  detail: string;
}>;

export const PET_BODY_GOAL_OPTIONS = [
  { key: "maintain", label: "คงน้ำหนัก", detail: "กินตามพลังงานที่ใช้" },
  { key: "lose", label: "ลดน้ำหนัก", detail: "ลดแคลอรี" },
  { key: "gain", label: "เพิ่มน้ำหนัก", detail: "เพิ่มพลังงาน" },
] as const satisfies ReadonlyArray<{
  key: PetBodyGoal;
  label: string;
  detail: string;
}>;

export const PET_NEUTER_OPTIONS = [
  { key: "intact", label: "ยังไม่ทำหมัน" },
  { key: "neutered", label: "ทำหมันแล้ว" },
] as const satisfies ReadonlyArray<{
  key: PetNeuterStatus;
  label: string;
}>;

export const SUBSCRIPTION_TIERS = [
  {
    name: "Essential",
    audience: "ดูแลประจำวัน",
    detail: "อาหารเกรดมาตรฐาน คุมงบง่ายสำหรับรอบรายเดือน",
    price: 1190,
    days: MONTHLY_DELIVERY_DAYS,
    value: "คุ้มค่า",
    features: ["รอบส่ง 1 เดือน", "สูตรพื้นฐานครบ", "เหมาะกับน้องสุขภาพทั่วไป"],
    badge: undefined,
    image: "/images/paw-lite1.webp",
    accent: "#f28b5b",
    tint: "#fff2e9",
    imageTint: "#ffe3d2",
  },
  {
    name: "Plus",
    audience: "แนะนำสำหรับส่วนใหญ่",
    detail: "วัตถุดิบดีขึ้น โปรตีนและสารบำรุงเหมาะกับการดูแลจริงจัง",
    price: 1590,
    days: MONTHLY_DELIVERY_DAYS,
    value: "สมดุลที่สุด",
    features: ["รอบส่ง 1 เดือน", "วัตถุดิบเกรดดีขึ้น", "เลือกสูตรดูแลได้"],
    badge: "แนะนำ",
    image: "/images/paw-fit1.webp",
    accent: "#64a77b",
    tint: "#eef8f0",
    imageTint: "#dff1e4",
  },
  {
    name: "Premium",
    audience: "ดูแลเฉพาะทาง",
    detail: "เกรดสูงสำหรับน้องแพ้ง่าย สุขภาพเฉพาะ หรือเจ้าของที่อยากเน้นคุณภาพ",
    price: 2190,
    days: MONTHLY_DELIVERY_DAYS,
    value: "เข้มข้น",
    features: ["รอบส่ง 1 เดือน", "สูตรเฉพาะทาง", "วัตถุดิบและสารบำรุงสูง"],
    badge: "เกรดสูง",
    image: "/images/paw-max1.webp",
    accent: "#7774b9",
    tint: "#f2f1fb",
    imageTint: "#e5e3f7",
  },
] as const satisfies ReadonlyArray<{
  name: SubscriptionPlanName;
  audience: string;
  detail: string;
  price: number;
  days: number;
  value: string;
  features: string[];
  badge?: string;
  image: string;
  accent: string;
  tint: string;
  imageTint: string;
}>;

export const FORMULA_GOALS = [
  { key: "skin_coat", title: "บำรุงขน", detail: "ดูแลผิวและเส้นขนให้เงางาม", formulaLabel: "สูตรบำรุงผิวหนังและเส้นขน", image: "/images/skin.webp" },
  { key: "immunity", title: "เสริมภูมิ", detail: "เสริมสมดุลร่างกายและภูมิคุ้มกัน", formulaLabel: "สูตรเสริมภูมิคุ้มกัน", image: "/images/balance.webp" },
  { key: "digestion", title: "ระบบย่อย", detail: "ย่อยง่าย ดูแลลำไส้และการขับถ่าย", formulaLabel: "สูตรย่อยง่ายและดูแลลำไส้", image: "/images/food1.webp" },
  { key: "weight", title: "คุมน้ำหนัก", detail: "คุมพลังงานและรูปร่างให้เหมาะสม", formulaLabel: "สูตรควบคุมน้ำหนัก", image: "/images/diet1.webp" },
  { key: "senior", title: "สูงวัย", detail: "ดูแลน้องวัยโต-สูงวัยแบบสมดุล", formulaLabel: "สูตรดูแลน้องสูงวัย", image: "/images/age.webp" },
  { key: "sensitive", title: "แพ้ง่าย", detail: "คัดวัตถุดิบสำหรับน้องไวต่ออาหาร", formulaLabel: "สูตรสำหรับน้องแพ้ง่าย", image: "/images/allergy.webp" },
] as const satisfies ReadonlyArray<{
  key: FormulaGoalKey;
  title: string;
  detail: string;
  formulaLabel: string;
  image: string;
}>;

export function calculateSubscriptionPrice({
  plan,
  species,
  gramsPerRound,
  formula = "skin_coat",
}: {
  plan: SubscriptionPlanName;
  species: PetSpecies;
  gramsPerRound: number;
  formula?: FormulaGoalKey;
}) {
  const kilograms = gramsPerRound / 1000;
  const foodPrice = kilograms * MARKET_RATE_PER_KG[species] * TIER_MULTIPLIER[plan] * FORMULA_MULTIPLIER[formula];
  const total = foodPrice + PACKING_AND_DELIVERY;

  return Math.max(290, Math.ceil(total / 10) * 10);
}

export function getPetLifeStage(species: PetSpecies, ageYears: number | null) {
  if (!ageYears || ageYears <= 0) return { factor: SPECIES_MAINTENANCE_FACTOR[species], label: "วัยโต" };

  if (species === "dog") {
    if (ageYears < 4 / 12) return { factor: 3, label: "ลูกสุนัข < 4 เดือน" };
    if (ageYears < 1) return { factor: 2, label: "ลูกสุนัขกำลังโต" };
    if (ageYears >= 7) return { factor: 1.4, label: "วัยชรา" };
  }

  if (species === "cat") {
    if (ageYears < 1) return { factor: 2.5, label: "ลูกแมวกำลังโต" };
    if (ageYears >= 10) return { factor: 1.1, label: "วัยชรา" };
  }

  return { factor: SPECIES_MAINTENANCE_FACTOR[species], label: "วัยโต" };
}

export function calculateNutritionPlan({
  species,
  weightKg,
  ageYears = null,
  activity = "normal",
  bodyGoal = "maintain",
  neutered = "intact",
}: {
  species: PetSpecies;
  weightKg: number;
  ageYears?: number | null;
  activity?: PetActivityLevel;
  bodyGoal?: PetBodyGoal;
  neutered?: PetNeuterStatus;
}) {
  const safeWeight = Math.max(1, weightKg);
  const restingEnergy = 70 * Math.pow(safeWeight, 0.75);
  const lifeStage = getPetLifeStage(species, ageYears);
  const dailyKcal = Math.max(80, Math.round(
    restingEnergy *
    lifeStage.factor *
    ACTIVITY_MULTIPLIER[activity] *
    BODY_GOAL_MULTIPLIER[bodyGoal] *
    NEUTERED_MULTIPLIER[species][neutered],
  ));
  const dailyGrams = Math.max(25, Math.round((dailyKcal / KCAL_PER_GRAM[species]) / 5) * 5);
  const monthlyGrams = dailyGrams * MONTHLY_DELIVERY_DAYS;
  const recommendedPlan: SubscriptionPlanName = bodyGoal === "lose"
    ? "Plus"
    : monthlyGrams < 3000
      ? "Essential"
      : monthlyGrams >= 12000
        ? "Premium"
        : "Plus";

  return { dailyKcal, dailyGrams, monthlyGrams, lifeStage, recommendedPlan };
}

export function calculateDailyFoodGrams({
  species,
  weightKg,
  ageYears = null,
  activity = "normal",
  bodyGoal = "maintain",
  neutered = "intact",
}: {
  species: PetSpecies;
  weightKg: number;
  ageYears?: number | null;
  activity?: PetActivityLevel;
  bodyGoal?: PetBodyGoal;
  neutered?: PetNeuterStatus;
}) {
  return calculateNutritionPlan({ species, weightKg, ageYears, activity, bodyGoal, neutered }).dailyGrams;
}
