"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  MenuItem,
  Select,
  InputBase,
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

// Donut geometry (viewBox units). Dasharray segments on circles keep the
// arcs CSS-animatable when the species toggle changes the percentages.
const DONUT_R = 70;
const DONUT_STROKE = 26;
const DONUT_C = 2 * Math.PI * DONUT_R;
const DONUT_GAP = 2.5; // surface gap between segments

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

export const NutritionCalculator: React.FC = () => {
  const [species, setSpecies] = useState<Species>("dog");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("normal");
  const [goal, setGoal] = useState("maintain");
  const [neutered, setNeutered] = useState("intact");

  // Reset status to intact if species changes
  React.useEffect(() => {
    setNeutered("intact");
  }, [species]);

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
    return { kcal, grams, lifeStage };
  }, [weight, age, activity, goal, species, neutered]);

  const grams = result?.grams ?? null;

  const macros = MACROS[species];

  // Baselines for food bowl scaling
  const rer = useMemo(() => {
    const kg = parseFloat(weight);
    if (!kg || kg <= 0) return 0;
    return 70 * Math.pow(kg, 0.75);
  }, [weight]);

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
                onClick={() => setSpecies(s)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSpecies(s)}
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
