"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Crown, ShieldCheck, Truck, Phone, RefreshCw, Scale, Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import styles from "./configure.module.css";
import portraitStyles from "./portrait.module.css";
import readabilityStyles from "./readability.module.css";
import packageStyles from "./packages.module.css";
import { Navbar } from "../components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { BackButton } from "../components/BackButton";
import { theme, DS } from "../components/DesignSystem";
import { Sidebar } from "../components/Sidebar";
import { useCart } from "../components/CartProvider";
import {
  calculateNutritionPlan,
  calculateSubscriptionPrice,
  assessWeight,
  FORMULA_GOALS,
  MONTHLY_DELIVERY_DAYS,
  PET_ACTIVITY_OPTIONS,
  PET_BODY_GOAL_OPTIONS,
  PET_NEUTER_OPTIONS,
  SUBSCRIPTION_TIERS,
  type PetActivityLevel,
  type PetBodyGoal,
  type PetNeuterStatus,
} from "../lib/subscriptionPricing";

function StepTitle({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return <div className={styles.stepTitle}><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>;
}

function formatNumericValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function stepNumericValue(value: string, fallback: number, delta: number, min: number, max: number) {
  const current = Number.parseFloat(value);
  const base = Number.isFinite(current) ? current : fallback;
  const next = Math.min(max, Math.max(min, Math.round((base + delta) * 10) / 10));
  return formatNumericValue(next);
}

function getGoalDisplay(goal: (typeof FORMULA_GOALS)[number], bodyGoal: PetBodyGoal) {
  if (goal.key !== "weight") return goal;

  if (bodyGoal === "gain") {
    return {
      ...goal,
      title: "เพิ่มน้ำหนักสมดุล",
      detail: "เพิ่มพลังงานและโปรตีนให้เหมาะกับรูปร่าง",
      formulaLabel: "สูตรเพิ่มน้ำหนักอย่างสมดุล",
    };
  }

  if (bodyGoal === "lose") {
    return {
      ...goal,
      title: "ลดน้ำหนัก",
      detail: "ลดพลังงานแต่ยังอิ่มและได้สารอาหารครบ",
      formulaLabel: "สูตรลดน้ำหนัก",
    };
  }

  return {
    ...goal,
    title: "ดูแลรูปร่าง",
    detail: "คุมพลังงานและรูปร่างให้เหมาะสม",
    formulaLabel: "สูตรดูแลรูปร่าง",
  };
}

function Dashboard() {
  const router = useRouter();
  const search = useSearchParams();
  const { addItem, removeItem } = useCart();
  const [species, setSpecies] = useState<"dog" | "cat">((search.get("species") as "dog" | "cat") || "dog");
  const requestedPlan = search.get("plan");
  const editingPackageId = Number(search.get("editPackageId"));
  const [planName, setPlanName] = useState(
    SUBSCRIPTION_TIERS.some((item) => item.name === requestedPlan) ? requestedPlan! : "Plus",
  );
  const [focus, setFocus] = useState(0);
  const [petWeight, setPetWeight] = useState(search.get("weight") || "0");
  const [petAge, setPetAge] = useState(search.get("age") || "0");
  const [activity, setActivity] = useState<PetActivityLevel>((search.get("activity") as PetActivityLevel) || "normal");
  const [bodyGoal, setBodyGoal] = useState<PetBodyGoal>((search.get("goal") as PetBodyGoal) || "maintain");
  const [neutered, setNeutered] = useState<PetNeuterStatus>((search.get("neutered") as PetNeuterStatus) || "intact");
  const [dogSize, setDogSize] = useState<"small" | "medium" | "large">((search.get("dogSize") as "small" | "medium" | "large") || "medium");
  const [step, setStep] = useState(1);
  const plan = useMemo(() => SUBSCRIPTION_TIERS.find((item) => item.name === planName) || SUBSCRIPTION_TIERS[1], [planName]);
  const goals = FORMULA_GOALS;
  const selectedGoal = goals[focus];
  const displayGoals = useMemo(() => goals.map((goal) => getGoalDisplay(goal, bodyGoal)), [goals, bodyGoal]);
  const selectedGoalDisplay = displayGoals[focus];
  const weightKg = Math.max(0, Number.parseFloat(petWeight) || 0);
  const ageYears = Number.parseFloat(petAge);
  const hasPetBasics = weightKg > 0 && Number.isFinite(ageYears) && ageYears > 0;
  const nutrition = calculateNutritionPlan({
    species,
    weightKg,
    ageYears: Number.isFinite(ageYears) ? ageYears : null,
    activity,
    bodyGoal,
    neutered,
  });
  const weightAssessment = hasPetBasics
    ? assessWeight(species, weightKg, Number.isFinite(ageYears) ? ageYears : null, dogSize)
    : null;
  const dailyGrams = nutrition.dailyGrams;
  const monthlyGrams = nutrition.monthlyGrams;
  const monthlyKg = monthlyGrams / 1000;
  const getPlanPrice = (item: (typeof SUBSCRIPTION_TIERS)[number]) => calculateSubscriptionPrice({
    plan: item.name,
    species,
    gramsPerRound: monthlyGrams,
    formula: selectedGoal.key,
  });
  const totalPrice = getPlanPrice(plan);
  const adjustPetWeight = (delta: number) => setPetWeight((value) =>
    stepNumericValue(value, 0, delta, 0, 80),
  );
  const adjustPetAge = (delta: number) => setPetAge((value) =>
    stepNumericValue(value, 0, delta, 0, 25),
  );
  const useDefaultWeight = () => {
    if (species === "cat") {
      setPetWeight("4.0");
    } else {
      if (dogSize === "small") setPetWeight("5.0");
      else if (dogSize === "large") setPetWeight("30.0");
      else setPetWeight("15.0");
    }
    const ageVal = Number.parseFloat(petAge);
    if (!Number.isFinite(ageVal) || ageVal <= 0) {
      setPetAge("2.0");
    }
  };
  const lockedStepMessage = "กรอกน้ำหนักและอายุใน step 1 ก่อนเลือกขั้นตอนนี้";
  const summaryItems = [
    [
      `อาหารหลักเกรด ${plan.name}`,
      selectedGoalDisplay.formulaLabel,
      hasPetBasics
        ? `${monthlyKg.toFixed(1)} kg / ${MONTHLY_DELIVERY_DAYS} วัน • ${dailyGrams} g ต่อวัน`
        : "รอข้อมูลน้ำหนักและอายุ",
      species === "dog" ? "/images/food_dog.webp" : "/images/food_cat.webp",
      "1",
    ],
    ["ขนมเพื่อสุขภาพ", "ขนมปลาแซลมอนอบแห้ง", "80 g", "/images/snack1.webp", "1"],
    ["เสริมบำรุงผิวหนัง & ขน", "น้ำมันปลาแซลมอน", "100 ml", "/images/groom3.webp", "1"],
    ["ของเล่นเสริมพัฒนาการ", species === "dog" ? "เชือกกัด & ลูกบอลนุ่ม" : "บอลแคทนิป & ไม้มาทาทาบิ", "", "/images/toy2.webp", "2"],
  ];
  const addPackageToCart = () => {
    if (!hasPetBasics) return;

    const sizeLabel = species === "dog"
      ? dogSize === "small"
        ? "พันธุ์เล็ก"
        : dogSize === "large"
          ? "พันธุ์ใหญ่"
          : "พันธุ์กลาง"
      : "";

    const packageKey = `${plan.name}|${species}|${selectedGoal.key}|${weightKg}|${activity}|${bodyGoal}|${neutered}${sizeLabel ? `|${dogSize}` : ""}`;
    const packageId = Array.from(packageKey).reduce(
      (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
      1000,
    );
    if (Number.isFinite(editingPackageId) && editingPackageId > 0) removeItem(editingPackageId);
    addItem({
      id: packageId,
      name: `แพ็กเกจ ${plan.name} • ${selectedGoalDisplay.title}`,
      price: totalPrice,
      image: plan.image,
      petType: species,
      weight: `เกรด ${plan.name} • ${selectedGoalDisplay.title}${sizeLabel ? ` (${sizeLabel})` : ""} • ${monthlyKg.toFixed(1)} kg / ${MONTHLY_DELIVERY_DAYS} วัน`,
      packageContents: summaryItems.map((item) =>
        [item[0], item[1], item[2], `x${item[4]}`].filter(Boolean).join(" • "),
      ),
    });
    router.push("/cart");
  };

  return <ThemeProvider theme={theme}>
    <Sidebar sectionBase="/" />
    <Box sx={{ minHeight: "100vh", overflowX: "hidden", pl: { lg: "104px" } }}>
      <Navbar
        handleLineLogin={() => { window.location.href = "https://line.me/R/ti/p/@baebite"; }}
        isConnecting={false}
      />
      <main className={`${styles.page} ${readabilityStyles.readable}`}>
      <Box sx={{ maxWidth: 1320, mx: "auto", mb: 1.25 }}>
        <BackButton fallbackHref="/" preferHistory bottomSpacing={0}>
          กลับหน้าหลัก
        </BackButton>
      </Box>
      <div className={styles.layout}>
      <section className={styles.left}>
        {/* Step Progress Indicator */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5, px: 0.5 }}>
          {[
            { num: 1, label: "ข้อมูลน้อง" },
            { num: 2, label: "เกรดอาหาร" },
            { num: 3, label: "สูตรดูแล" }
          ].map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            const canClick = s.num === 1 || (s.num === 2 && hasPetBasics) || (s.num === 3 && hasPetBasics && planName);
            return (
              <Box key={s.num} sx={{ display: "flex", alignItems: "center", gap: 1, flex: s.num < 3 ? 1 : "none", position: "relative" }}>
                <Box
                  onClick={() => canClick && setStep(s.num)}
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    bgcolor: isActive ? "#ff956e" : isCompleted ? "#ec853f" : "#e6e5e3",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: canClick ? "pointer" : "default",
                    boxShadow: isActive ? "0 4px 10px rgba(255,149,110,.35)" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  {s.num}
                </Box>
                <Typography
                  sx={{
                    fontSize: 12.5,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? "#ff956e" : isCompleted ? "#ec853f" : "#9a8a82",
                    display: { xs: "none", sm: "block" }
                  }}
                >
                  {s.label}
                </Typography>
                {s.num < 3 && (
                  <Box
                    sx={{
                      height: 2,
                      bgcolor: isCompleted ? "#ff956e" : "#e6e5e3",
                      flex: 1,
                      mx: 1.5,
                      display: { xs: "none", sm: "block" }
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Step Panels */}
        {step === 1 && (
          <div className={styles.panel}>
            <StepTitle number={1} title="ข้อมูลและการคำนวณโภชนาการ" subtitle="กรอกข้อมูลหลักเพื่อคำนวณสารอาหารและพลังงานอย่างละเอียด" />
            
            <div className={styles.petGrid}>
              <div className={styles.petGridLeft}>
                {/* Species Toggle */}
                <div className={styles.nutritionBlock} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <div className={styles.nutritionBlockHeader} style={{ marginBottom: "12px" }}>
                    <span>ประเภทน้องสัตว์</span>
                    <small>เลือกประเภทเพื่อจัดสูตร</small>
                  </div>
                  <div className={styles.speciesGrid} style={{ flex: 1, gap: "12px" }}>
                    {(["dog", "cat"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`${styles.species} ${species === type ? styles.selected : ""}`}
                        onClick={() => { setSpecies(type); setPetWeight("0"); setPetAge("0"); if (type === "dog") setDogSize("medium"); }}
                        style={{ borderRadius: "14px" }}
                      >
                        <div className={`${styles.petImage} ${type === "dog" ? portraitStyles.dogPortrait : portraitStyles.catPortrait}`} style={{ height: "100px" }}>
                          <Image src={type === "dog" ? "/images/choose_dog.webp" : "/images/choose_cat.webp"} alt="" fill sizes="150px" priority />
                        </div>
                        <div className={styles.petText} style={{ padding: "8px", textAlign: "center" }}>
                          <strong style={{ fontSize: "16px" }}>{type === "dog" ? "สุนัข" : "แมว"}</strong>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dog Size Toggle */}
                {species === "dog" && (
                  <div className={styles.nutritionBlock}>
                    <div className={styles.nutritionBlockHeader} style={{ marginBottom: "8px" }}>
                      <span>ขนาดสายพันธุ์</span>
                      <small>เกณฑ์น้ำหนักตามขนาด</small>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                      {([
                        { key: "small", label: "พันธุ์เล็ก", detail: "2-10 kg" },
                        { key: "medium", label: "พันธุ์กลาง", detail: "10-25 kg" },
                        { key: "large", label: "พันธุ์ใหญ่", detail: "25-45 kg" },
                      ] as const).map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setDogSize(item.key)}
                          className={`${styles.optionButton} ${dogSize === item.key ? styles.optionSelected : ""}`}
                          style={{ padding: "6px 8px", minHeight: "52px", borderRadius: "10px", alignItems: "center", textAlign: "center" }}
                        >
                          <strong style={{ fontSize: "14px" }}>{item.label}</strong>
                          <small style={{ fontSize: "11px", opacity: 0.85 }}>{item.detail}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weight + Age */}
                <div className={styles.nutritionBlock}>
                  <div className={styles.nutritionBlockHeader} style={{ marginBottom: "10px" }}>
                    <span>ข้อมูลพื้นฐาน <Box component="span" sx={{ color: "#D32F2F", fontSize: "11.5px", fontWeight: 800, ml: 0.5 }}>*จำเป็นในการจัดสูตร</Box></span>
                    <small>ใช้เป็นฐานคำนวณพลังงานและปริมาณอาหาร</small>
                  </div>
                  <div className={styles.nutritionInputs} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    {/* Weight Input Box */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography component="label" sx={{ fontSize: "14px", fontWeight: 800, color: DS.ink }}>
                          น้ำหนัก <Box component="span" sx={{ color: "#D32F2F" }}>*</Box>
                        </Typography>
                        <Button
                          variant="text"
                          onClick={useDefaultWeight}
                          sx={{
                            p: 0,
                            minWidth: 0,
                            fontSize: "11px",
                            color: "#ff956e",
                            fontWeight: 800,
                            textDecoration: "underline",
                            "&:hover": { bgcolor: "transparent", color: "#ec853f" }
                          }}
                        >
                          ไม่ทราบน้ำหนัก?
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          bgcolor: "#fff",
                          border: `1.5px solid ${DS.line}`,
                          borderRadius: "12px",
                          p: "5px 8px",
                          height: 44,
                          boxShadow: "0 2px 4px rgba(43,43,51,.02)"
                        }}
                      >
                        <IconButton
                          onClick={() => adjustPetWeight(-0.1)}
                          size="small"
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#fff4ed",
                            color: "#c76431",
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#ff956e", color: "#fff" }
                          }}
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </IconButton>
                        
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, flex: 1 }}>
                          <input
                            value={petWeight}
                            onChange={(event) => setPetWeight(event.target.value.replace(/[^\d.]/g, ""))}
                            inputMode="decimal"
                            style={{
                              border: 0,
                              outline: 0,
                              width: "50px",
                              textAlign: "center",
                              fontSize: "17px",
                              fontWeight: 800,
                              color: DS.ink,
                              background: "transparent",
                            }}
                          />
                          <Typography sx={{ fontSize: "13px", fontWeight: 800, color: DS.gray }}>
                            kg
                          </Typography>
                        </Box>

                        <IconButton
                          onClick={() => adjustPetWeight(0.1)}
                          size="small"
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#fff4ed",
                            color: "#c76431",
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#ff956e", color: "#fff" }
                          }}
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Age Input Box */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                      <Typography component="label" sx={{ fontSize: "14px", fontWeight: 800, color: DS.ink, height: "18.5px", display: "flex", alignItems: "center" }}>
                        อายุ <Box component="span" sx={{ color: "#D32F2F", ml: 0.5 }}>*</Box>
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          bgcolor: "#fff",
                          border: `1.5px solid ${DS.line}`,
                          borderRadius: "12px",
                          p: "5px 8px",
                          height: 44,
                          boxShadow: "0 2px 4px rgba(43,43,51,.02)"
                        }}
                      >
                        <IconButton
                          onClick={() => adjustPetAge(-0.1)}
                          size="small"
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#fff4ed",
                            color: "#c76431",
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#ff956e", color: "#fff" }
                          }}
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </IconButton>

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, flex: 1 }}>
                          <input
                            value={petAge}
                            onChange={(event) => setPetAge(event.target.value.replace(/[^\d.]/g, ""))}
                            inputMode="decimal"
                            style={{
                              border: 0,
                              outline: 0,
                              width: "50px",
                              textAlign: "center",
                              fontSize: "17px",
                              fontWeight: 800,
                              color: DS.ink,
                              background: "transparent",
                            }}
                          />
                          <Typography sx={{ fontSize: "13px", fontWeight: 800, color: DS.gray }}>
                            ปี
                          </Typography>
                        </Box>

                        <IconButton
                          onClick={() => adjustPetAge(0.1)}
                          size="small"
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#fff4ed",
                            color: "#c76431",
                            borderRadius: "10px",
                            "&:hover": { bgcolor: "#ff956e", color: "#fff" }
                          }}
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </IconButton>
                      </Box>
                    </Box>
                  </div>
                </div>
              </div>

              <div className={styles.petGridRight}>
                {/* Activity Level */}
                <div className={styles.nutritionBlock}>
                  <div className={styles.nutritionBlockHeader} style={{ marginBottom: "8px" }}>
                    <span><Scale size={14} /> ระดับกิจกรรม</span>
                    <small>การใช้พลังงาน</small>
                  </div>
                  <div className={styles.optionGrid} style={{ gridTemplateColumns: "1fr", gap: "6px" }}>
                    {PET_ACTIVITY_OPTIONS.map((item) => (
                      <button key={item.key} className={`${styles.optionButton} ${activity === item.key ? styles.optionSelected : ""}`} onClick={() => setActivity(item.key)} type="button" style={{ minHeight: "48px", borderRadius: "10px", padding: "6px 10px" }}>
                        <strong style={{ fontSize: "14px" }}>{item.label}</strong>
                        <small style={{ fontSize: "11px" }}>{item.detail}</small>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight Goal */}
                <div className={styles.nutritionBlock}>
                  <div className={styles.nutritionBlockHeader} style={{ marginBottom: "8px" }}>
                    <span>เป้าหมายน้ำหนัก</span>
                    <small>คุมพลังงานอาหาร</small>
                  </div>
                  <div className={styles.optionGrid} style={{ gridTemplateColumns: "1fr", gap: "6px" }}>
                    {PET_BODY_GOAL_OPTIONS.map((item) => (
                      <button key={item.key} className={`${styles.optionButton} ${bodyGoal === item.key ? styles.optionSelected : ""}`} onClick={() => setBodyGoal(item.key)} type="button" style={{ minHeight: "48px", borderRadius: "10px", padding: "6px 10px" }}>
                        <strong style={{ fontSize: "14px" }}>{item.label}</strong>
                        <small style={{ fontSize: "11px" }}>{item.detail}</small>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Neutered Status */}
                <div className={`${styles.nutritionBlock} ${styles.neuterBlock}`} style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "8px" }}>
                  <div className={styles.nutritionBlockHeader} style={{ width: "100%", justifyContent: "space-between" }}>
                    <span>สถานะทำหมัน</span>
                    <small>Metabolism</small>
                  </div>
                  <div className={styles.neuterToggle} style={{ gridTemplateColumns: "1fr 1fr", gap: "6px", width: "100%" }}>
                    {PET_NEUTER_OPTIONS.map((item) => (
                      <button key={item.key} type="button" className={neutered === item.key ? styles.neuterSelected : ""} onClick={() => setNeutered(item.key)} style={{ minHeight: "36px", borderRadius: "10px", fontSize: "14px" }}>{item.label}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.petGridFull}>
                <div className={`${styles.portionResult} ${!hasPetBasics ? styles.portionResultWaiting : ""}`} style={{ padding: "10px 12px", borderRadius: "12px", gap: "8px" }}>
                  <span><b style={{ fontSize: "20px" }}>{hasPetBasics ? `${dailyGrams} g` : "--"}</b><small style={{ fontSize: "12px" }}>ต่อวัน</small></span>
                  <span><b style={{ fontSize: "20px" }}>{hasPetBasics ? `${nutrition.dailyKcal.toLocaleString()} kcal` : "--"}</b><small style={{ fontSize: "12px" }}>พลังงานต่อวัน</small></span>
                  <span><b style={{ fontSize: "20px" }}>{hasPetBasics ? `${monthlyKg.toFixed(1)} kg` : "--"}</b><small style={{ fontSize: "12px" }}>ต่อ {MONTHLY_DELIVERY_DAYS} วัน</small></span>
                  <p style={{ fontSize: "13px", lineHeight: "1.4" }}>{hasPetBasics ? `${nutrition.lifeStage.label} • คิดราคาจริงตามกรัมอาหาร` : "กรอกข้อมูลน้องก่อนเพื่อเริ่มคำนวณ"}</p>
                </div>

                {/* Weight Assessment Banner */}
                {hasPetBasics && weightAssessment && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px 14px",
                      backgroundColor: weightAssessment.tone.soft,
                      border: `1px solid ${weightAssessment.tone.border}`,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        display: "grid",
                        placeItems: "center",
                        backgroundColor: "#fff",
                        color: weightAssessment.tone.color,
                        border: `1px solid ${weightAssessment.tone.border}`,
                        borderRadius: "8px",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {weightAssessment.action === "lose" ? (
                        <TrendingDown size={15} />
                      ) : weightAssessment.action === "gain" ? (
                        <TrendingUp size={15} />
                      ) : (
                        <ShieldCheck size={15} />
                      )}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ color: weightAssessment.tone.color, fontSize: "15px", fontWeight: 800, lineHeight: 1.25 }}>
                        {weightAssessment.title}
                      </div>
                      <div style={{ color: "#2b2b33", fontSize: "13px", fontWeight: 700, marginTop: "4px", lineHeight: 1.3 }}>
                        {weightAssessment.targetLabel}
                      </div>
                      <div style={{ color: "#686169", fontSize: "12px", fontWeight: 500, marginTop: "2px", lineHeight: 1.3 }}>
                        ช่วงมาตรฐาน: {weightAssessment.idealRange}
                      </div>
                      <div style={{ color: "#686169", fontSize: "12px", fontWeight: 400, marginTop: "4px", lineHeight: 1.35, opacity: 0.95 }}>
                        💡 {weightAssessment.summary}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={`${styles.panel} ${!hasPetBasics ? styles.lockedPanel : ""}`}>
            <StepTitle number={2} title="เลือกเกรดอาหาร" subtitle={hasPetBasics ? "รอบส่งตายตัว 1 เดือน แยกราคาตามคุณภาพวัตถุดิบ" : lockedStepMessage} />
            <div className={styles.planList}>{SUBSCRIPTION_TIERS.map((item) => <button key={item.name} disabled={!hasPetBasics} style={{ "--package-accent": item.accent, "--package-tint": item.tint, "--package-image-tint": item.imageTint } as CSSProperties} className={`${styles.plan} ${packageStyles.packageCard} ${planName === item.name ? `${styles.planSelected} ${packageStyles.packageSelected}` : ""}`} onClick={() => setPlanName(item.name)}>
              <span className={`${styles.radio} ${packageStyles.packageRadio}`}>{planName === item.name && <i />}</span>
              <div className={`${styles.planImage} ${packageStyles.packageImage}`}><Image src={item.image} alt="" fill sizes="190px" /></div>
              <div className={styles.planCopy}><h3>{item.name} {item.name === "Plus" && <Crown size={20} />}</h3><p>{item.detail}</p><div>{item.features.map((feature) => <span key={feature}><Check size={12} />{feature}</span>)}</div></div>
              <div className={styles.price}><strong>{hasPetBasics ? `฿${getPlanPrice(item).toLocaleString()}` : "--"}</strong><span>/ เดือน</span><small>ส่งทุก {item.days} วัน</small>{item.badge && <em>{item.badge}</em>}</div>
            </button>)}</div>
          </div>
        )}

        {step === 3 && (
          <div className={`${styles.panel} ${!hasPetBasics ? styles.lockedPanel : ""}`}>
            <StepTitle number={3} title="เลือกสูตรดูแล" subtitle={hasPetBasics ? "สูตรรูปร่างจะปรับแนวทางตามเป้าหมายน้ำหนักที่เลือก" : lockedStepMessage} />
            <div className={styles.focusGrid}>{displayGoals.map((item, index) => <button key={item.key} disabled={!hasPetBasics} className={focus === index ? styles.focusSelected : ""} onClick={() => setFocus(index)}>
              <div><Image src={item.image} alt="" fill sizes="90px" /></div><span><strong>{item.title}</strong><small>{item.detail}</small></span>
            </button>)}</div>
          </div>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2.5, gap: 2, px: 0.5 }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                border: "1.5px solid #ff956e",
                background: "#fff",
                color: "#ff956e",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s"
              }}
            >
              ย้อนกลับ
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 && !hasPetBasics}
              onClick={() => setStep(step + 1)}
              style={{
                padding: "10px 32px",
                borderRadius: "999px",
                border: "none",
                background: step === 1 && !hasPetBasics ? "#d7d2cc" : "linear-gradient(135deg, #ffad7c, #ff956e)",
                color: "#fff",
                fontWeight: 700,
                cursor: step === 1 && !hasPetBasics ? "not-allowed" : "pointer",
                fontSize: "14px",
                boxShadow: step === 1 && !hasPetBasics ? "none" : "0 6px 14px rgba(255,149,110,.25)"
              }}
            >
              ถัดไป
            </button>
          ) : (
            <button
              type="button"
              onClick={addPackageToCart}
              style={{
                padding: "10px 32px",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(135deg, #ff956e, #ec853f)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "14px",
                boxShadow: "0 6px 14px rgba(226,124,55,.25)"
              }}
            >
              เพิ่มลงตะกร้า
            </button>
          )}
        </Box>
      </section>

      <aside className={`${styles.summary} ${step < 3 ? styles.summaryHiddenMobile : ""}`}>
        <header>
          <strong
            className={packageStyles.selectedPackage}
            style={{ "--package-accent": plan.accent, "--package-tint": plan.tint } as CSSProperties}
          >
            เกรด {plan.name}
          </strong>
          <span className={packageStyles.selectedFocus}>สูตร: {selectedGoalDisplay.title} • รอบ 1 เดือน</span>
        </header>
        <div className={styles.heroBox}><Image src="/images/box4.webp" alt="กล่อง baebite" fill priority sizes="450px" /></div>
        <div className={styles.itemList}>{summaryItems.map((item, index) => <div className={styles.item} key={item[0]}>
          <div className={styles.itemImage}>
            <Image
              src={item[3]}
              alt=""
              fill
              sizes="65px"
              priority={index === 0}
            />
          </div>
          <span><strong>{item[0]}</strong><small>{item[1]}</small><small>{item[2]}</small></span><b>x{item[4]}</b>
        </div>)}</div>
        <div className={styles.delivery}><Truck /><span><strong>จัดส่งฟรีทั่วประเทศ</strong><small>ส่งทุก {MONTHLY_DELIVERY_DAYS} วัน • แก้สูตรได้ก่อนรอบถัดไป</small></span></div>
        <div className={styles.total}><span><b>รวมทั้งหมด</b><strong>{hasPetBasics ? `฿${totalPrice.toLocaleString()}` : "--"} <small>/ เดือน</small></strong><em>{hasPetBasics ? `เฉลี่ยวันละ ฿${Math.round(totalPrice / MONTHLY_DELIVERY_DAYS)}` : "รอข้อมูล step 2"}</em></span><i>{plan.badge || "เริ่มง่าย"}</i></div>
      </aside>
      <div className={styles.trust}>
        <span><ShieldCheck /><b>ปลอดภัย 100%<small>ชำระเงินปลอดภัย</small></b></span>
        <span><RefreshCw /><b>รับประกันความพอใจ<small>คืนเงินภายใน 7 วัน</small></b></span>
        <span><Phone /><b>ปรึกษาผู้เชี่ยวชาญ<small>นักโภชนาการสัตว์เลี้ยง</small></b></span>
      </div>
      </div>
      </main>
    </Box>
  </ThemeProvider>;
}

export default function ConfigurePage() {
  return <Suspense><Dashboard /></Suspense>;
}
