"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check, Crown, ShieldCheck, Truck, Phone, RefreshCw, ShoppingCart } from "lucide-react";
import styles from "./configure.module.css";
import portraitStyles from "./portrait.module.css";
import readabilityStyles from "./readability.module.css";
import packageStyles from "./packages.module.css";
import backStyles from "./back-link.module.css";
import { Navbar } from "../components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { theme } from "../components/DesignSystem";
import { Sidebar } from "../components/Sidebar";
import { calculateSubscriptionPrice, type SubscriptionPlanName } from "../lib/subscriptionPricing";
import { useCart } from "../components/CartProvider";

const plans = [
  { name: "Paw-Lite", detail: "เริ่มทดลองด้วยกล่องเล็ก ปรับง่าย", price: 690, days: 15, image: "/images/paw-lite1.webp", features: ["เหมาะสำหรับเริ่มต้น", "อาหารสดใหม่ทุกรอบ", "ปรับรอบส่งได้"], accent: "#f28b5b", tint: "#fff2e9", imageTint: "#ffe3d2" },
  { name: "Paw-Fit", detail: "ปริมาณพอดีตามที่กิน ดูแลง่ายทุกเดือน", price: 1290, days: 30, image: "/images/paw-fit1.webp", features: ["คำนวณตามที่กินจริง", "ควบคุมปริมาณง่าย", "สมดุลที่สุด"], badge: "แนะนำ", accent: "#64a77b", tint: "#eef8f0", imageTint: "#dff1e4" },
  { name: "Paw-Max", detail: "กล่องใหญ่ ลดรอบส่ง ราคาต่อมื้อคุ้มกว่า", price: 1690, days: 45, image: "/images/paw-max1.webp", features: ["ปริมาณต่อรอบมาก", "ลดความถี่จัดส่ง", "คุ้มค่าระยะยาว"], badge: "คุ้มที่สุด", accent: "#7774b9", tint: "#f2f1fb", imageTint: "#e5e3f7" },
];

const FORMULA_MULTIPLIERS = [1.1, 1.12, 1.08, 1.12, 1.1, 1.25];

type HealthGoal = {
  title: string;
  detail: string;
  image: string;
  formulaLabel: string;
};

const healthGoals: Record<"dog" | "cat", HealthGoal[]> = {
  dog: [
    { title: "ผิวหนัง & เส้นขน", detail: "ดูแลผิวและขนให้สุขภาพดี", image: "/images/skin.webp", formulaLabel: "สูตรดูแลผิวหนังและเส้นขน" },
    { title: "ระบบย่อยอาหาร", detail: "สำหรับน้องที่ท้องไส้อ่อนไหว", image: "/images/food1.webp", formulaLabel: "สูตรย่อยง่าย" },
    { title: "ควบคุมน้ำหนัก", detail: "ดูแลรูปร่างและพลังงานที่เหมาะสม", image: "/images/diet1.webp", formulaLabel: "สูตรควบคุมน้ำหนัก" },
    { title: "ข้อ & การเคลื่อนไหว", detail: "เหมาะกับน้องพันธุ์ใหญ่หรือเคลื่อนไหวน้อย", image: "/images/bone.webp", formulaLabel: "สูตรดูแลข้อและการเคลื่อนไหว" },
    { title: "ดูแลสุนัขสูงวัย", detail: "โภชนาการสมดุลตามช่วงวัย", image: "/images/age.webp", formulaLabel: "สูตรสุนัขสูงวัย" },
    { title: "สงสัยแพ้อาหาร", detail: "คัดเลือกแหล่งโปรตีนอย่างระมัดระวัง", image: "/images/allergy.webp", formulaLabel: "สูตรสำหรับน้องที่ไวต่ออาหาร" },
  ],
  cat: [
    { title: "ผิวหนัง & เส้นขน", detail: "ดูแลผิวและขนให้สุขภาพดี", image: "/images/skin.webp", formulaLabel: "สูตรดูแลผิวหนังและเส้นขน" },
    { title: "ระบบย่อย & ก้อนขน", detail: "ช่วยดูแลท้องไส้และการขับก้อนขน", image: "/images/food1.webp", formulaLabel: "สูตรดูแลระบบย่อยและก้อนขน" },
    { title: "ควบคุมน้ำหนัก", detail: "ดูแลรูปร่างและพลังงานที่เหมาะสม", image: "/images/diet1.webp", formulaLabel: "สูตรควบคุมน้ำหนัก" },
    { title: "ระบบทางเดินปัสสาวะ", detail: "ดูแลสมดุลแร่ธาตุในอาหาร", image: "/images/balance.webp", formulaLabel: "สูตรดูแลทางเดินปัสสาวะ" },
    { title: "ดูแลแมวสูงวัย", detail: "โภชนาการสมดุลตามช่วงวัย", image: "/images/age.webp", formulaLabel: "สูตรแมวสูงวัย" },
    { title: "สงสัยแพ้อาหาร", detail: "คัดเลือกแหล่งโปรตีนอย่างระมัดระวัง", image: "/images/allergy.webp", formulaLabel: "สูตรสำหรับน้องที่ไวต่ออาหาร" },
  ],
};

function StepTitle({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return <div className={styles.stepTitle}><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>;
}

function Dashboard() {
  const router = useRouter();
  const search = useSearchParams();
  const { addItem, removeItem } = useCart();
  const [species, setSpecies] = useState<"dog" | "cat">((search.get("species") as "dog" | "cat") || "dog");
  const requestedPlan = search.get("plan");
  const editingPackageId = Number(search.get("editPackageId"));
  const [planName, setPlanName] = useState(
    plans.some((item) => item.name === requestedPlan) ? requestedPlan! : "Paw-Fit",
  );
  const [focus, setFocus] = useState(0);
  const plan = useMemo(() => plans.find((item) => item.name === planName) || plans[1], [planName]);
  const monthlyGrams = Number(search.get("grams"));
  const planGrams = Number.isFinite(monthlyGrams) && monthlyGrams > 0
    ? Math.round((monthlyGrams * plan.days) / 30)
    : null;
  const getPlanPrice = (item: (typeof plans)[number]) => {
    if (!Number.isFinite(monthlyGrams) || monthlyGrams <= 0) return item.price;

    return calculateSubscriptionPrice({
      plan: item.name as SubscriptionPlanName,
      species,
      gramsPerRound: (monthlyGrams * item.days) / 30,
      formulaMultiplier: FORMULA_MULTIPLIERS[focus],
    });
  };
  const totalPrice = getPlanPrice(plan);
  const goals = healthGoals[species];
  const selectedGoal = goals[focus];
  const summaryItems = [
    ["อาหารหลักคุณภาพสูง", selectedGoal.formulaLabel, planGrams ? `${(planGrams / 1000).toFixed(1)} kg` : "คำนวณตามน้ำหนัก", species === "dog" ? "/images/food_dog.webp" : "/images/food_cat.webp", "1"],
    ["ขนมเพื่อสุขภาพ", "ขนมปลาแซลมอนอบแห้ง", "80 g", "/images/snack1.webp", "1"],
    ["เสริมบำรุงผิวหนัง & ขน", "น้ำมันปลาแซลมอน", "100 ml", "/images/groom3.webp", "1"],
    ["ของเล่นเสริมพัฒนาการ", species === "dog" ? "เชือกกัด & ลูกบอลนุ่ม" : "บอลแคทนิป & ไม้มาทาทาบิ", "", "/images/toy2.webp", "2"],
  ];
  const addPackageToCart = () => {
    const packageKey = `${plan.name}|${species}|${focus}|${monthlyGrams || "default"}`;
    const packageId = Array.from(packageKey).reduce(
      (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
      1000,
    );
    if (Number.isFinite(editingPackageId) && editingPackageId > 0) removeItem(editingPackageId);
    addItem({
      id: packageId,
      name: `แพ็กเกจ ${plan.name}`,
      price: totalPrice,
      image: plan.image,
      petType: species,
      weight: `${selectedGoal.title} • จัดส่งทุก ${plan.days} วัน`,
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
        handleLineLogin={() => { window.location.href = "https://line.me/R/ti/p/@porpaw"; }}
        isConnecting={false}
      />
      <main className={`${styles.page} ${readabilityStyles.readable}`}>
      <nav className={backStyles.backNav} aria-label="ทางกลับหน้าหลัก">
        <Link href="/"><ArrowLeft size={18} aria-hidden="true" />กลับหน้าหลัก</Link>
      </nav>
      <div className={styles.layout}>
      <section className={styles.left}>
        <div className={styles.panel}>
          <StepTitle number={1} title="ประเภทของน้องสัตว์" subtitle="เลือกให้เหมาะกับน้องของคุณ" />
          <div className={styles.speciesGrid}>
            {(["dog", "cat"] as const).map((type) => <button key={type} className={`${styles.species} ${species === type ? styles.selected : ""}`} onClick={() => setSpecies(type)}>
              <div className={`${styles.petImage} ${type === "dog" ? portraitStyles.dogPortrait : portraitStyles.catPortrait}`}><Image src={type === "dog" ? "/images/choose_dog.webp" : "/images/choose_cat.webp"} alt="" fill sizes="320px" /></div>
              <span className={`${portraitStyles.speciesRadio} ${species === type ? portraitStyles.speciesRadioSelected : ""}`}>
                {species === type && <i />}
              </span>
              <div className={styles.petText}><strong>{type === "dog" ? "น้องสุนัข (Dog)" : "น้องแมว (Cat)"}</strong><small>{type === "dog" ? "เพื่อสุขภาพแข็งแรง ร่าเริง" : "เพื่อการดูแลที่ครบถ้วน"}</small></div>
            </button>)}
          </div>
        </div>

        <div className={styles.panel}>
          <StepTitle number={2} title="เลือกแพ็กเกจที่ใช่สำหรับน้อง" subtitle="ปรับแผนได้ตามความต้องการ" />
          <div className={styles.planList}>{plans.map((item) => <button key={item.name} style={{ "--package-accent": item.accent, "--package-tint": item.tint, "--package-image-tint": item.imageTint } as CSSProperties} className={`${styles.plan} ${packageStyles.packageCard} ${planName === item.name ? `${styles.planSelected} ${packageStyles.packageSelected}` : ""}`} onClick={() => setPlanName(item.name)}>
            <span className={`${styles.radio} ${packageStyles.packageRadio}`}>{planName === item.name && <i />}</span>
            <div className={`${styles.planImage} ${packageStyles.packageImage}`}><Image src={item.image} alt="" fill sizes="190px" /></div>
            <div className={styles.planCopy}><h3>{item.name} {item.name === "Paw-Fit" && <Crown size={20} />}</h3><p>{item.detail}</p><div>{item.features.map((feature) => <span key={feature}><Check size={12} />{feature}</span>)}</div></div>
            <div className={styles.price}><strong>฿{getPlanPrice(item).toLocaleString()}</strong><span>/ รอบส่ง</span><small>ทุก {item.days} วัน</small>{item.badge && <em>{item.badge}</em>}</div>
          </button>)}</div>
        </div>

        <div className={styles.panel}>
          <StepTitle number={3} title="เลือกเป้าหมายสุขภาพ" subtitle="เราจะปรับสูตรในแพ็กเกจให้เหมาะกับน้อง" />
          <div className={styles.focusGrid}>{goals.map((item, index) => <button key={item.title} className={focus === index ? styles.focusSelected : ""} onClick={() => setFocus(index)}>
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
            แพ็กเกจ {plan.name}
          </strong>
          <span className={packageStyles.selectedFocus}>เป้าหมาย: {selectedGoal.title}</span>
        </header>
        <div className={styles.heroBox}><Image src="/images/box4.webp" alt="กล่อง Porpaw" fill priority sizes="450px" /></div>
        <div className={styles.itemList}>{summaryItems.map((item) => <div className={styles.item} key={item[0]}>
          <div className={styles.itemImage}><Image src={item[3]} alt="" fill sizes="65px" /></div><span><strong>{item[0]}</strong><small>{item[1]}</small><small>{item[2]}</small></span><b>x{item[4]}</b>
        </div>)}</div>
        <div className={styles.delivery}><Truck /><span><strong>จัดส่งฟรีทั่วประเทศ</strong><small>ส่งทุก {plan.days} วัน • ปรับรอบส่งได้ก่อนจัดส่ง</small></span></div>
        <div className={styles.total}><span><b>รวมทั้งหมด</b><strong>฿{totalPrice.toLocaleString()} <small>/ รอบส่ง</small></strong><em>เฉลี่ยวันละ ฿{Math.round(totalPrice / plan.days)}</em></span><i>{plan.badge || "เริ่มง่าย"}</i></div>
        <button className={styles.lineButton} type="button" onClick={addPackageToCart}>เพิ่มแพ็กเกจลงตะกร้า <b><ShoppingCart size={15} /></b></button>
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
