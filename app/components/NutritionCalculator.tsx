"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  InputBase,
  Button,
} from "@mui/material";
import { PawPrint, ChevronDown, Minus, Plus } from "lucide-react";
import { DS } from "./DesignSystem";

type Species = "dog" | "cat";

const ACTIVITY = [
  { value: "low", label: "น้อย (นอนเป็นหลัก)", factor: 0.9 },
  { value: "normal", label: "ปกติ", factor: 1.0 },
  { value: "high", label: "แอคทีฟมาก", factor: 1.2 },
];

const GOALS = [
  { value: "maintain", label: "คงน้ำหนัก", factor: 1.0 },
  { value: "lose", label: "ลดน้ำหนัก", factor: 0.8 },
  { value: "gain", label: "เพิ่มน้ำหนัก", factor: 1.2 },
];

// Species-specific maintenance-energy multiplier (applied to RER)
const SPECIES_FACTOR: Record<Species, number> = { dog: 1.6, cat: 1.2 };
// Average energy density of dry food (kcal per gram)
const KCAL_PER_GRAM = 3.6;

const NEUTERED_FACTORS: Record<Species, Record<string, number>> = {
  dog: { intact: 1.0, neutered: 0.85 },
  cat: { intact: 1.0, neutered: 0.80 },
};

const MACRO_GRADIENTS: Record<string, { start: string; end: string }> = {
  protein: { start: "#E27A4D", end: "#FFA07A" },
  fat: { start: "#D99A2B", end: "#FAD375" },
  carb: { start: "#2E9B68", end: "#6EE7B7" },
  fiber: { start: "#8A72BE", end: "#CBB2D6" },
  vitamin: { start: "#D96A6A", end: "#FFA4A4" },
};

const getLifeStage = (species: Species, age: number | null) => {
  if (!age || age <= 0) {
    return { factor: SPECIES_FACTOR[species], label: "วัยโต (ค่าเริ่มต้น)" };
  }

  if (species === "dog") {
    if (age < 4 / 12) return { factor: 3, label: "ลูกสุนัข < 4 เดือน" };
    if (age < 1) return { factor: 2, label: "ลูกสุนัขกำลังโต" };
    if (age >= 7) return { factor: 1.4, label: "วัยชรา (7 ปีขึ้นไป)" };
  }

  if (species === "cat") {
    if (age < 1) return { factor: 2.5, label: "ลูกแมวกำลังโต" };
    if (age >= 10) return { factor: 1.1, label: "วัยชรา (10 ปีขึ้นไป)" };
  }

  return { factor: SPECIES_FACTOR[species], label: "วัยโต" };
};

// Recommended nutrient split (% of daily intake). Fixed categorical order —
// each nutrient keeps its own colour across species (colour follows the entity).
interface Macro {
  key: string;
  label: string;
  pct: number;
  color: string;
}
const MACROS: Record<Species, Macro[]> = {
  dog: [
    { key: "protein", label: "โปรตีน", pct: 25, color: "#E27A4D" },
    { key: "fat", label: "ไขมัน", pct: 15, color: "#D99A2B" },
    { key: "carb", label: "คาร์โบไฮเดรต", pct: 45, color: "#2E9B68" },
    { key: "fiber", label: "ไฟเบอร์", pct: 5, color: "#8A72BE" },
    { key: "vitamin", label: "วิตามิน & แร่ธาตุ", pct: 10, color: "#D96A6A" },
  ],
  cat: [
    { key: "protein", label: "โปรตีน", pct: 40, color: "#E27A4D" },
    { key: "fat", label: "ไขมัน", pct: 20, color: "#D99A2B" },
    { key: "carb", label: "คาร์โบไฮเดรต", pct: 28, color: "#2E9B68" },
    { key: "fiber", label: "ไฟเบอร์", pct: 3, color: "#8A72BE" },
    { key: "vitamin", label: "วิตามิน & แร่ธาตุ", pct: 9, color: "#D96A6A" },
  ],
};

const fieldBase = {
  bgcolor: DS.white,
  border: `1px solid ${DS.line}`,
  borderRadius: "14px",
  px: 2,
  height: 44,
  fontSize: 14,
  fontWeight: 500,
  color: DS.ink,
  width: "100%",
  transition: "border-color .2s, box-shadow .2s",
  "&:hover": { borderColor: DS.peach },
  "&.Mui-focused, &:focus-within": {
    borderColor: DS.peach,
    boxShadow: `0 0 0 3px ${DS.peachSoft}`,
  },
} as const;

const labelSx = {
  fontSize: 13,
  fontWeight: 500,
  color: DS.gray,
  mb: 0.85,
  display: "block",
} as const;

interface StepperProps {
  value: string;
  onChange: (v: string) => void;
  unit: string;
  step: number;
  min?: number;
  max: number;
  ariaLabel: string;
}

const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  unit,
  step,
  min = 0,
  max,
  ariaLabel,
}) => {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const num = parseFloat(value) || 0;
  const setNum = (n: number) => {
    const c = clamp(n);
    onChange(Number.isInteger(c) ? String(c) : c.toFixed(1));
  };

  const btnSx = {
    width: 30,
    height: 30,
    borderRadius: "10px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    color: DS.peach,
    bgcolor: DS.peachSoft,
    transition: "background-color .2s, transform .1s",
    "&:hover": { bgcolor: DS.peach, color: DS.white },
    "&:active": { transform: "scale(.92)" },
    "&:focus-visible": { outline: `2px solid ${DS.peach}`, outlineOffset: 2 },
  } as const;

  return (
    <Box
      sx={{
        ...fieldBase,
        px: 0.75,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 0.5,
      }}
    >
      <Box
        role="button"
        tabIndex={0}
        aria-label={`ลด${ariaLabel}`}
        onClick={() => setNum(num - step)}
        onKeyDown={(e) => e.key === "Enter" && setNum(num - step)}
        sx={btnSx}
      >
        <Minus size={16} strokeWidth={2.5} />
      </Box>

      <InputBase
        value={value}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.]/g, "");
          onChange(raw);
        }}
        onBlur={() => value !== "" && setNum(parseFloat(value) || 0)}
        inputProps={{
          inputMode: "decimal",
          "aria-label": ariaLabel,
          style: { textAlign: "center", padding: 0, fontWeight: 600 },
        }}
        placeholder="0"
        endAdornment={
          <Box component="span" sx={{ fontSize: 13, color: DS.gray, fontWeight: 500, ml: 0.5 }}>
            {unit}
          </Box>
        }
        sx={{ flex: 1, fontSize: 16, color: DS.ink }}
      />

      <Box
        role="button"
        tabIndex={0}
        aria-label={`เพิ่ม${ariaLabel}`}
        onClick={() => setNum(num + step)}
        onKeyDown={(e) => e.key === "Enter" && setNum(num + step)}
        sx={btnSx}
      >
        <Plus size={16} strokeWidth={2.5} />
      </Box>
    </Box>
  );
};

interface BrandRecommendation {
  brand: string;
  formula: string;
  badge: string;
  pros: string[];
  whyItFits: string;
  buttonText: string;
}

const RECOMMENDED_BRANDS: Record<Species, Record<string, BrandRecommendation[]>> = {
  dog: {
    skin_coat: [
      {
        brand: "Orijen",
        formula: "Six Fish Dog",
        badge: "ฟื้นฟูเร่งด่วน",
        pros: ["โปรตีนสูง 38% จากปลาทะเล 6 ชนิด", "อุดมไปด้วย Omega-3/6 เข้มข้น", "ปราศจากธัญพืชและสารกันเสีย"],
        whyItFits: "โอเมก้าจากปลาช่วยลดการอักเสบของผิวหนังและกระตุ้นการสร้างรากขนใหม่ให้หนานุ่มภายใน 4 สัปดาห์",
        buttonText: "จัดกล่องสูตรบำรุงขนสุนัข"
      },
      {
        brand: "Hill's Science Diet",
        formula: "Sensitive Stomach & Skin",
        badge: "ผิวบางแพ้ง่าย",
        pros: ["มีพรีไบโอติกไฟเบอร์ช่วยปรับสมดุลลำไส้", "วิตามินอีและโอเมก้า 6 บำรุงผิวลึก", "สูตรย่อยง่ายพิเศษลดกลิ่นอึ"],
        whyItFits: "บำรุงลึกถึงระดับเซลล์ผิวหนัง เหมาะสำหรับสุนัขที่ผิวระคายเคืองง่ายและมีระบบย่อยอาหารที่อ่อนแอ",
        buttonText: "จัดกล่องสูตรผิวบางสุนัข"
      }
    ],
    hypoallergenic: [
      {
        brand: "Royal Canin",
        formula: "Hypoallergenic Dog",
        badge: "สัตวแพทย์แนะนำ",
        pros: ["โปรตีนถั่วเหลืองสกัดแบบไฮโดรไลซ์โมเลกุลเล็ก", "เสริมความแข็งแรงของชั้นผิวหนังป้องกันน้ำระเหย", "มี EPA & DHA ลดการอักเสบระบบผิวหนัง"],
        whyItFits: "การย่อยโปรตีนให้โมเลกุลเล็กมากช่วยป้องกันระบบภูมิคุ้มกันจับสัญญาณการแพ้ได้ เหมาะสำหรับการแพ้อาหารรุนแรง",
        buttonText: "จัดกล่องสูตรแพ้อาหารสุนัข"
      },
      {
        brand: "Taste of the Wild",
        formula: "Pine Forest (Venison & Legumes)",
        badge: "โปรตีนทางเลือกเดี่ยว",
        pros: ["ใช้เนื้อกวางเป็นแหล่งโปรตีนเดี่ยวรสชาติแปลกใหม่", "ปราศจากถัญพืช ข้าวโพด และถั่วเหลือง", "เสริมจุลินทรีย์ K9 Strain Probiotics"],
        whyItFits: "หลีกเลี่ยงส่วนผสมที่ทำให้แพ้ซ้ำๆ ด้วยโปรตีนเนื้อกวางธรรมชาติ ย่อยง่ายและให้สารอาหารสมบูรณ์",
        buttonText: "จัดกล่องสูตรโปรตีนเดี่ยวสุนัข"
      }
    ],
    weight_joint: [
      {
        brand: "Royal Canin",
        formula: "Satiety Support Dog",
        badge: "ควบคุมแคลอรี",
        pros: ["โปรตีนสูงช่วยคงมวลกล้ามเนื้อ", "ไฟเบอร์สูงมากช่วยให้อิ่มท้องได้ยาวนาน", "เสริมกลูโคซามีนและคอนดรอยตินบำรุงข้อต่อ"],
        whyItFits: "ช่วยลดน้ำหนักอย่างถูกวิธีพร้อมทั้งบำรุงข้อต่อที่ต้องรองรับน้ำหนักตัวที่มากเป็นพิเศษ",
        buttonText: "จัดกล่องคุมน้ำหนักสุนัข"
      },
      {
        brand: "Acana",
        formula: "Light & Fit Dog",
        badge: "สูตรธรรมชาติคาร์บต่ำ",
        pros: ["โปรตีน 65% จากไก่เลี้ยงอิสระและไข่สด", "ปราศจากคาร์โบไฮเดรตที่ย่อยเร็ว (ขัดสี)", "เสริมแอล-คาร์นิทีนเพื่อเร่งการเผาผลาญ"],
        whyItFits: "เน้นการฟิตแอนด์เฟิร์มกล้ามเนื้อด้วยอาหารแคลอรีต่ำและจำกัดไขมัน เหมาะกับสุนัขที่น้ำหนักเกินเล็กน้อย",
        buttonText: "จัดกล่องสุนัขทำหมัน/คุมน้ำหนัก"
      }
    ],
    digestion: [
      {
        brand: "Royal Canin",
        formula: "Gastrointestinal Dog",
        badge: "ฟื้นฟูลำไส้",
        pros: ["พลังงานหนาแน่นสูง ช่วยลดปริมาณอาหารที่ต้องกิน", "ย่อยง่ายเป็นพิเศษเพื่อลดภาระกระเพาะอาหาร", "มีพรีไบโอติก FOS/MOS ปรับสมดุลลำไส้"],
        whyItFits: "ออกแบบมาเพื่อสุนัขที่ท้องเสียง่าย ลำไส้อักเสบ หรือดูดซึมสารอาหารได้ยาก ให้ฟื้นฟูร่างกายอย่างรวดเร็ว",
        buttonText: "จัดกล่องสูตรลำไส้สุนัข"
      },
      {
        brand: "Pro Plan",
        formula: "Sensitive Skin & Stomach Salmon",
        badge: "สูตรย่อยง่ายไร้สัตว์ปีก",
        pros: ["แซลมอนแท้เป็นส่วนผสมอันดับ 1", "ใช้ข้าวโอ๊ตและบาร์เลย์อ่อนโยนต่อทางเดินอาหาร", "เสริมสารต้านอนุมูลอิสระเพื่อภูมิคุ้มกัน"],
        whyItFits: "บำรุงทั้งผิวหนังและระบบย่อยอาหารไปพร้อมๆ กัน ย่อยง่าย สบายท้อง ลดกลิ่นและปริมาณอุจจาระ",
        buttonText: "จัดกล่องสูตรย่อยง่ายสุนัข"
      }
    ]
  },
  cat: {
    skin_coat: [
      {
        brand: "Orijen",
        formula: "Fit & Trim Cat",
        badge: "ขนสวยหุ่นฟิต",
        pros: ["โปรตีนสูง 44% จากเนื้อสัตว์สดใหม่หลากหลาย", "บำรุงผิวหนังและเส้นขนด้วยน้ำมันปลาธรรมชาติ", "แร่ธาตุสมดุลป้องกันปัญหานิ่วทางเดินปัสสาวะ"],
        whyItFits: "ช่วยเสริมสร้างรากขนให้ยึดเกาะผิวหนังได้ดีขึ้น ลดการขาดหลุดร่วง และทำให้ขนดูฟูเงางามอย่างมีสุขภาพดี",
        buttonText: "จัดกล่องสูตรบำรุงขนแมว"
      },
      {
        brand: "Canagan",
        formula: "Scottish Salmon",
        badge: "ปราศจากธัญพืช 100%",
        pros: ["เนื้อปลาแซลมอนแก้าก้างสด 31% บำรุงลึก", "มีแครนเบอร์รี่ช่วยบำรุงสุขภาพระบบปัสสาวะ", "ไม่มีสารสังเคราะห์หรือแต่งกลิ่นสี"],
        whyItFits: "อุดมด้วยโอเมก้า 3 คอลลาเจนธรรมชาติ และสารอาหารจำเป็นในการสร้างเนื้อเส้นขนแมวให้นุ่มลื่นลดขนพันกัน",
        buttonText: "จัดกล่องแซลมอนแมวขนสวย"
      }
    ],
    hypoallergenic: [
      {
        brand: "Royal Canin",
        formula: "Anallergenic Cat",
        badge: "สัตวแพทย์แนะนำสูงสุด",
        pros: ["ใช้โปรตีนโอลิโกเปปไทด์ขนาดเล็กระดับกรดอะมิโน", "ผลิตในโรงงานปลอดการปนเปื้อนสารแพ้อื่น 100%", "เสริมเซราไมด์ช่วยเพิ่มเกราะป้องกันผิวหนัง"],
        whyItFits: "ขจัดสารก่อภูมิแพ้ออกจากโปรตีนอย่างสิ้นเชิง เหมาะอย่างยิ่งกับแมวที่แพ้อาหารหนักจนผิวหนังอักเสบหรือเกาตลอดเวลา",
        buttonText: "จัดกล่องสูตรแมวแพ้รุนแรง"
      },
      {
        brand: "Taste of the Wild",
        formula: "Rocky Mountain Feline",
        badge: "โปรตีนทางเลือกธรรมชาติ",
        pros: ["โปรตีนจากเนื้อไก่อบและปลาแซลมอนรมควัน", "ปราศจากกลูเตน ข้าวโพด ข้าวสาลีที่เป็นตัวกระตุ้นคัน", "ผลไม้ตระกูลเบอร์รี่ต้านอนุมูลอิสระ"],
        whyItFits: "สูตรปราศจากธัญพืชที่เลียนแบบธรรมชาติ ช่วยเลี่ยงอาการแพ้กลูเตนพร้อมรักษาระดับพลังงานให้สมดุล",
        buttonText: "จัดกล่องสูตรแพ้ง่ายแมว"
      }
    ],
    weight_joint: [
      {
        brand: "Hill's Science Diet",
        formula: "Light Adult Cat",
        badge: "คุมแคลอรีเฉพาะทาง",
        pros: ["มีแคลอรีน้อยลง 21% เมื่อเทียบกับสูตรรุ่นปกติ", "แอล-คาร์นิทีน ช่วยกระตุ้นการเผาผลาญไขมันสะสม", "ไฟเบอร์ธรรมชาติลดพฤติกรรมร้องขออาหารระว่างมื้อ"],
        whyItFits: "จำกัดแคลอรีที่ได้รับในแต่ละวันให้สมดุลกับพลังงานที่ใช้ เหมาะมากกับแมวทำหมันหรือแมวที่ชอบนอนกลางวัน",
        buttonText: "จัดกล่องคุมน้ำหนักแมว"
      },
      {
        brand: "Royal Canin",
        formula: "Hairball Care Cat",
        badge: "ลดก้อนขนสะสม",
        pros: ["มีใยอาหารเฉพาะทางช่วยนำทางเส้นขนออกสู่อึ", "กระตุ้นการเคลื่อนไหวของลำไส้ลดอาการท้องผูก", "ควบคุมแร่ธาตุป้องกันการเกิดโรคนิ่วแมว"],
        whyItFits: "บำรุงระบบย่อยอาหารเพื่อช่วยให้แมวสามารถขับก้อนขนออกทางอุจจาระตามธรรมชาติแทนการขย้อนบ่อยๆ",
        buttonText: "จัดกล่องคุมน้ำหนักลดก้อนขน"
      }
    ],
    digestion: [
      {
        brand: "Royal Canin",
        formula: "Gastrointestinal Cat",
        badge: "ย่อยและดูดซึมง่าย",
        pros: ["สารอาหารย่อยง่ายพิเศษ ลดการทำงานหนักของทางเดินอาหาร", "เสริมแบคทีเรียตัวดีกระตุ้นการสร้างอึเป็นก้อนกลม", "กลิ่นและรสชาติหอมเป็นพิเศษกระตุ้นความอยากอาหาร"],
        whyItFits: "เหมาะสำหรับแมวที่มีปัญหาอาเจียนบ่อย ลำไส้แปรปรวน ท้องเสียเรื้อรัง ช่วยให้ลำไส้กลับมาทำงานได้เป็นปกติ",
        buttonText: "จัดกล่องสูตรลำไส้แมว"
      },
      {
        brand: "Purina One",
        formula: "Sensitive Systems Salmon & Tuna",
        badge: "แมวโตเลี้ยงในบ้าน",
        pros: ["โปรตีนหลักจากแซลมอน ย่อยง่ายและอิ่มนาน", "มีข้าวกล้องและข้าวโอ๊ตดีต่อลำไส้ที่อ่อนไหว", "ช่วยลดคราบหินปูนและกลิ่นปาก"],
        whyItFits: "ใช้วัตถุดิบย่อยง่ายช่วยดูดซึมสารอาหารได้เต็มร้อย เหมาะกับแมวโตที่ระบบท้องไส้อ่อนไหวง่าย",
        buttonText: "จัดกล่องสูตรแมวท้องเสียบ่อย"
      }
    ]
  }
};

interface NutritionCalculatorProps {
  onCalculate?: (grams: number | null, species: Species) => void;
}

export const NutritionCalculator: React.FC<NutritionCalculatorProps> = ({
  onCalculate,
}) => {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("normal");
  const [goal, setGoal] = useState("maintain");
  const [neutered, setNeutered] = useState("intact");

  const result = useMemo(() => {
    const kg = parseFloat(weight);
    if (!kg || kg <= 0) return null;

    // Resting Energy Requirement (kcal/day)
    const rer = 70 * Math.pow(kg, 0.75);
    const actFactor = ACTIVITY.find((a) => a.value === activity)?.factor ?? 1;
    const goalFactor = GOALS.find((g) => g.value === goal)?.factor ?? 1;
    const neutFactor = NEUTERED_FACTORS[species][neutered] ?? 1;
    const parsedAge = parseFloat(age);
    const lifeStage = getLifeStage(species, Number.isFinite(parsedAge) ? parsedAge : null);

    const kcal = Math.round(rer * lifeStage.factor * actFactor * goalFactor * neutFactor);
    const grams = Math.round((kcal / KCAL_PER_GRAM) / 5) * 5;
    const monthlyGrams = grams * 30;
    return { kcal, grams, monthlyGrams, lifeStage };
  }, [weight, age, activity, goal, species, neutered]);

  const grams = result?.grams ?? null;

  const macros = MACROS[species];

  useEffect(() => {
    if (onCalculate) {
      onCalculate(result ? result.monthlyGrams : null, species);
    }
  }, [result, species, onCalculate]);

  return (
    <Container
      maxWidth="lg"
      id="calculator"
      sx={{ py: { xs: 2, md: 2.5 }, px: { xs: 2, sm: 3, lg: 1 }, scrollMarginTop: "40px" }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "28px",
          background: `linear-gradient(135deg, #FDF6F0 0%, ${DS.peachSoft} 100%)`,
          p: { xs: 2, md: 2.5 },
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "minmax(0, 1.05fr) minmax(320px, .95fr)",
            lg: "minmax(180px, .6fr) minmax(0, 1.1fr) minmax(320px, .95fr)",
          },
          alignItems: { xs: "stretch", lg: "center" },
          gap: { xs: 2, md: 2.5 },
        }}
      >
        {/* ── Compact heading ── */}
        <Box
          sx={{
            gridColumn: "1 / -1",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            mb: 0.5,
          }}
        >
          {/* Left side: Icon + Title + Reference Badge */}
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <PawPrint size={24} color={DS.mintDeep} fill={DS.mintDeep} strokeWidth={1.6} />
            <Typography
              sx={{
                fontSize: { xs: 24, md: 28 },
                fontWeight: 700,
                color: DS.ink,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              คำนวณสารอาหาร
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: DS.gray,
                fontWeight: 500,
                ml: { xs: 0, sm: 0.5 },
                bgcolor: "rgba(43,43,51,.06)",
                px: 1,
                py: 0.3,
                borderRadius: "6px",
              }}
            >
              อ้างอิงเกณฑ์ AAFCO & WSAVA
            </Typography>
          </Box>

          {/* Right side: Subtitle */}
          <Typography
            sx={{
              fontSize: 13.5,
              color: "#6b5f59",
              fontWeight: 500,
              mt: { xs: 0.5, sm: 0 },
              alignSelf: { xs: "flex-start", sm: "center" },
            }}
          >
            รู้ปริมาณอาหารที่พอดีสำหรับเค้าใน 10 วินาที
          </Typography>
        </Box>

        {/* ── Pet image · one dedicated grid column ── */}
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            gridColumn: { xs: "1", md: "1 / -1", lg: "auto" },
            minHeight: { xs: 130, md: 160, lg: 0 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 150, md: 190, lg: "100%" },
              maxWidth: 230,
              height: { xs: 130, md: 160, lg: 260 },
              pointerEvents: "none",
            }}
          >
            <Image
              src={species === "cat" ? "/images/nutrition_cat.webp" : "/images/nutrition_dog.webp"}
              alt={species === "cat" ? "แมวกับชามอาหาร" : "สุนัขกับชามอาหาร"}
              fill
              sizes="(min-width: 1200px) 230px, 190px"
              style={{ objectFit: "contain", mixBlendMode: "multiply" }}
            />
          </Box>
        </Box>

        {/* ── Center · form ── */}
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,.55)",
            borderRadius: "22px",
            p: { xs: 2, md: 2.25 },
          }}
        >
          {/* Species toggle */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0.5,
              p: 0.5,
              bgcolor: DS.peachSoft,
              borderRadius: DS.radius.pill,
              mb: 1.5,
            }}
          >
            {(["dog", "cat"] as Species[]).map((s) => (
              <Box
                key={s}
                onClick={() => {
                  setSpecies(s);
                  setNeutered("intact");
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSpecies(s);
                    setNeutered("intact");
                  }
                }}
                sx={{
                  py: 0.8,
                  textAlign: "center",
                  borderRadius: DS.radius.pill,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .2s",
                  bgcolor: species === s ? DS.peach : "transparent",
                  color: species === s ? DS.white : "#9a8a82",
                  boxShadow: species === s ? "0 6px 14px rgba(245,153,127,.3)" : "none",
                  "&:focus-visible": { outline: `2px solid ${DS.peach}`, outlineOffset: 2 },
                }}
              >
                {s === "dog" ? "สุนัข" : "แมว"}
              </Box>
            ))}
          </Box>

          {/* Weight + Age */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mb: 1.25 }}>
            <Box>
              <Typography component="label" sx={labelSx}>น้ำหนัก</Typography>
              <Stepper
                value={weight}
                onChange={setWeight}
                unit="กก."
                step={0.5}
                max={120}
                ariaLabel="น้ำหนัก (กิโลกรัม)"
              />
            </Box>
            <Box>
              <Typography component="label" sx={labelSx}>อายุ</Typography>
              <Stepper
                value={age}
                onChange={setAge}
                unit="ปี"
                step={0.1}
                min={0.1}
                max={30}
                ariaLabel="อายุ (ปี)"
              />
            </Box>
          </Box>

          {/* Activity + Goal */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25 }}>
            <Box>
              <Typography component="label" sx={labelSx}>ระดับกิจกรรม</Typography>
              <Select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                IconComponent={(props) => <ChevronDown {...props} size={16} />}
                input={<InputBase sx={{ ...fieldBase, display: "flex", alignItems: "center" }} />}
                MenuProps={{ slotProps: { paper: { sx: { borderRadius: "14px", mt: 0.5 } } } }}
              >
                {ACTIVITY.map((a) => (
                  <MenuItem key={a.value} value={a.value} sx={{ fontSize: 15, fontWeight: 500 }}>
                    {a.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <Typography component="label" sx={labelSx}>เป้าหมาย</Typography>
              <Select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                IconComponent={(props) => <ChevronDown {...props} size={16} />}
                input={<InputBase sx={{ ...fieldBase, display: "flex", alignItems: "center" }} />}
                MenuProps={{ slotProps: { paper: { sx: { borderRadius: "14px", mt: 0.5 } } } }}
              >
                {GOALS.map((g) => (
                  <MenuItem key={g.value} value={g.value} sx={{ fontSize: 15, fontWeight: 500 }}>
                    {g.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          {/* Row 3: Neutered Status */}
          <Box sx={{ mt: 1.5 }}>
            <Typography component="label" sx={labelSx}>สถานะทำหมัน</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0.5,
                p: 0.5,
                bgcolor: DS.peachSoft,
                borderRadius: "14px",
                height: 44,
                alignItems: "center",
              }}
            >
              {[
                { value: "intact", label: "ยังไม่ทำหมัน" },
                { value: "neutered", label: "ทำหมันแล้ว" },
              ].map((item) => {
                const active = neutered === item.value;
                return (
                  <Box
                    key={item.value}
                    onClick={() => setNeutered(item.value)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setNeutered(item.value)}
                    sx={{
                      py: 0.6,
                      textAlign: "center",
                      borderRadius: "10px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all .2s",
                      bgcolor: active ? DS.peach : "transparent",
                      color: active ? DS.white : "#9a8a82",
                      boxShadow: active ? "0 4px 10px rgba(245,153,127,.2)" : "none",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "&:focus-visible": { outline: `2px solid ${DS.peach}`, outlineOffset: 2 },
                    }}
                  >
                    {item.label}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* ── Right · result + nutrient breakdown ── */}
        <Box
          sx={{
            bgcolor: DS.white,
            borderRadius: "22px",
            p: { xs: 2, md: 2.25 },
            boxShadow: "0 14px 34px rgba(43,43,51,.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top section: Calories on Left, Gauge on Right */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              mb: 1.75,
            }}
          >
            {/* Daily Food Amount info */}
            <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: DS.gray, mb: 0.25 }}>
                Daily Food Amount
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 28, md: 32 },
                  fontWeight: 800,
                  color: DS.ink,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                {result ? `${result.grams.toLocaleString()}` : "0"}{" "}
                <Box component="span" sx={{ fontSize: 15, fontWeight: 600, color: DS.gray }}>
                  g
                </Box>
              </Typography>
              <Typography sx={{ fontSize: 12, color: DS.gray, fontWeight: 500, mt: 0.5 }}>
                {result
                  ? `ความต้องการพลังงาน: ${result.kcal.toLocaleString()} kcal`
                  : "กรอกข้อมูลสุนัข/แมวเพื่อคำนวณ"}
              </Typography>
              {result && (
                <Typography sx={{ fontSize: 11, color: DS.gray, fontWeight: 400, mt: 0.1 }}>
                  ({result.lifeStage.label})
                </Typography>
              )}
              {result && (
                <Box
                  sx={{
                    mt: 1.25,
                    p: 1.25,
                    bgcolor: DS.peachSoft,
                    borderRadius: "12px",
                  }}
                >
                  <Typography sx={{ fontSize: 11, color: DS.gray, fontWeight: 600 }}>
                    ปริมาณแนะนำสำหรับรอบส่ง 30 วัน
                  </Typography>
                  <Typography sx={{ fontSize: 18, color: DS.ink, fontWeight: 800, mt: 0.2 }}>
                    {(result.monthlyGrams / 1000).toLocaleString(undefined, {
                      maximumFractionDigits: 1,
                    })} กก.
                  </Typography>
                  <Typography sx={{ fontSize: 10.5, color: DS.gray, mt: 0.2 }}>
                    ใช้เลือกขนาดถุงที่ใกล้เคียง เพื่อลดของเหลือและรวมส่งครั้งเดียว
                  </Typography>
                </Box>
              )}
              {result && (
                <Button
                  component="a"
                  href={`/configure?grams=${result.monthlyGrams}&species=${species}`}
                  disableElevation
                  sx={{
                    mt: 1.5,
                    width: "100%",
                    bgcolor: DS.peach,
                    color: DS.white,
                    borderRadius: DS.radius.pill,
                    py: 1,
                    fontSize: 12.5,
                    fontWeight: 600,
                    textAlign: "center",
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(245,153,127,0.15)",
                    transition: "transform .2s, box-shadow .2s",
                    "&:hover": {
                      bgcolor: "#EE876F",
                      transform: "translateY(-1.5px)",
                      boxShadow: "0 6px 15px rgba(245,153,127,0.25)",
                    },
                  }}
                >
                  เลือกแพ็กเกจจัดส่งสำหรับน้อง
                </Button>
              )}
            </Box>

            {/* 5-Capsule Nutrient Tubes */}
            <Box
              sx={{
                width: 150,
                height: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  width: "100%",
                  height: 110,
                  px: 0.5,
                }}
              >
                {macros.map((m) => {
                  const fillPct = result ? Math.max(12, m.pct * 1.8) : 0;
                  const grad = MACRO_GRADIENTS[m.key] || { start: m.color, end: m.color };
                  const labels: Record<string, string> = {
                    protein: "โปร",
                    fat: "ไข",
                    carb: "คาร์บ",
                    fiber: "ใย",
                    vitamin: "วิท",
                  };
                  return (
                    <Box
                      key={m.key}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        mx: 0.5,
                      }}
                    >
                      {/* Glass Capsule Outer Container */}
                      <Box
                        sx={{
                          width: 14,
                          height: 90,
                          borderRadius: "10px",
                          backgroundColor: "rgba(244, 241, 236, 0.8)",
                          border: "1.5px solid rgba(226, 220, 213, 0.8)",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.03)",
                        }}
                      >
                        {/* Nutrient Glowing Fill */}
                        <Box
                          sx={{
                            width: "100%",
                            height: `${fillPct}%`,
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            background: `linear-gradient(to top, ${grad.start}, ${grad.end})`,
                            borderRadius: "8px",
                            transition: "height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                        />
                        {/* Glass Glossy Highlight reflection */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: "8%",
                            left: "2px",
                            width: "2px",
                            height: "84%",
                            background: "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0))",
                            borderRadius: "1px",
                            pointerEvents: "none",
                          }}
                        />
                      </Box>
                      {/* Tiny Tag Label */}
                      <Typography
                        sx={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: DS.gray,
                          mt: 0.75,
                          lineHeight: 1,
                        }}
                      >
                        {labels[m.key]}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Divider and Nutrient Ratio */}
          <Box sx={{ borderTop: "1px solid rgba(43,43,51,.08)", pt: 1.5, mb: 1.5 }}>
            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: 700,
                color: DS.ink,
                mb: 1.25,
                textAlign: "left",
              }}
            >
              Nutrient Ratio
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                rowGap: 1,
                columnGap: 2,
                textAlign: "left",
              }}
            >
              {macros.map((m) => (
                <Box
                  key={m.key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: m.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: DS.ink,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.label}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: DS.ink }}>
                      {m.pct}%
                    </Typography>
                    {grams && (
                      <Typography sx={{ fontSize: 10.5, color: DS.gray, fontWeight: 500, ml: 0.25 }}>
                        ({Math.round((grams * m.pct) / 100)}ก.)
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: 10.5,
              color: DS.gray,
              fontWeight: 400,
              lineHeight: 1.4,
              textAlign: "left",
              pt: 1,
            }}
          >
            *คำนวณจากอาหารแห้ง 3.6 kcal/กรัม เป็นค่าเริ่มต้น ควรเทียบฉลากอาหารและปรึกษาสัตวแพทย์
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
