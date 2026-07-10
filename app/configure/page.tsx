"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Crown, ShieldCheck, Truck, Phone, RefreshCw, ShoppingCart, Scale, Minus, Plus } from "lucide-react";
import styles from "./configure.module.css";
import portraitStyles from "./portrait.module.css";
import readabilityStyles from "./readability.module.css";
import packageStyles from "./packages.module.css";
import { Navbar } from "../components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { BackButton } from "../components/BackButton";
import { theme } from "../components/DesignSystem";
import { Sidebar } from "../components/Sidebar";
import { useCart } from "../components/CartProvider";
import {
  calculateNutritionPlan,
  calculateSubscriptionPrice,
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
  const [petWeight, setPetWeight] = useState("0");
  const [petAge, setPetAge] = useState("0");
  const [activity, setActivity] = useState<PetActivityLevel>("normal");
  const [bodyGoal, setBodyGoal] = useState<PetBodyGoal>("maintain");
  const [neutered, setNeutered] = useState<PetNeuterStatus>("intact");
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
  const lockedStepMessage = "กรอกน้ำหนักและอายุใน step 2 ก่อนเลือกขั้นตอนนี้";
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

    const packageKey = `${plan.name}|${species}|${selectedGoal.key}|${weightKg}|${activity}|${bodyGoal}|${neutered}`;
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
      weight: `เกรด ${plan.name} • ${selectedGoalDisplay.title} • ${monthlyKg.toFixed(1)} kg / ${MONTHLY_DELIVERY_DAYS} วัน`,
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
        <div className={styles.panel}>
          <StepTitle number={1} title="ประเภทของน้องสัตว์" subtitle="เลือกให้เหมาะกับน้องของคุณ" />
          <div className={styles.speciesGrid}>
            {(["dog", "cat"] as const).map((type) => <button key={type} className={`${styles.species} ${species === type ? styles.selected : ""}`} onClick={() => { setSpecies(type); setPetWeight("0"); setPetAge("0"); }}>
              <div className={`${styles.petImage} ${type === "dog" ? portraitStyles.dogPortrait : portraitStyles.catPortrait}`}><Image src={type === "dog" ? "/images/choose_dog.webp" : "/images/choose_cat.webp"} alt="" fill sizes="320px" /></div>
              <span className={`${portraitStyles.speciesRadio} ${species === type ? portraitStyles.speciesRadioSelected : ""}`}>
                {species === type && <i />}
              </span>
              <div className={styles.petText}><strong>{type === "dog" ? "น้องสุนัข (Dog)" : "น้องแมว (Cat)"}</strong><small>{type === "dog" ? "เพื่อสุขภาพแข็งแรง ร่าเริง" : "เพื่อการดูแลที่ครบถ้วน"}</small></div>
            </button>)}
          </div>
        </div>

        <div className={styles.panel}>
          <StepTitle number={2} title="คำนวณโภชนาการของน้อง" subtitle="กรอกข้อมูลหลักเพื่อคำนวณกรัมต่อวัน พลังงาน และปริมาณต่อเดือน" />
          <div className={styles.nutritionDesigner}>
            <div className={styles.nutritionBlock}>
              <div className={styles.nutritionBlockHeader}>
                <span>ข้อมูลพื้นฐาน</span>
                <small>ใช้เป็นฐานคำนวณพลังงานต่อวัน</small>
              </div>
              <div className={styles.nutritionInputs}>
                <div className={styles.stepperField}>
                  <span>น้ำหนัก</span>
                  <button type="button" onClick={() => adjustPetWeight(-0.1)} aria-label="ลดน้ำหนัก"><Minus size={15} /></button>
                  <input className={styles.numberInput} value={petWeight} onChange={(event) => setPetWeight(event.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" aria-label="น้ำหนักกิโลกรัม" />
                  <small>kg</small>
                  <button type="button" onClick={() => adjustPetWeight(0.1)} aria-label="เพิ่มน้ำหนัก"><Plus size={15} /></button>
                </div>
                <div className={styles.stepperField}>
                  <span>อายุ</span>
                  <button type="button" onClick={() => adjustPetAge(-0.1)} aria-label="ลดอายุ"><Minus size={15} /></button>
                  <input className={styles.numberInput} value={petAge} onChange={(event) => setPetAge(event.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" aria-label="อายุปี" />
                  <small>ปี</small>
                  <button type="button" onClick={() => adjustPetAge(0.1)} aria-label="เพิ่มอายุ"><Plus size={15} /></button>
                </div>
              </div>
            </div>

            <div className={styles.nutritionDecisionGrid}>
              <div className={styles.nutritionBlock}>
                <div className={styles.nutritionBlockHeader}>
                  <span><Scale size={16} />ระดับกิจกรรม</span>
                  <small>บอกว่าน้องใช้พลังงานมากแค่ไหน</small>
                </div>
                <div className={styles.optionGrid}>{PET_ACTIVITY_OPTIONS.map((item) => <button key={item.key} className={`${styles.optionButton} ${activity === item.key ? styles.optionSelected : ""}`} onClick={() => setActivity(item.key)} type="button">
                  <strong>{item.label}</strong><small>{item.detail}</small>
                </button>)}</div>
              </div>
              <div className={styles.nutritionBlock}>
                <div className={styles.nutritionBlockHeader}>
                  <span>เป้าหมายน้ำหนัก</span>
                  <small>ปรับปริมาณอาหารตามทิศทางรูปร่าง</small>
                </div>
                <div className={styles.optionGrid}>{PET_BODY_GOAL_OPTIONS.map((item) => <button key={item.key} className={`${styles.optionButton} ${bodyGoal === item.key ? styles.optionSelected : ""}`} onClick={() => setBodyGoal(item.key)} type="button">
                  <strong>{item.label}</strong><small>{item.detail}</small>
                </button>)}</div>
              </div>
            </div>

            <div className={`${styles.nutritionBlock} ${styles.neuterBlock}`}>
              <div className={styles.nutritionBlockHeader}>
                <span>สถานะทำหมัน</span>
                <small>ช่วยปรับพลังงานให้เหมาะกับ metabolism</small>
              </div>
              <div className={styles.neuterToggle}>{PET_NEUTER_OPTIONS.map((item) => <button key={item.key} type="button" className={neutered === item.key ? styles.neuterSelected : ""} onClick={() => setNeutered(item.key)}>{item.label}</button>)}</div>
            </div>
          </div>
          <div className={`${styles.portionResult} ${!hasPetBasics ? styles.portionResultWaiting : ""}`}>
            <span><b>{hasPetBasics ? `${dailyGrams} g` : "--"}</b><small>ต่อวัน</small></span>
            <span><b>{hasPetBasics ? `${nutrition.dailyKcal.toLocaleString()} kcal` : "--"}</b><small>พลังงานต่อวัน</small></span>
            <span><b>{hasPetBasics ? `${monthlyKg.toFixed(1)} kg` : "--"}</b><small>ต่อ {MONTHLY_DELIVERY_DAYS} วัน</small></span>
            <p>{hasPetBasics ? `${nutrition.lifeStage.label} • ราคาแพ็กเกจคำนวณจากปริมาณอาหารจริงของน้อง` : "กรอกน้ำหนักและอายุของน้องก่อน เพื่อปลดล็อกการเลือกเกรดอาหารและสูตรดูแล"}</p>
          </div>
        </div>
        <div className={`${styles.panel} ${!hasPetBasics ? styles.lockedPanel : ""}`}>
          <StepTitle number={3} title="เลือกเกรดอาหาร" subtitle={hasPetBasics ? "รอบส่งตายตัว 1 เดือน แยกราคาตามคุณภาพวัตถุดิบ" : lockedStepMessage} />
          <div className={styles.planList}>{SUBSCRIPTION_TIERS.map((item) => <button key={item.name} disabled={!hasPetBasics} style={{ "--package-accent": item.accent, "--package-tint": item.tint, "--package-image-tint": item.imageTint } as CSSProperties} className={`${styles.plan} ${packageStyles.packageCard} ${planName === item.name ? `${styles.planSelected} ${packageStyles.packageSelected}` : ""}`} onClick={() => setPlanName(item.name)}>
            <span className={`${styles.radio} ${packageStyles.packageRadio}`}>{planName === item.name && <i />}</span>
            <div className={`${styles.planImage} ${packageStyles.packageImage}`}><Image src={item.image} alt="" fill sizes="190px" /></div>
            <div className={styles.planCopy}><h3>{item.name} {item.name === "Plus" && <Crown size={20} />}</h3><p>{item.detail}</p><div>{item.features.map((feature) => <span key={feature}><Check size={12} />{feature}</span>)}</div></div>
            <div className={styles.price}><strong>{hasPetBasics ? `฿${getPlanPrice(item).toLocaleString()}` : "--"}</strong><span>/ เดือน</span><small>ส่งทุก {item.days} วัน</small>{item.badge && <em>{item.badge}</em>}</div>
          </button>)}</div>
        </div>

        <div className={`${styles.panel} ${!hasPetBasics ? styles.lockedPanel : ""}`}>
          <StepTitle number={4} title="เลือกสูตรดูแล" subtitle={hasPetBasics ? "สูตรรูปร่างจะปรับแนวทางตามเป้าหมายน้ำหนักที่เลือก" : lockedStepMessage} />
          <div className={styles.focusGrid}>{displayGoals.map((item, index) => <button key={item.key} disabled={!hasPetBasics} className={focus === index ? styles.focusSelected : ""} onClick={() => setFocus(index)}>
            <div><Image src={item.image} alt="" fill sizes="90px" /></div><span><strong>{item.title}</strong><small>{item.detail}</small></span>
          </button>)}</div>
        </div>
      </section>

      <aside className={styles.summary}>
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
        <div className={styles.itemList}>{summaryItems.map((item) => <div className={styles.item} key={item[0]}>
          <div className={styles.itemImage}><Image src={item[3]} alt="" fill sizes="65px" /></div><span><strong>{item[0]}</strong><small>{item[1]}</small><small>{item[2]}</small></span><b>x{item[4]}</b>
        </div>)}</div>
        <div className={styles.delivery}><Truck /><span><strong>จัดส่งฟรีทั่วประเทศ</strong><small>ส่งทุก {MONTHLY_DELIVERY_DAYS} วัน • แก้สูตรได้ก่อนรอบถัดไป</small></span></div>
        <div className={styles.total}><span><b>รวมทั้งหมด</b><strong>{hasPetBasics ? `฿${totalPrice.toLocaleString()}` : "--"} <small>/ เดือน</small></strong><em>{hasPetBasics ? `เฉลี่ยวันละ ฿${Math.round(totalPrice / MONTHLY_DELIVERY_DAYS)}` : "รอข้อมูล step 2"}</em></span><i>{plan.badge || "เริ่มง่าย"}</i></div>
        <button className={styles.packageCartButton} type="button" disabled={!hasPetBasics} onClick={addPackageToCart} aria-label={hasPetBasics ? `เพิ่มแพ็กเกจ ${plan.name} สูตร ${selectedGoalDisplay.title} ลงตะกร้า` : lockedStepMessage}>
          <span>
            <strong>{hasPetBasics ? "เพิ่มแพ็กเกจลงตะกร้า" : "กรอก step 2 ก่อน"}</strong>
          </span>
          <b><ShoppingCart size={18} /></b>
        </button>
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
