export type SubscriptionPlanName = "Essential" | "Plus" | "Premium";
export type PetSpecies = "dog" | "cat";
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
