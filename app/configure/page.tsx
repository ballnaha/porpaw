"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Crown, ShieldCheck, Sparkles, Truck, Phone, RefreshCw } from "lucide-react";
import styles from "./configure.module.css";
import portraitStyles from "./portrait.module.css";
import readabilityStyles from "./readability.module.css";
import packageStyles from "./packages.module.css";
import { Navbar } from "../components/Navbar";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../components/DesignSystem";

const plans = [
  { name: "Paw-Lite", detail: "ครบทุกมื้อ อร่อยได้ทุกวัน", price: 1590, daily: 53, image: "/images/package-lite.png", features: ["อาหารหลักคุณภาพสูง", "ขนมเพื่อสุขภาพ", "ส่งฟรีทั่วประเทศ"], badge: "ยอดนิยม", accent: "#f28b5b", tint: "#fff2e9", imageTint: "#ffe3d2" },
  { name: "Paw-Fit", detail: "ควบคุมน้ำหนัก สุขภาพดี", price: 1890, daily: 63, image: "/images/package-fit.png", features: ["ลดไขมัน", "โปรตีนคุณภาพ", "ช่วยควบคุมน้ำหนัก"], accent: "#64a77b", tint: "#eef8f0", imageTint: "#dff1e4" },
  { name: "Paw-Max", detail: "บำรุงครบ จบในแพ็กเดียว", price: 2290, daily: 76, image: "/images/package-max.png", features: ["เสริมภูมิ", "ขนเงาสวย", "ข้อ & กระดูกแข็งแรง"], badge: "ประหยัดที่สุด", accent: "#7774b9", tint: "#f2f1fb", imageTint: "#e5e3f7" },
  { name: "Paw-Mix", detail: "เลือกสินค้าเองได้ ตามใจน้อง", price: 1290, daily: 43, image: "/images/package-mix.png", features: ["อิสระเลือกสินค้า", "ยืดหยุ่น", "ปรับเปลี่ยนได้ทุกเดือน"], accent: "#d39a32", tint: "#fff8e7", imageTint: "#f8edc9" },
];

const focuses = [
  ["สุขภาพผิวหนัง & ขน", "ขนสวย ไม่ร่วง ผิวแข็งแรง", "/images/snack1.webp"],
  ["บำรุงข้อ & กระดูก", "เคลื่อนไหวคล่องแคล่ว", "/images/toy2.webp"],
  ["เสริมภูมิคุ้มกัน", "แข็งแรง ไม่ป่วยง่าย", "/images/groom3.webp"],
  ["ดูแลระบบย่อยอาหาร", "ย่อยง่าย ขับถ่ายเป็นก้อน", "/images/food_dog.webp"],
  ["หัวใจ & สมอง", "สายตาแจ่มใส สมองไว", "/images/snack1.webp"],
  ["ลดน้ำหนัก & คุมน้ำหนัก", "หุ่นดี สุขภาพดี", "/images/nutrition_dog.webp"],
];

function StepTitle({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return <div className={styles.stepTitle}><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>;
}

function Dashboard() {
  const search = useSearchParams();
  const [species, setSpecies] = useState<"dog" | "cat">((search.get("species") as "dog" | "cat") || "dog");
  const [planName, setPlanName] = useState(search.get("plan") || "Paw-Lite");
  const [focus, setFocus] = useState(0);
  const plan = useMemo(() => plans.find((item) => item.name === planName) || plans[0], [planName]);
  const summaryItems = [
    ["อาหารหลักคุณภาพสูง", "สูตรปลาแซลมอน", "1.5 kg", species === "dog" ? "/images/food_dog.webp" : "/images/food_cat.webp", "1"],
    ["ขนมเพื่อสุขภาพ", "ขนมปลาแซลมอนอบแห้ง", "80 g", "/images/snack1.webp", "1"],
    ["เสริมบำรุงผิวหนัง & ขน", "น้ำมันปลาแซลมอน", "100 ml", "/images/groom3.webp", "1"],
    ["ของเล่นเสริมพัฒนาการ", species === "dog" ? "เชือกกัด & ลูกบอลนุ่ม" : "บอลแคทนิป & ไม้มาทาทาบิ", "", "/images/toy2.webp", "2"],
  ];

  return <ThemeProvider theme={theme}>
    <Navbar
      handleLineLogin={() => { window.location.href = "https://line.me/R/ti/p/@porpaw"; }}
      isConnecting={false}
    />
    <main className={`${styles.page} ${readabilityStyles.readable}`}>
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
            <div className={styles.planCopy}><h3>{item.name} {item.name === "Paw-Lite" && <Crown size={20} />}</h3><p>{item.detail}</p><div>{item.features.map((feature) => <span key={feature}><Check size={12} />{feature}</span>)}</div></div>
            <div className={styles.price}><strong>฿{item.price.toLocaleString()}</strong><span>/ เดือน</span><small>เฉลี่ยวันละ ฿{item.daily}</small>{item.badge && <em>{item.badge}</em>}</div>
          </button>)}</div>
        </div>

        <div className={styles.panel}>
          <StepTitle number={3} title="สูตรอาหาร & การบำรุงเฉพาะจุด" subtitle="เสริมสุขภาพตรงจุด น้องแข็งแรงในแบบของน้อง" />
          <div className={styles.focusGrid}>{focuses.map((item, index) => <button key={item[0]} className={focus === index ? styles.focusSelected : ""} onClick={() => setFocus(index)}>
            <div><Image src={item[2]} alt="" fill sizes="90px" /></div><span><strong>{item[0]}</strong><small>{item[1]}</small></span>
          </button>)}</div>
        </div>
      </section>

      <aside className={styles.summary}>
        <header>
          <p><Sparkles size={15} /> WHAT&apos;S IN YOUR BOX</p>
          <h1>เซ็ตกล่องลายน้อง</h1>
          <strong
            className={packageStyles.selectedPackage}
            style={{ "--package-accent": plan.accent, "--package-tint": plan.tint } as CSSProperties}
          >
            แพ็กเกจ {plan.name}
          </strong>
          <span className={packageStyles.selectedFocus}>สูตรที่เลือก: {focuses[focus][0]}</span>
        </header>
        <div className={styles.heroBox}><Image src="/images/box4.webp" alt="กล่อง Porpaw" fill priority sizes="450px" /></div>
        <div className={styles.itemList}>{summaryItems.map((item) => <div className={styles.item} key={item[0]}>
          <div className={styles.itemImage}><Image src={item[3]} alt="" fill sizes="65px" /></div><span><strong>{item[0]}</strong><small>{item[1]}</small><small>{item[2]}</small></span><b>x{item[4]}</b>
        </div>)}</div>
        <div className={styles.delivery}><Truck /><span><strong>จัดส่งฟรีทั่วประเทศ</strong><small>ส่งทุก 15 วัน • ปรับเปลี่ยนได้ตลอดเวลา</small></span></div>
        <div className={styles.total}><span><b>รวมทั้งหมด</b><strong>฿{plan.price.toLocaleString()} <small>/ เดือน</small></strong><em>เฉลี่ยวันละ ฿{plan.daily}</em></span><i>ประหยัดกว่า 15%</i></div>
        <a className={styles.lineButton} href="https://line.me/R/ti/p/@porpaw">สั่งซื้อแพ็กเกจนี้ผ่าน LINE <b>LINE</b></a>
      </aside>
      <div className={styles.trust}>
        <span><ShieldCheck /><b>ปลอดภัย 100%<small>ชำระเงินปลอดภัย</small></b></span>
        <span><RefreshCw /><b>รับประกันความพอใจ<small>คืนเงินภายใน 7 วัน</small></b></span>
        <span><Phone /><b>ปรึกษาผู้เชี่ยวชาญ<small>นักโภชนาการสัตว์เลี้ยง</small></b></span>
      </div>
    </div>
    </main>
  </ThemeProvider>;
}

export default function ConfigurePage() {
  return <Suspense><Dashboard /></Suspense>;
}
