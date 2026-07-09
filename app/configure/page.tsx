"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Crown, ShieldCheck, Truck, Phone, RefreshCw, ShoppingCart } from "lucide-react";
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
import { FORMULA_GOALS, MONTHLY_DELIVERY_DAYS, SUBSCRIPTION_TIERS } from "../lib/subscriptionPricing";

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
    SUBSCRIPTION_TIERS.some((item) => item.name === requestedPlan) ? requestedPlan! : "Plus",
  );
  const [focus, setFocus] = useState(0);
  const plan = useMemo(() => SUBSCRIPTION_TIERS.find((item) => item.name === planName) || SUBSCRIPTION_TIERS[1], [planName]);
  const getPlanPrice = (item: (typeof SUBSCRIPTION_TIERS)[number]) => item.price;
  const totalPrice = getPlanPrice(plan);
  const goals = FORMULA_GOALS;
  const selectedGoal = goals[focus];
  const summaryItems = [
    [
      `อาหารหลักเกรด ${plan.name}`,
      selectedGoal.formulaLabel,
      `จัดชุดอาหารตามสูตรสำหรับ ${MONTHLY_DELIVERY_DAYS} วัน`,
      species === "dog" ? "/images/food_dog.webp" : "/images/food_cat.webp",
      "1",
    ],
    ["ขนมเพื่อสุขภาพ", "ขนมปลาแซลมอนอบแห้ง", "80 g", "/images/snack1.webp", "1"],
    ["เสริมบำรุงผิวหนัง & ขน", "น้ำมันปลาแซลมอน", "100 ml", "/images/groom3.webp", "1"],
    ["ของเล่นเสริมพัฒนาการ", species === "dog" ? "เชือกกัด & ลูกบอลนุ่ม" : "บอลแคทนิป & ไม้มาทาทาบิ", "", "/images/toy2.webp", "2"],
  ];
  const addPackageToCart = () => {
    const packageKey = `${plan.name}|${species}|${selectedGoal.key}`;
    const packageId = Array.from(packageKey).reduce(
      (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
      1000,
    );
    if (Number.isFinite(editingPackageId) && editingPackageId > 0) removeItem(editingPackageId);
    addItem({
      id: packageId,
      name: `แพ็กเกจ ${plan.name} • ${selectedGoal.title}`,
      price: totalPrice,
      image: plan.image,
      petType: species,
      weight: `เกรด ${plan.name} • ${selectedGoal.title} • จัดส่งทุก ${MONTHLY_DELIVERY_DAYS} วัน`,
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
        handleLineLogin={() => { window.location.href = "https://line.me/R/ti/p/@zoomiedash"; }}
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
          <StepTitle number={2} title="เลือกเกรดอาหาร" subtitle="รอบส่งตายตัว 1 เดือน แยกราคาตามคุณภาพวัตถุดิบ" />
          <div className={styles.planList}>{SUBSCRIPTION_TIERS.map((item) => <button key={item.name} style={{ "--package-accent": item.accent, "--package-tint": item.tint, "--package-image-tint": item.imageTint } as CSSProperties} className={`${styles.plan} ${packageStyles.packageCard} ${planName === item.name ? `${styles.planSelected} ${packageStyles.packageSelected}` : ""}`} onClick={() => setPlanName(item.name)}>
            <span className={`${styles.radio} ${packageStyles.packageRadio}`}>{planName === item.name && <i />}</span>
            <div className={`${styles.planImage} ${packageStyles.packageImage}`}><Image src={item.image} alt="" fill sizes="190px" /></div>
            <div className={styles.planCopy}><h3>{item.name} {item.name === "Plus" && <Crown size={20} />}</h3><p>{item.detail}</p><div>{item.features.map((feature) => <span key={feature}><Check size={12} />{feature}</span>)}</div></div>
            <div className={styles.price}><strong>฿{getPlanPrice(item).toLocaleString()}</strong><span>/ เดือน</span><small>ส่งทุก {item.days} วัน</small>{item.badge && <em>{item.badge}</em>}</div>
          </button>)}</div>
        </div>

        <div className={styles.panel}>
          <StepTitle number={3} title="เลือกสูตรดูแล" subtitle="เลือกเป้าหมายสุขภาพแยกจากเกรดอาหาร" />
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
            เกรด {plan.name}
          </strong>
          <span className={packageStyles.selectedFocus}>สูตร: {selectedGoal.title} • รอบ 1 เดือน</span>
        </header>
        <div className={styles.heroBox}><Image src="/images/box4.webp" alt="กล่อง ZoomieDash" fill priority sizes="450px" /></div>
        <div className={styles.itemList}>{summaryItems.map((item) => <div className={styles.item} key={item[0]}>
          <div className={styles.itemImage}><Image src={item[3]} alt="" fill sizes="65px" /></div><span><strong>{item[0]}</strong><small>{item[1]}</small><small>{item[2]}</small></span><b>x{item[4]}</b>
        </div>)}</div>
        <div className={styles.delivery}><Truck /><span><strong>จัดส่งฟรีทั่วประเทศ</strong><small>ส่งทุก {MONTHLY_DELIVERY_DAYS} วัน • แก้สูตรได้ก่อนรอบถัดไป</small></span></div>
        <div className={styles.total}><span><b>รวมทั้งหมด</b><strong>฿{totalPrice.toLocaleString()} <small>/ เดือน</small></strong><em>เฉลี่ยวันละ ฿{Math.round(totalPrice / MONTHLY_DELIVERY_DAYS)}</em></span><i>{plan.badge || "เริ่มง่าย"}</i></div>
        <button className={styles.packageCartButton} type="button" onClick={addPackageToCart} aria-label={`เพิ่มแพ็กเกจ ${plan.name} สูตร ${selectedGoal.title} ลงตะกร้า`}>
          <span>
            <strong>เพิ่มแพ็กเกจลงตะกร้า</strong>
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
