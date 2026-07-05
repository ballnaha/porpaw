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

const fieldBase = {
  bgcolor: DS.white,
  border: `1px solid ${DS.line}`,
  borderRadius: "14px",
  px: 2,
  height: 52,
  fontSize: 16,
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
    width: 34,
    height: 34,
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

  const grams = useMemo(() => {
    const kg = parseFloat(weight);
    if (!kg || kg <= 0) return null;

    // Resting Energy Requirement (kcal/day)
    const rer = 70 * Math.pow(kg, 0.75);
    const actFactor = ACTIVITY.find((a) => a.value === activity)?.factor ?? 1;
    const goalFactor = GOALS.find((g) => g.value === goal)?.factor ?? 1;

    const kcal = rer * SPECIES_FACTOR[species] * actFactor * goalFactor;
    return Math.round((kcal / KCAL_PER_GRAM) / 5) * 5; // round to nearest 5g
  }, [weight, activity, goal, species]);

  return (
    <Container
      maxWidth="lg"
      id="calculator"
      sx={{ py: { xs: 3, md: 4 }, px: { xs: 2.5, sm: 3, lg: 1 }, scrollMarginTop: "40px" }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "32px",
          background: `linear-gradient(135deg, #FDF6F0 0%, ${DS.peachSoft} 100%)`,
          p: { xs: 3, md: 4 },
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "minmax(0, 1fr) minmax(0, 1fr)",
            lg: "minmax(0, 0.95fr) minmax(0, 1.1fr) minmax(0, 0.85fr)",
          },
          alignItems: { xs: "stretch", lg: "center" },
          gap: { xs: 3, lg: 2.5 },
        }}
      >
        {/* ── Left · intro + pet photo ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", lg: "flex-start" },
            textAlign: { xs: "center", lg: "left" },
          }}
        >
          <Box sx={{ maxWidth: 280 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", lg: "flex-start" },
                gap: 1,
                mb: 1,
              }}
            >
              <PawPrint size={24} color={DS.mintDeep} fill={DS.mintDeep} strokeWidth={1.6} />
              <Typography
                sx={{
                  fontSize: { xs: 28, md: 33 },
                  fontWeight: 700,
                  color: DS.ink,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                คำนวณสารอาหาร
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 16, color: "#6b5f59", fontWeight: 400, lineHeight: 1.6 }}>
              รู้ปริมาณอาหารที่พอดีสำหรับเค้าใน 10 วินาที
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              width: { xs: 240, md: 300 },
              height: { xs: 240, md: 300 },
              mt: { xs: 1, lg: -1 },
              ml: { lg: -3 },
              mb: { lg: -6 },
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <Image
              src="/images/calculate.png"
              alt="สัตว์เลี้ยงกับชามอาหาร"
              fill
              sizes="300px"
              style={{ objectFit: "contain", mixBlendMode: "multiply" }}
            />
          </Box>
        </Box>

        {/* ── Center · form ── */}
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,.55)",
            borderRadius: "22px",
            p: { xs: 2.5, md: 3 },
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
              mb: 2.25,
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
                  py: 1.25,
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
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75, mb: 1.75 }}>
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
                step={1}
                max={30}
                ariaLabel="อายุ (ปี)"
              />
            </Box>
          </Box>

          {/* Activity + Goal */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.75 }}>
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
        </Box>

        {/* ── Right · result ── */}
        <Box
          sx={{
            bgcolor: DS.white,
            borderRadius: "22px",
            p: { xs: 2.75, md: 3 },
            textAlign: "center",
            boxShadow: "0 14px 34px rgba(43,43,51,.08)",
          }}
        >
          <Box
            sx={{
              width: 108,
              height: 82,
              mx: "auto",
              mb: 1.75,
              position: "relative",
            }}
          >
            <Image
              src="/images/snack.png"
              alt="ชามอาหารสัตว์เลี้ยง"
              fill
              sizes="108px"
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Typography sx={{ fontSize: 17, fontWeight: 600, color: DS.ink }}>
            ปริมาณต่อวัน
          </Typography>
          <Typography sx={{ fontSize: 13, color: DS.gray, fontWeight: 400, mt: 0.35 }}>
            ปริมาณที่แนะนำ
          </Typography>
          <Typography
            sx={{
              fontSize: 56,
              fontWeight: 700,
              color: DS.peach,
              lineHeight: 1.05,
              mt: 0.75,
              letterSpacing: "-0.03em",
            }}
          >
            {grams ?? "—"}
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: DS.ink, mb: 1.75 }}>
            กรัม / วัน
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: DS.gray, fontWeight: 400, lineHeight: 1.6 }}>
            *ค่าประมาณเบื้องต้น ควรปรึกษา
            <br />
            สัตวแพทย์สำหรับคำแนะนำเฉพาะตัว
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
