"use client";

import React, { useState, useEffect } from "react";
import { 
  PawPrint, 
  Calendar, 
  Gift, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShoppingBag, 
  Info,
  Check,
  RotateCcw,
  User,
  MapPin,
  CreditCard,
  Bell,
  Search,
  Heart,
  Plus,
  Briefcase,
  Compass,
  MessageSquare,
  Scissors,
  Home as HomeIcon,
  Phone,
  HelpCircle,
  LogOut,
  Shield,
  Clock,
  ExternalLink,
  Menu,
  X,
  Compass as CompassIcon
} from "lucide-react";
import GuestLandingPage from "./components/GuestLandingPage";

// ข้อมูลตัวละครทั้ง 10 ตัว
const PET_COMPANIONS = [
  {
    id: 1,
    name: "เต้าหู้",
    type: "สุนัขพันธุ์เวลช์ คอร์กี้ 🐕",
    desc: "สายพันธุ์เวลช์ คอร์กี้ คาร์ดิแกน ขาสั้น ตัวยาว คล่องแคล่ว",
    trait: "เป็นมิตร อารมณ์ดี พลังงานปานกลาง ต้องการการดูแลไขข้อช่วงเอวเป็นพิเศษ",
    favorite: "สูตรอกไก่และผักใบเขียวบำรุงกล้ามเนื้อ",
    avatarBg: "#FFFDF0",
    kcal: 580,
    status: "สูตรแนะนำ: ควบคุมน้ำหนัก & ไขข้อช่วงเอว 🦴"
  },
  {
    id: 2,
    name: "คุโระ",
    type: "สุนัขพันธุ์ชิบะอินุ 🐕",
    desc: "ชิบะอินุแท้ ขนสองชั้นหนา ปราดเปรียวและรักความสะอาด",
    trait: "ฉลาดเป็นกรด รักการผจญภัยเงียบๆ ต้องการอาหารโปรตีนสูงเพื่อกล้ามเนื้อที่แข็งแรง",
    favorite: "สูตรปลาแซลมอนสดบำรุงเส้นขนหนา",
    avatarBg: "#FFE8D6",
    kcal: 480,
    status: "สูตรแนะนำ: โปรตีนเข้มข้นบำรุงเส้นขนสองชั้น 🌾"
  },
  {
    id: 3,
    name: "โมจิ",
    type: "แมวสายพันธุ์เปอร์เซีย 🐈",
    desc: "เปอร์เซียขนยาว หน้าบี้หัก แก้มแน่น นุ่มฟูสะดุดตา",
    trait: "รักความสงบ นอนเก่ง ขี้อ้อน ต้องการอาหารสูตรขจัดก้อนขนและดูแลระบบทางเดินอาหาร",
    favorite: "สูตรเนื้อแกะนิวซีแลนด์ย่อยง่ายลดคราบน้ำตา",
    avatarBg: "#FFE4E6",
    kcal: 240,
    status: "สูตรแนะนำ: ป้องกันก้อนขนสะสม & บำรุงผิวหนัง 🐈‍⬛"
  },
  {
    id: 4,
    name: "เบลล่า",
    type: "สุนัขพันธุ์โกลเด้น รีทรีฟเวอร์ 🐕",
    desc: "โกลเด้นขนยาวสีทองอร่าม โครงสร้างใหญ่ กระดูกและข้อต่อแข็งแรง",
    trait: "รักการเล่นน้ำ แข็งแรง พลังงานสูงมาก ต้องการอาหารบาร์ฟสดสูตรควบคุมปริมาณแคลเซียมและฟอสฟอรัส",
    favorite: "สูตรเนื้อวัวบดหยาบผสมกระดูกอ่อนบำรุงข้อ",
    avatarBg: "#FFFBEB",
    kcal: 980,
    status: "สูตรแนะนำ: เสริมสร้างข้อต่อ & พลังงานสูง 💪"
  },
  {
    id: 5,
    name: "ลาเต้",
    type: "แมวสายพันธุ์บริติช ช็อตแฮร์ 🐈",
    desc: "บริติชช็อตแฮร์สีเทาบลู ขนสั้นหนาแน่นเหมือนพรม แก้มกลมยุ้ย",
    trait: "สุภาพเรียบร้อย เป็นมิตร รักสงบ อัตราเผาผลาญค่อนข้างต่ำ ต้องการอาหารควบคุมแคลอรี่",
    favorite: "สูตรแซลมอนและมันฝรั่งหวานบำรุงสายตา",
    avatarBg: "#F1F5F9",
    kcal: 260,
    status: "สูตรแนะนำ: ควบคุมน้ำหนัก & รักษาสมดุลกล้ามเนื้อ 🥩"
  },
  {
    id: 6,
    name: "บัตเตอร์",
    type: "สุนัขพันธุ์เฟรนช์ บูลด็อก 🐕",
    desc: "เฟรนช์บูลด็อกหูค้างคาว ล่ำสัน ขนสั้นเกลี้ยง",
    trait: "ร่าเริง ขี้เล่น อารมณ์ดี ผิวหนังบอบบางแพ้ง่าย ต้องการสารอาหารบำรุงขนและลดอาการแพ้",
    favorite: "สูตรเนื้อแกะและแอปเปิ้ลลดผื่นแพ้ผิวหนัง",
    avatarBg: "#FAF6F0",
    kcal: 380,
    status: "สูตรแนะนำ: เสริมเกราะป้องกันผิวหนังแพ้ง่าย 🩺"
  },
  {
    id: 7,
    name: "ถ้วยฟู",
    type: "สุนัขพันธุ์ปอมเมอเรเนียน 🐕",
    desc: "ปอมเมอเรเนียนไซส์ทอย ขนฟูฟ่องเหมือนสำลี ขี้เล่นรวดเร็ว",
    trait: "กระตือรือร้น เฝ้าบ้านเก่ง รวดเร็วว่องไว ต้องการพลังงานหนาแน่นในถ้วยขนาดเล็ก",
    favorite: "สูตรอกไก่บดละเอียดผสมฟักทองนึ่ง",
    avatarBg: "#FFF9E6",
    kcal: 180,
    status: "สูตรแนะนำ: บำรุงขนยาวฟูนุ่ม & ดูแลสุขภาพหัวใจ ❤️"
  },
  {
    id: 8,
    name: "ยูกิ",
    type: "แมวสายพันธุ์วิเชียรมาศ 🐈",
    desc: "แมวไทยมงคล แต้มสีเข้ม 9 จุด ดวงตาสีฟ้าครามสดใส",
    trait: "แสนรู้ พูดเก่ง ติดเจ้าของ รักความสะอาดอย่างยิ่ง ต้องการสูตรบำรุงสายตาและระบบทางเดินปัสสาวะ",
    favorite: "สูตรปลาเนื้อขาวและแครนเบอร์รี่ดูแลระบบปัสสาวะ",
    avatarBg: "#FFFDF0",
    kcal: 220,
    status: "สูตรแนะนำ: ป้องกันระบบทางเดินปัสสาวะอักเสบ 💧"
  },
  {
    id: 9,
    name: "บราวนี่",
    type: "สุนัขพันธุ์พุดเดิ้ล 🐕",
    desc: "พุดเดิ้ลทอยขนหยิกสีช็อกโกแลต ไม่ร่วงง่าย ฉลาดเป็นเลิศ",
    trait: "เข้ากับคนง่าย เรียนรู้เร็ว ช่างประจบ ต้องการโภชนาการดูแลสุขภาพสายตาและสมอง",
    favorite: "สูตรเนื้อไก่งวงและเบอร์รี่รวมต้านอนุมูลอิสระ",
    avatarBg: "#E8D9CE",
    kcal: 210,
    status: "สูตรแนะนำ: บำรุงสายตา & เสริมการทำงานของสมอง 🧠"
  },
  {
    id: 10,
    name: "ชาไทย",
    type: "สุนัขพันธุ์บีเกิ้ล 🐕",
    desc: "บีเกิ้ลสามสี หูตูบยาว จมูกไวเป็นเลิศ พลังดมกลิ่นสูง",
    trait: "นักสำรวจพลังงานไม่มีวันหมด กินเก่งมากเป็นพิเศษ ต้องการอาหารแคลอรี่สมดุลเพื่อควบคุมน้ำหนัก",
    favorite: "สูตรเนื้อปลาทูน่าบดและใยอาหารธรรมชาติควบคุมความหิว",
    avatarBg: "#FFF3E0",
    kcal: 490,
    status: "สูตรแนะนำ: ใยอาหารสูงควบคุมความหิวและน้ำหนัก 🐕‍🦺"
  }
];

// ข้อมูลสูตรอาหาร
const RECIPES = [
  {
    id: "r1",
    name: "สูตรทุ่งหญ้าสลัว",
    desc: "อกไก่ออร์แกนิกและผักใบเขียวบดละเอียด",
    benefit: "โปรตีนสูงย่อยง่าย เสริมสร้างกล้ามเนื้อและระบบทางเดินอาหาร",
    price: 690,
    tag: "ยอดนิยม",
    color: "bg-[#F3FAF0] border-[#A8D39E] text-[#4F6457]"
  },
  {
    id: "r2",
    name: "สูตรรสทะเลสีคราม",
    desc: "ปลาแซลมอนแอตแลนติกสดและมันฝรั่งหวานญี่ปุ่น",
    benefit: "อุดมไปด้วยโอเมก้า 3 และ 6 บำรุงขนให้นุ่มฟูสวยงามและลดผิวแห้ง",
    price: 790,
    tag: "บำรุงขนผิวหนัง",
    color: "bg-[#F2FAFD] border-[#9ED2E6] text-[#256370]"
  },
  {
    id: "r3",
    name: "สูตรหุบเขาสายลม",
    desc: "เนื้อแกะนิวซีแลนด์เกรดพรีเมียมและแอปเปิ้ลแดงสด",
    benefit: "สูตรลดอาการแพ้ เหมาะสำหรับสัตว์เลี้ยงที่ผิวแพ้ง่ายมาก",
    price: 850,
    tag: "ผิวแพ้ง่าย",
    color: "bg-[#FFF9F5] border-[#E8C0A8] text-ink"
  }
];

// ข้อมูลขนมแถมเพิ่มเติม
const TREATS = [
  { id: "t1", name: "หญ้าแมวอบกรอบ/คุกกี้ขัดฟันมิมิ", price: 120, icon: "🌾" },
  { id: "t2", name: "เนื้ออบแห้งเกรดพรีเมียม", price: 180, icon: "🥩" },
  { id: "t3", name: "มันหวานหนึบสูตรคาปี้บำรุงไขข้อ", price: 140, icon: "🍠" }
];

// ความถี่ในการส่ง
const FREQUENCIES = [
  { id: "weekly", label: "ทุกสัปดาห์", discount: 0.15, text: "รับส่วนลด 15%" },
  { id: "biweekly", label: "ทุก 2 สัปดาห์", discount: 0.10, text: "รับส่วนลด 10%" },
  { id: "monthly", label: "รายเดือน", discount: 0.05, text: "รับส่วนลด 5%" }
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // สถานะล็อกอิน
  const [isConnecting, setIsConnecting] = useState(false); // แอนิเมชันล็อกอิน
  const [activeTab, setActiveTab] = useState<"home" | "services" | "shop" | "contact">("home");
  
  // ข้อมูลโปรไฟล์จาก LINE LIFF
  const [lineProfile, setLineProfile] = useState({
    displayName: "อเล็กซ์ (Alex)",
    statusMessage: "รักหมาคอร์กี้สุดใจ 🐕",
    pictureUrl: "🦊"
  });

  const [isLiked, setIsLiked] = useState(false);
  const [isApptBooked, setIsApptBooked] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [calcWeight, setCalcWeight] = useState("5");
  const [calcType, setCalcType] = useState<"dog" | "cat">("dog");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // คำนวณพลังงาน RER และขยับหลอด HP ตามค่าน้ำหนักจริงเพื่อกิมมิคของเกม
  const weight = parseFloat(calcWeight) || 0;
  const calcResult = weight <= 0 ? 0 : Math.round(Math.round(70 * Math.pow(weight, 0.75)) * (calcType === "dog" ? 1.6 : 1.2));
  const statHp = Math.min(100, Math.max(30, Math.round(weight * 8)));

  // สเตตัสการแต่งตัวฮีโร่สัตว์เลี้ยง (Game Character Customizer)
  const [selectedHat, setSelectedHat] = useState<string>("none"); // none, straw, red, scarf
  const [selectedBag, setSelectedBag] = useState<string>("none"); // none, orange, green, red
  const [rotationDeg, setRotationDeg] = useState<number>(0); // องศาหมุนโมเดลตัวละคร

  // สเตตัสอาชีพในเกม (Character Classes)
  const [selectedClass, setSelectedClass] = useState<"warrior" | "mage" | "explorer">("explorer");

  // ปรับหลอดพลังจิต MP และความไว Speed ตามอาชีพที่เลือก
  const statMp = selectedClass === "warrior" ? 30 : selectedClass === "mage" ? 95 : 65;
  const statSpeed = selectedClass === "warrior" ? 60 : selectedClass === "mage" ? 50 : 90;

  // สัตว์เลี้ยงของเจ้าของที่ลงทะเบียนไว้แล้ว (เคยลงทะเบียนไว้)
  const [myPets, setMyPets] = useState([
    {
      id: 1,
      name: "คุโระ",
      breed: "แมวดำแว่นส้ม 🐈‍⬛",
      age: "2 ปี 4 เดือน",
      weight: "4.5 กิโลกรัม",
      kcalTarget: 220,
      currentPlan: "สูตรรสทะเลสีคราม (ส่งทุก 2 สัปดาห์)",
      nextDelivery: "7 ก.ค. 2026",
      avatarBg: "#FFF8F2",
      class: "นักเวทย์ 🔮",
      hat: "red",
      bag: "green"
    },
    {
      id: 4,
      name: "โมจิ",
      breed: "แมวเทาเสื้อชมพู 🐈",
      age: "1 ปี 8 เดือน",
      weight: "3.8 กิโลกรัม",
      kcalTarget: 240,
      currentPlan: "สูตรทุ่งหญ้าสลัว (ส่งรายเดือน)",
      nextDelivery: "15 ก.ค. 2026",
      avatarBg: "#FFF5F7",
      class: "นักสำรวจ 🗺️",
      hat: "straw",
      bag: "orange"
    }
  ]);

  // ข้อมูลแผนสมาชิกจำลอง
  const [activeSubscriptions, setActiveSubscriptions] = useState([
    {
      id: "sub-1",
      pet: PET_COMPANIONS[0], 
      recipe: RECIPES[1], 
      frequency: FREQUENCIES[1], 
      treats: ["t1"],
      price: 819,
      nextDelivery: "7 กรกฎาคม 2026",
      status: "กำลังจัดเตรียมสินค้า"
    }
  ]);

  const [step, setStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState(PET_COMPANIONS[0]);
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0]);
  const [selectedFrequency, setSelectedFrequency] = useState(FREQUENCIES[1]);
  const [selectedTreats, setSelectedTreats] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); 
  const [couponStatus, setCouponStatus] = useState<"none" | "success" | "invalid">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeStoryPet, setActiveStoryPet] = useState<typeof PET_COMPANIONS[0] | null>(null);

  const handleLineLogin = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsLoggedIn(true);
      setActiveTab("home"); 
    }, 1200);
  };

  const handleLineLogout = () => {
    setIsLoggedIn(false);
    setCartCount(0);
  };

  // วาดไอเทมเสริมเสื้อผ้า (หมวกและกระเป๋าเป้) ลงบน SVG ตัวละคร
  const renderAccessories = (hat: string, bag: string) => {
    return (
      <>
        {/* Render Bags */}
        {bag === "orange" && (
          <rect x="18" y="58" width="18" height="22" rx="4" fill="#DEA36C" stroke="#322B24" strokeWidth="1.5" />
        )}
        {bag === "green" && (
          <rect x="18" y="58" width="18" height="22" rx="4" fill="#9F9F8B" stroke="#322B24" strokeWidth="1.5" />
        )}
        {bag === "red" && (
          <rect x="18" y="58" width="18" height="22" rx="4" fill="#DE7A6C" stroke="#322B24" strokeWidth="1.5" />
        )}

        {/* Render Hats */}
        {hat === "straw" && (
          <g>
            <path d="M 12 30 Q 50 14 88 30 L 80 35 Q 50 25 20 35 Z" fill="#EAD5B3" stroke="#322B24" strokeWidth="1.5" />
            <rect x="35" y="22" width="30" height="8" rx="2" fill="#DEA36C" stroke="#322B24" strokeWidth="1" />
          </g>
        )}
        {hat === "red" && (
          <g>
            <path d="M 22 28 Q 50 10 78 28 L 84 33 Q 50 24 16 33 Z" fill="#DE7A6C" stroke="#322B24" strokeWidth="1.5" />
            <circle cx="50" cy="20" r="3" fill="#FFF" stroke="#322B24" strokeWidth="1" />
          </g>
        )}
        {hat === "scarf" && (
          <g>
            <path d="M 28 64 Q 50 78 72 64 Q 50 69 28 64 Z" fill="#9F9F8B" stroke="#322B24" strokeWidth="1.5" />
            <path d="M 64 64 L 69 82 L 77 78 Z" fill="#9F9F8B" stroke="#322B24" strokeWidth="1" />
          </g>
        )}
      </>
    );
  };

  // วาดสัตว์เลี้ยงแบบ Vector สำหรับ 10 ตัวละครหลัก พร้อมรองรับชุดแต่งตัวและทิศทางหมุน
  const renderPetIcon = (id: number, hatOverride?: string, bagOverride?: string, rotateOverride?: number) => {
    const hat = hatOverride || (id === selectedPet.id ? selectedHat : "none");
    const bag = bagOverride || (id === selectedPet.id ? selectedBag : "none");
    const rotate = rotateOverride !== undefined ? rotateOverride : (id === selectedPet.id ? rotationDeg : 0);

    const transformStyle = {
      transform: `rotate(${rotate}deg)`,
      transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    };

    const baseIcon = () => {
      switch (id) {
        case 1:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <ellipse cx="50" cy="55" rx="30" ry="25" fill="#322B24" />
              <polygon points="25,40 30,15 45,35" fill="#322B24" />
              <polygon points="75,40 70,15 55,35" fill="#322B24" />
              <circle cx="38" cy="55" r="11" fill="none" stroke="#DEA36C" strokeWidth="3" />
              <circle cx="62" cy="55" r="11" fill="none" stroke="#DEA36C" strokeWidth="3" />
              <line x1="49" y1="55" x2="51" y2="55" stroke="#DEA36C" strokeWidth="3" />
              <circle cx="38" cy="55" r="3" fill="#FFF" />
              <circle cx="62" cy="55" r="3" fill="#FFF" />
              <polygon points="48,60 52,60 50,63" fill="#F2D5CB" />
              <rect x="30" y="70" width="40" height="15" rx="4" fill="#DEA36C" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 2:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="55" r="28" fill="#784F33" />
              <circle cx="30" cy="32" r="10" fill="#784F33" />
              <circle cx="70" cy="32" r="10" fill="#784F33" />
              <circle cx="30" cy="32" r="5" fill="#FDFBF7" />
              <circle cx="70" cy="32" r="5" fill="#FDFBF7" />
              <ellipse cx="50" cy="62" rx="14" ry="10" fill="#FDFBF7" />
              <circle cx="44" cy="53" r="3" fill="#322B24" />
              <circle cx="56" cy="53" r="3" fill="#322B24" />
              <polygon points="47,59 53,59 50,62" fill="#322B24" />
              <path d="M 28 65 Q 50 82 72 65 Q 50 72 28 65 Z" fill="#DEA36C" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 3:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <ellipse cx="50" cy="58" rx="28" ry="24" fill="#FFFFFF" stroke="#322B24" strokeWidth="1" />
              <polygon points="28,45 28,25 40,42" fill="#FFFFFF" stroke="#322B24" strokeWidth="1" />
              <polygon points="72,45 72,25 60,42" fill="#FFFFFF" stroke="#322B24" strokeWidth="1" />
              <ellipse cx="40" cy="55" rx="8" ry="6" fill="#322B24" opacity="0.15" />
              <circle cx="40" cy="55" r="3" fill="#322B24" />
              <circle cx="60" cy="55" r="3" fill="#322B24" />
              <polygon points="48,60 52,60 50,62" fill="#F2D5CB" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 4:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="55" r="26" fill="#A0A0A0" />
              <polygon points="28,40 25,18 42,36" fill="#A0A0A0" />
              <polygon points="72,40 75,18 58,36" fill="#A0A0A0" />
              <circle cx="40" cy="53" r="3" fill="#322B24" />
              <circle cx="60" cy="53" r="3" fill="#322B24" />
              <polygon points="48,58 52,58 50,61" fill="#F2D5CB" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 5:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <ellipse cx="38" cy="24" rx="6" ry="18" fill="#9F9F8B" />
              <ellipse cx="62" cy="24" rx="6" ry="18" fill="#9F9F8B" />
              <circle cx="50" cy="58" r="24" fill="#E5D3BD" stroke="#322B24" strokeWidth="1" />
              <circle cx="42" cy="56" r="3" fill="#322B24" />
              <circle cx="58" cy="56" r="3" fill="#322B24" />
              <polygon points="48,62 52,62 50,64" fill="#F2D5CB" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 6:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="35" cy="40" r="10" fill="#FDFBF7" />
              <circle cx="50" cy="35" r="11" fill="#FDFBF7" />
              <circle cx="65" cy="40" r="10" fill="#FDFBF7" />
              <circle cx="50" cy="58" r="22" fill="#FAF6F0" stroke="#E5D3BD" strokeWidth="1" />
              <circle cx="40" cy="56" r="8" fill="none" stroke="#DEA36C" strokeWidth="2" />
              <circle cx="60" cy="56" r="8" fill="none" stroke="#DEA36C" strokeWidth="2" />
              <circle cx="40" cy="56" r="2.5" fill="#322B24" />
              <circle cx="60" cy="56" r="2.5" fill="#322B24" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 7:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="54" r="26" fill="#8E7C71" />
              <ellipse cx="50" cy="54" rx="20" ry="16" fill="#E5D3BD" />
              <circle cx="40" cy="54" r="3" fill="#322B24" />
              <circle cx="60" cy="54" r="3" fill="#322B24" />
              <ellipse cx="50" cy="58" rx="4" ry="3" fill="#322B24" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 8:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 30 65 L 30 45 C 30 35 40 30 60 30 C 72 30 75 35 75 48 C 75 60 70 65 55 65 Z" fill="#DEA36C" stroke="#322B24" strokeWidth="1" />
              <circle cx="64" cy="42" r="3.5" fill="#322B24" />
              <circle cx="34" cy="38" r="4" fill="#322B24" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 9:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="54" r="26" fill="#856046" />
              <ellipse cx="50" cy="58" rx="16" ry="11" fill="#EAD8CC" />
              <circle cx="39" cy="52" r="9" fill="none" stroke="#222" strokeWidth="1.5" />
              <circle cx="61" cy="52" r="9" fill="none" stroke="#222" strokeWidth="1.5" />
              <circle cx="39" cy="52" r="2" fill="#222" />
              <circle cx="61" cy="52" r="2" fill="#222" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        case 10:
          return (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="55" r="26" fill="#FFFFFF" stroke="#322B24" strokeWidth="1" />
              <path d="M 28 42 C 28 35 38 35 44 44 Z" fill="#DEA36C" />
              <path d="M 72 42 C 72 35 62 35 56 44 Z" fill="#322B24" />
              <circle cx="38" cy="54" r="8" fill="none" stroke="#DEA36C" strokeWidth="1.5" />
              <circle cx="62" cy="54" r="8" fill="none" stroke="#DEA36C" strokeWidth="1.5" />
              {renderAccessories(hat, bag)}
            </svg>
          );
        default:
          return <div className="w-10 h-10 bg-cream-dark rounded-full flex items-center justify-center">🐾</div>;
      }
    };

    return (
      <div style={transformStyle} className="w-full h-full">
        {baseIcon()}
      </div>
    );
  };

  const toggleTreat = (treatId: string) => {
    if (selectedTreats.includes(treatId)) {
      setSelectedTreats(selectedTreats.filter(id => id !== treatId));
    } else {
      setSelectedTreats([...selectedTreats, treatId]);
    }
  };

  const handleApplyCoupon = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "ลดสิบ" || code === "WHATDADOG") {
      setAppliedDiscount(0.10); 
      setCouponStatus("success");
    } else {
      setCouponStatus("invalid");
      setTimeout(() => setCouponStatus("none"), 3000);
    }
  };

  const calculateSubtotal = () => {
    return selectedRecipe.price + selectedTreats.reduce((sum, treatId) => {
      const treat = TREATS.find(t => t.id === treatId);
      return sum + (treat ? treat.price : 0);
    }, 0);
  };

  const getDiscountAmount = (subtotal: number) => {
    const freqDiscount = subtotal * selectedFrequency.discount;
    const extraDiscount = subtotal * appliedDiscount;
    return freqDiscount + extraDiscount;
  };

  const getFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = getDiscountAmount(subtotal);
    return Math.max(0, subtotal - discount);
  };

  const handleStartSubscription = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      
      const newSub = {
        id: `sub-${Date.now()}`,
        pet: selectedPet,
        recipe: selectedRecipe,
        frequency: selectedFrequency,
        treats: [...selectedTreats],
        price: getFinalTotal(),
        nextDelivery: selectedFrequency.id === "weekly" ? "ในอีก 7 วัน" : selectedFrequency.id === "biweekly" ? "ในอีก 14 วัน" : "ในอีก 30 วัน",
        status: "กำลังจัดเตรียมสินค้า"
      };

      // บันทึกโปรไฟล์สัตว์เลี้ยงตัวใหม่
      const petExists = myPets.some(p => p.id === selectedPet.id);
      if (!petExists) {
        const newPetObj = {
          id: selectedPet.id,
          name: selectedPet.name,
          breed: selectedPet.type,
          age: "1 ปี (ลงทะเบียนใหม่)",
          weight: `${calcWeight} กิโลกรัม`,
          kcalTarget: selectedPet.kcal,
          currentPlan: `${selectedRecipe.name} (ส่ง${selectedFrequency.label})`,
          nextDelivery: newSub.nextDelivery,
          avatarBg: selectedPet.avatarBg,
          class: selectedClass === "warrior" ? "นักรบ ⚔️" : selectedClass === "mage" ? "นักเวทย์ 🔮" : "นักสำรวจ 🗺️",
          hat: selectedHat,
          bag: selectedBag
        };
        setMyPets([...myPets, newPetObj]);
      }
      
      setActiveSubscriptions([newSub, ...activeSubscriptions]);
      setShowSuccessModal(true);
    }, 1200);
  };

  const handleCancelSub = (subId: string) => {
    setActiveSubscriptions(activeSubscriptions.filter(s => s.id !== subId));
  };

  const renderGoldenDog = () => {
    return (
      <svg className="w-full h-full object-contain max-h-[140px]" viewBox="0 0 100 100">
        <path d="M 22 25 Q 12 35 18 55 Q 26 50 25 35 Z" fill="#DEA36C" stroke="#322B24" strokeWidth="1.5" />
        <path d="M 78 25 Q 88 35 82 55 Q 74 50 75 35 Z" fill="#DEA36C" stroke="#322B24" strokeWidth="1.5" />
        <ellipse cx="50" cy="45" rx="30" ry="26" fill="#E5D3BD" stroke="#322B24" strokeWidth="1.5" />
        <path d="M 46 20 Q 50 35 50 48 Q 54 35 54 20 Z" fill="#FDFBF7" />
        <ellipse cx="50" cy="54" rx="16" ry="12" fill="#FDFBF7" stroke="#322B24" strokeWidth="1.5" />
        <circle cx="38" cy="40" r="3.5" fill="#322B24" />
        <circle cx="62" cy="40" r="3.5" fill="#322B24" />
        <path d="M 44 50 Q 50 46 56 50 Q 50 56 44 50 Z" fill="#322B24" />
        <path d="M 44 58 Q 50 66 56 58" stroke="#322B24" strokeWidth="1.5" fill="none" />
        <path d="M 46 59 Q 50 72 54 59 Z" fill="#F2D5CB" stroke="#322B24" strokeWidth="1" />
      </svg>
    );
  };

  const renderVetAndPets = () => {
    return (
      <svg className="w-full h-full object-contain max-h-[150px]" viewBox="0 0 200 130">
        <circle cx="100" cy="75" r="50" fill="#FCFAF5" />
        <g transform="translate(30, 45)">
          <ellipse cx="20" cy="45" rx="12" ry="18" fill="#E5D3BD" stroke="#322B24" strokeWidth="1" />
          <circle cx="20" cy="25" r="10" fill="#E5D3BD" stroke="#322B24" strokeWidth="1" />
          <polygon points="12,18 10,6 20,16" fill="#E5D3BD" stroke="#322B24" strokeWidth="1" />
          <polygon points="28,18 30,6 20,16" fill="#E5D3BD" stroke="#322B24" strokeWidth="1" />
          <circle cx="17" cy="24" r="1.5" fill="#322B24" />
          <circle cx="23" cy="24" r="1.5" fill="#322B24" />
        </g>
        <g transform="translate(68, 40)">
          <ellipse cx="25" cy="50" rx="18" ry="24" fill="#DEA36C" stroke="#322B24" strokeWidth="1" />
          <circle cx="25" cy="26" r="14" fill="#DEA36C" stroke="#322B24" strokeWidth="1" />
          <circle cx="20" cy="24" r="2" fill="#322B24" />
          <circle cx="30" cy="24" r="2" fill="#322B24" />
          <ellipse cx="25" cy="30" rx="6" ry="4" fill="#FDFBF7" />
          <polygon points="23,28 27,28 25,30" fill="#322B24" />
          <path d="M 22 31 Q 25 38 28 31" fill="#F2D5CB" stroke="#322B24" strokeWidth="1" />
        </g>
        <g transform="translate(108, 20)">
          <circle cx="35" cy="30" r="18" fill="#322B24" />
          <path d="M 15 70 Q 35 55 55 70 L 60 110 L 10 110 Z" fill="#FFF" stroke="#322B24" strokeWidth="1" />
          <path d="M 28 70 L 35 88 L 42 70 Z" fill="#9F9F8B" />
          <circle cx="35" cy="40" r="14" fill="#FCE3D2" stroke="#322B24" strokeWidth="1" />
          <ellipse cx="29" cy="38" rx="1.5" ry="1" fill="#322B24" />
          <ellipse cx="41" cy="38" rx="1.5" ry="1" fill="#322B24" />
          <path d="M 31 46 Q 35 50 39 46" stroke="#322B24" strokeWidth="1" fill="none" />
          <path d="M 10 80 Q 25 85 30 72" stroke="#FCE3D2" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  };

  const renderShibaGreeting = () => {
    return (
      <svg className="w-full h-full object-contain" viewBox="0 0 100 100">
        <path d="M 65 50 Q 80 15 90 40 Z" fill="#D3E2D7" />
        <polygon points="25,48 14,20 36,36" fill="#DEA36C" stroke="#322B24" strokeWidth="1.5" />
        <polygon points="23,43 17,25 31,34" fill="#F2D5CB" />
        <polygon points="65,48 76,20 54,36" fill="#DEA36C" stroke="#322B24" strokeWidth="1.5" />
        <polygon points="63,43 71,25 57,34" fill="#F2D5CB" />
        <ellipse cx="45" cy="56" rx="24" ry="20" fill="#DEA36C" stroke="#322B24" strokeWidth="1.5" />
        <ellipse cx="32" cy="62" rx="10" ry="8" fill="#FDFBF7" />
        <ellipse cx="58" cy="62" rx="10" ry="8" fill="#FDFBF7" />
        <circle cx="45" cy="63" r="8" fill="#FDFBF7" />
        <circle cx="33" cy="52" r="3" fill="#322B24" />
        <circle cx="57" cy="52" r="3" fill="#322B24" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#322B24] flex flex-col w-full antialiased font-sans select-none pb-12 sm:pb-0">
      
      {!isLoggedIn ? (
        <GuestLandingPage
          handleLineLogin={handleLineLogin}
          isConnecting={isConnecting}
        />
      ) : (
        
        /* 🟢 MEMBER MODE: WEB APP CONSOLE DASHBOARD (3D PIXAR GAME STYLE) */
        <div className="flex-1 flex flex-col w-full">
          
          {/* Header */}
          <header className="sticky top-0 bg-[#FDFBF7] border-b-2 border-[#322B24] px-4 sm:px-8 py-3.5 flex justify-between items-center z-30 shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#9F9F8B] flex items-center justify-center border border-[#322B24] shadow-sm">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-title text-lg font-bold leading-none">WhatDaDog Console</h1>
                <span className="text-[10px] text-[#9F9F8B] font-bold uppercase tracking-wider block mt-0.5">สมาชิกเกมเมอร์ 🟢</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline text-xs text-[#6A5C50] font-bold">
                ผู้เล่น: {lineProfile.displayName.split(" ")[0]} 🎮
              </span>
              <button 
                onClick={() => setActiveTab("contact")}
                className="w-9 h-9 rounded-full border-2 border-[#322B24] bg-[#FCFAF5] flex items-center justify-center shadow-sm relative hover:scale-105 active:scale-95 transition-all text-lg"
              >
                {lineProfile.pictureUrl}
              </button>
            </div>
          </header>

          {/* Main Console Layout */}
          <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar display on desktop: Character Roster */}
            <aside className="hidden md:flex md:col-span-4 flex-col space-y-4 sticky top-20">
              
              <div className="clay-card p-5 space-y-4 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-[#322B24]/10">
                  <h3 className="text-xs sm:text-sm font-bold text-[#322B24] uppercase tracking-wider flex items-center gap-1">
                    🛡️ คลังฮีโร่สัตว์เลี้ยง ({myPets.length})
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedPet(PET_COMPANIONS[0]);
                      setActiveTab("shop");
                      setStep(1);
                    }}
                    className="text-xs text-[#DEA36C] font-bold hover:underline"
                  >
                    + คัสตอมเพิ่ม
                  </button>
                </div>

                <div className="space-y-3.5">
                  {myPets.map((p) => (
                    <div key={p.id} className="bg-[#FAF6F0] p-3.5 rounded-2xl border-2 border-[#322B24] shadow-sm flex items-center justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-full bg-white border border-[#322B24]/10 overflow-hidden flex items-center justify-center p-0.5" style={{ backgroundColor: p.avatarBg }}>
                          {renderPetIcon(p.id, p.hat, p.bag)}
                        </div>
                        <div>
                          <span className="font-bold text-[#322B24] block text-xs sm:text-sm">น้อง{p.name}</span>
                          <span className="text-[10px] text-[#9F9F8B] font-bold">คลาส: {p.class}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#DEA36C] text-white px-2.5 py-0.5 rounded-full font-bold border border-[#322B24]">
                        {p.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </aside>

            {/* Main viewports based on selected tab */}
            <main className="col-span-1 md:col-span-8 space-y-4">
              
              {/* TAB 1: HOME PAGE (แสดงโปรไฟล์ตัวละครเกมสัตว์เลี้ยง) */}
              {activeTab === "home" && (
                <div className="space-y-4 animate-fade-in text-left">
                  
                  {/* Member info banner */}
                  <div className="clay-card p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-title font-bold text-[#322B24] flex items-center gap-1.5">
                        🎮 หน้าจอข้อมูลตัวละครสัตว์เลี้ยงของคุณ
                      </h3>
                      <p className="text-xs text-[#6A5C50] font-light">ข้อมูลสถานะพลังงานและไอเทมฟื้นฟูของน้องหมาแมวประจำแคมป์</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPet(PET_COMPANIONS[0]);
                        setActiveTab("shop");
                        setStep(1);
                      }}
                      className="clay-button-orange text-xs font-bold py-2.5 px-6 cursor-pointer"
                    >
                      + คัสตอมตัวใหม่ 🎒
                    </button>
                  </div>

                  {/* Registered Pets list display */}
                  {myPets.length === 0 ? (
                    <div className="clay-card p-8 text-center space-y-3 border-dashed">
                      <span className="text-3xl block">⚔️</span>
                      <p className="text-xs sm:text-sm text-[#6A5C50] font-light">คุณยังไม่มีตัวละครสวมประวัติเดินทางผจญภัย</p>
                      <button
                        onClick={() => {
                          setSelectedPet(PET_COMPANIONS[0]);
                          setActiveTab("shop");
                          setStep(1);
                        }}
                        className="clay-button-green text-sm py-2.5 px-6"
                      >
                        เริ่มสร้างตัวละครแรกงับ!
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myPets.map((pet) => (
                        <div key={pet.id} className="clay-card p-5 space-y-4 flex flex-col justify-between relative bg-white shadow-md">
                          
                          {/* Inner 3D header block */}
                          <div className="space-y-3.5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3.5">
                                <div className="w-14 h-14 rounded-2xl border-2 border-[#322B24] bg-white flex items-center justify-center overflow-hidden p-0.5 flex-shrink-0" style={{ backgroundColor: pet.avatarBg }}>
                                  {renderPetIcon(pet.id, pet.hat, pet.bag)}
                                </div>
                                <div>
                                  <h4 className="font-title text-sm sm:text-base font-bold text-[#322B24]">น้อง{pet.name}</h4>
                                  <span className="text-[10px] bg-[#9F9F8B]/10 text-[#9F9F8B] px-2 py-0.5 rounded-full font-bold border border-[#9F9F8B]/20">
                                    คลาส: {pet.class}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Attributes visual stats panel */}
                            <div className="space-y-2 border-t border-[#322B24]/10 pt-3.5 text-xs text-[#6A5C50]">
                              {/* HP */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                  <span>HP (ความแข็งแรงร่างกาย)</span>
                                  <span className="text-[#322B24]">85/100</span>
                                </div>
                                <div className="glossy-progress-bar">
                                  <div className="glossy-progress-value-green" style={{ width: "85%" }} />
                                </div>
                              </div>
                              {/* MP */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold">
                                  <span>MP (ความฉลาดรอบรู้)</span>
                                  <span className="text-[#322B24]">70/100</span>
                                </div>
                                <div className="glossy-progress-bar">
                                  <div className="glossy-progress-value-blue" style={{ width: "70%" }} />
                                </div>
                              </div>
                            </div>

                            {/* Food items summary */}
                            <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#322B24]/5 text-xs font-light space-y-1">
                              <div>🍖 ไอเทมฟื้นฟู: <span className="font-bold text-[#322B24]">{pet.currentPlan}</span></div>
                              <div>📅 รอบบิลรีชาร์จ: <span className="font-bold text-[#322B24]">{pet.nextDelivery}</span></div>
                            </div>
                          </div>

                          {/* Action button row */}
                          <div className="flex gap-2.5 justify-end border-t border-[#322B24]/10 pt-3">
                            <button
                              onClick={() => {
                                const fullPet = PET_COMPANIONS.find(p => p.id === pet.id) || PET_COMPANIONS[0];
                                setSelectedPet(fullPet);
                                setSelectedHat(pet.hat);
                                setSelectedBag(pet.bag);
                                setActiveTab("shop");
                                setStep(2); 
                              }}
                              className="text-xs font-bold text-[#DEA36C] bg-[#DEA36C]/5 border border-[#DEA36C]/10 px-3.5 py-1.5 rounded-lg active:scale-95 cursor-pointer"
                            >
                              ปรับสูตรอาหาร 🍖
                            </button>
                            <button
                              onClick={() => setActiveTab("services")}
                              className="text-xs font-bold text-[#322B24] bg-[#FCFAF5] border border-[#E5D3BD] px-3.5 py-1.5 rounded-lg active:scale-95 cursor-pointer"
                            >
                              จองที่พัก/รพ. 🏥
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                  {/* Character Stories */}
                  <div className="clay-card p-5 space-y-2">
                    <label className="text-[10px] font-bold text-[#322B24] uppercase tracking-wider block">สมุดบันทึกตัวละครอื่น ๆ</label>
                    <div className="flex space-x-3.5 overflow-x-auto pb-1 scrollbar-none">
                      {PET_COMPANIONS.map((pet) => (
                        <button
                          key={pet.id}
                          onClick={() => setActiveStoryPet(pet)}
                          className="flex flex-col items-center space-y-1 flex-shrink-0 focus:outline-none"
                        >
                          <div className="w-11 h-11 rounded-full border border-[#DEA36C]/30 p-0.5 bg-white flex items-center justify-center relative">
                            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: pet.avatarBg }}>
                              {renderPetIcon(pet.id, "none", "none", 0)}
                            </div>
                          </div>
                          <span className="text-[9.5px] text-[#6A5C50] truncate max-w-[50px]">{pet.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Wellness Knowledge Base Card */}
                  <div className="clay-card p-5 space-y-3 bg-white shadow-sm border-l-4 border-l-[#DEA36C]">
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-[#DEA36C] uppercase tracking-wider">
                      <span>📰 ARTICLE OF THE WEEK</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DEA36C]" />
                      <span>โภชนาการสัตว์เลี้ยง</span>
                    </div>
                    
                    <h4 className="font-title text-sm sm:text-base font-bold text-[#322B24]">
                      ทำไมอาหารบาร์ฟปรุงสดสุกช้า (Slow-cooked Fresh Raw) จึงช่วยฟื้นฟูระดับขนร่วงและฟื้นพลังกาย HP ได้ไวที่สุด?
                    </h4>
                    
                    <p className="text-xs text-[#6A5C50] leading-relaxed font-light">
                      การให้สุนัขและแมวทานอาหารโฮมเมดบาร์ฟปรุงสดเกรดโฮลฟู้ด ช่วยให้ร่างกายได้รับเอนไซม์ธรรมชาติและโปรตีนที่ไม่ถูกทำลายด้วยความร้อนสูง ซึ่งจะช่วยให้ระบบทางเดินอาหารดูดซึมสารอาหารได้ง่ายขึ้นถึง 90% และทำให้สุขภาพเส้นขนและผิวหนังเงางามขึ้นอย่างเห็นได้ชัดภายใน 14 วัน
                    </p>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-[#322B24]/5">
                      <span className="text-[10px] text-[#9F9F8B]">ผู้เขียน: สัตวแพทย์หญิง ดร. แพรวไพลิน 🏥</span>
                      <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-bold text-[#322B24] hover:underline flex items-center gap-0.5">
                        อ่านบทความความรู้ฉบับเต็ม 📖
                      </a>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: SERVICES (ค้นหารพ./ที่พักฝากสัตว์) */}
              {activeTab === "services" && (
                <div className="clay-card p-6 space-y-5 animate-fade-in text-left">
                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-title font-bold text-[#322B24]">แนะนำจุดบริการและสถานที่พัก</h3>
                    <p className="text-xs text-[#6A5C50] font-light">ค้นหาที่พักและคลินิกการรักษาพยาบาลสัตว์เลี้ยงใกล้บ้าน</p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ป้อนรหัสพิกัดแคมป์ คลินิก หรือโรงแรมแนะนำ..."
                      className="w-full bg-white border border-[#E5D3BD] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#322B24] placeholder-[#6A5C50]/50 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-[#6A5C50]/50 absolute left-3 top-3" />
                  </div>

                  {/* Shiba banner */}
                  <div className="bg-[#FFF8F2] border border-[#E5D3BD]/30 rounded-2xl p-4 flex items-center justify-between shadow-sm overflow-hidden h-[105px] relative">
                    <div className="space-y-1.5 z-10 max-w-[240px] text-left">
                      <h4 className="text-xs sm:text-sm font-bold text-[#322B24]">สวัสดีจ้า คุณ{lineProfile.displayName.split(" ")[0]} 🐾</h4>
                      <p className="text-xs text-[#6A5C50] leading-relaxed font-light">
                        เลือกประเภทบริการเพื่ออำნวยความสะดวกให้ฮีโร่ตัวน้อยในการเดินทางผจญภัย
                      </p>
                    </div>
                    <div className="w-[120px] h-[105px] absolute right-2 -bottom-1">
                      {renderShibaGreeting()}
                    </div>
                  </div>

                  {/* 8 Categories grid */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-bold text-[#322B24] uppercase tracking-wider block">ประเภทสถานที่</label>
                    <div className="grid grid-cols-4 gap-x-2.5 gap-y-3.5">
                      {[
                        { label: "อาหารบาร์ฟ", icon: ShoppingBag, color: "bg-[#E8F5E9] text-[#2E7D32]" },
                        { label: "ขนมอบแห้ง", icon: Gift, color: "bg-[#FFF8E1] text-[#F57F17]" },
                        { label: "ยาสัตว์เลี้ยง", icon: PawPrint, color: "bg-[#E0F2F1] text-[#00695C]" },
                        { label: "ของเล่นสนุก", icon: Sparkles, color: "bg-[#FFEBEE] text-[#C62828]" },
                        { label: "อาบน้ำตัดขน", icon: Scissors, color: "bg-[#FFF3E0] text-[#E65100]" },
                        { label: "สมาคมรักหมา", icon: MessageSquare, color: "bg-[#F3E5F5] text-[#6A1B9A]" },
                        { label: "จองโรงแรมสัตว์", icon: Calendar, color: "bg-[#E1F5FE] text-[#0277BD]" },
                        { label: "รพ. สัตว์ 24 ชม.", icon: Briefcase, color: "bg-[#EFEBE9] text-[#4E342E]" }
                      ].map((cat, idx) => {
                        const IconComp = cat.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (idx === 6) {
                                alert("ระบบจำลองโรงแรม: คัดรายชื่อห้องพักสัตว์เลี้ยงคุณภาพสูงพร้อมแคมป์ส่องสุนัข 🏨");
                              } else if (idx === 7) {
                                alert("ระบบโรงพยาบาล: แสดงคลินิกและรพ. ที่อยู่ใกล้พิกัด LINE LIFF ของคุณ 🏥");
                              } else {
                                alert(`เปิดพอร์ทัล "${cat.label}"`);
                              }
                            }}
                            className="flex flex-col items-center space-y-1.5 focus:outline-none cursor-pointer group"
                          >
                            <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center shadow-sm border border-[#322B24]/5 transition-transform group-hover:scale-105 active:scale-95`}>
                              <IconComp className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-[#6A5C50] font-medium tracking-tight text-center truncate w-full">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: SHOP (คัสตอมสร้างโมเดลตัวละครสไตล์ 3D Pixar & สเตตัสแถบเลือดเกม) */}
              {activeTab === "shop" && (
                <div className="clay-card animate-fade-in flex flex-col h-full overflow-hidden text-left bg-[#FDFBF7]">
                  
                  {/* Stepper Progress */}
                  <div className="bg-white border-b-2 border-[#322B24] py-3.5 px-4 flex justify-between items-center text-[10px] font-medium text-[#6A5C50]">
                    {[
                      { num: 1, label: "ปรับแต่งโมเดล" },
                      { num: 2, label: "โพชั่นอาหาร" },
                      { num: 3, label: "ความถี่ส่ง" },
                      { num: 4, label: "สรุปคิลเลอร์" }
                    ].map((s) => (
                      <div key={s.num} className="flex items-center space-x-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          step === s.num 
                            ? "bg-[#DEA36C] text-white" 
                            : step > s.num 
                              ? "bg-[#9F9F8B] text-white" 
                              : "bg-[#E5D3BD] text-[#6A5C50]"
                        }`}>
                          {step > s.num ? "✓" : s.num}
                        </div>
                        <span className={`font-semibold text-xs ${step === s.num ? "text-ink" : "text-ink-light/70"}`}>
                          {s.label}
                        </span>
                        {s.num < 4 && <span className="text-[#322B24]/20 font-mono">/</span>}
                      </div>
                    ))}
                  </div>

                  {/* Character Creation Panel inside Wizard */}
                  <div className="p-5 space-y-6">
                    
                    {/* Step 1: Character customization with accessories & 3D Pedestal Stage */}
                    {step === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-fade-in">
                        
                        {/* Left column: Simulated profile badge */}
                        <div className="md:col-span-5 space-y-4 text-center">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PET WELLNESS PROFILE</label>
                          
                          {/* Circle spotlight stage */}
                          <div className="spotlight-stage w-44 h-44 mx-auto flex items-center justify-center p-3.5">
                            {renderPetIcon(selectedPet.id)}
                          </div>

                          <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100 text-center">
                            <span className="text-xs text-[#F59E0B] font-bold block">สูตรแนะนำพิเศษ</span>
                            <span className="text-[10.5px] text-[#475569] font-medium mt-0.5 block">{selectedPet.status}</span>
                          </div>
                        </div>

                        {/* Right column: Wellness Focus Targets & Health Indices */}
                        <div className="md:col-span-7 space-y-5">
                          
                          {/* Profile Core Attributes */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">ข้อมูลพื้นฐานของสัตว์เลี้ยง (PET PROFILE)</h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10.5px] text-slate-500 font-semibold block">เป้าหมายพลังงานรายวัน</label>
                                <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold">
                                  ⚡ {selectedPet.kcal} kcal / วัน
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10.5px] text-slate-500 font-semibold block">สัดส่วนบาร์ฟสดที่ต้องการ</label>
                                <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold">
                                  🥩 {Math.round(selectedPet.kcal * 0.45)} กรัม / มื้อ
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Health Focus Selection (แทน Class & Role) */}
                          <div className="space-y-2 pt-2">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">เป้าหมายด้านสุขภาพหลัก (HEALTH TARGET FOCUS)</h4>
                            <div className="grid grid-cols-3 gap-2.5">
                              {[
                                { id: "warrior", label: "ควบคุมน้ำหนัก & ไขข้อ 🦴", desc: "สุนัขพันธุ์เล็ก/หลังยาว" },
                                { id: "mage", label: "บำรุงเส้นขน & ผิวหนัง 🌾", desc: "สุนัขขนยาว/ผิวแพ้ง่าย" },
                                { id: "explorer", label: "เสริมสร้างกล้ามเนื้อ 💪", desc: "พลังงานสูง/กิจกรรมเยอะ" }
                              ].map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => setSelectedClass(c.id as "warrior" | "mage" | "explorer")}
                                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-center items-center cursor-pointer ${
                                    selectedClass === c.id
                                      ? "border-[#F59E0B] bg-[#FFFDF0] font-bold text-slate-900"
                                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                  }`}
                                >
                                  <span className="text-xs font-bold leading-tight">{c.label}</span>
                                  <span className="text-[9px] text-slate-500 font-light mt-1 leading-none">{c.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Health Indices output (แทน Game stats) */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">เกณฑ์ประเมินสรีระและสุขภาพ (BODY & HEALTH INDEX)</h5>
                            <div className="space-y-2">
                              {/* HP -> Energy & Muscle */}
                              <div className="space-y-0.5 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">สัดส่วนกล้ามเนื้อและพลังงานคาร์บ (Energy Index)</span>
                                  <span className="font-bold text-slate-700">{statHp}/100</span>
                                </div>
                                <div className="glossy-progress-bar">
                                  <div className="glossy-progress-value-green" style={{ width: `${statHp}%` }} />
                                </div>
                              </div>
                              {/* MP -> Digestion */}
                              <div className="space-y-0.5 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">การดูดซึมและระบบย่อยอาหาร (Digestion Index)</span>
                                  <span className="font-bold text-slate-700">{statMp}/100</span>
                                </div>
                                <div className="glossy-progress-bar">
                                  <div className="glossy-progress-value-blue" style={{ width: `${statMp}%` }} />
                                </div>
                              </div>
                              {/* Speed -> Coat Quality */}
                              <div className="space-y-0.5 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">ความนุ่มลื่นและสุขภาพเส้นขน (Coat Quality)</span>
                                  <span className="font-bold text-slate-700">{statSpeed}/100</span>
                                </div>
                                <div className="glossy-progress-bar">
                                  <div className="glossy-progress-value-orange" style={{ width: `${statSpeed}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                    )}

                    {/* Step 2: Recipe Choice (สไตล์สินค้า Most Popular ยอดนิยม) */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="text-left">
                          <h3 className="text-sm sm:text-base font-title font-bold">2. เลือกสูตรอาหารสด (Most Popular Recipes)</h3>
                          <p className="text-xs text-[#6A5C50]">สูตรอาหารโฮมเมดปรุงสดใหม่ ได้รับสเปคโภชนาการสำหรับสัตว์เลี้ยง</p>
                        </div>

                        {/* Grid 3 Columns matching Screen 2 */}
                        <div className="grid grid-cols-3 gap-3">
                          {RECIPES.map((recipe, idx) => {
                            const isSelected = selectedRecipe.id === recipe.id;
                            return (
                              <button
                                key={recipe.id}
                                onClick={() => setSelectedRecipe(recipe)}
                                className={`clay-card p-3 text-center flex flex-col justify-between items-center transition-all cursor-pointer bg-white relative ${
                                  isSelected 
                                    ? "border-[#DEA36C] ring-2 ring-[#DEA36C]/20 scale-102" 
                                    : "border-[#322B24] hover:scale-101"
                                }`}
                              >
                                {/* Circle Spotlight */}
                                <div className="spotlight-stage w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center p-1 bg-white/45">
                                  {idx === 0 ? (
                                    // Chicken Bowl
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                      <circle cx="50" cy="50" r="28" fill="#FFF9E6" />
                                      <ellipse cx="50" cy="58" rx="22" ry="16" fill="#FDFBF7" stroke="#322B24" strokeWidth="1" />
                                      <circle cx="50" cy="42" r="14" fill="#FAB270" stroke="#322B24" strokeWidth="1" />
                                      <polygon points="46,42 54,42 50,46" fill="#DE7A6C" />
                                      <circle cx="45" cy="38" r="2" fill="#322B24" />
                                      <circle cx="55" cy="38" r="2" fill="#322B24" />
                                    </svg>
                                  ) : idx === 1 ? (
                                    // Salmon Bowl
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                      <circle cx="50" cy="50" r="28" fill="#EBF8FF" />
                                      <ellipse cx="50" cy="58" rx="22" ry="16" fill="#FDFBF7" stroke="#322B24" strokeWidth="1" />
                                      <circle cx="50" cy="42" r="14" fill="#86C7DE" stroke="#322B24" strokeWidth="1" />
                                      <circle cx="45" cy="38" r="2" fill="#322B24" />
                                      <circle cx="55" cy="38" r="2" fill="#322B24" />
                                      <polygon points="47,43 53,43 50,46" fill="#FDFBF7" />
                                    </svg>
                                  ) : (
                                    // Lamb Bowl
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                      <circle cx="50" cy="50" r="28" fill="#FFF0FA" />
                                      <ellipse cx="50" cy="58" rx="22" ry="16" fill="#FDFBF7" stroke="#322B24" strokeWidth="1" />
                                      <circle cx="50" cy="42" r="14" fill="#E9BD96" stroke="#322B24" strokeWidth="1" />
                                      <circle cx="45" cy="38" r="2" fill="#322B24" />
                                      <circle cx="55" cy="38" r="2" fill="#322B24" />
                                      <rect x="42" y="32" width="16" height="4" rx="1" fill="#322B24" />
                                    </svg>
                                  )}
                                </div>
                                
                                <div className="mt-2 text-center space-y-0.5">
                                  <h4 className="text-[10.5px] font-bold text-[#322B24] leading-tight truncate max-w-[70px]">{recipe.name}</h4>
                                  <span className="text-[8.5px] text-[#6A5C50] block">{recipe.tag}</span>
                                  <span className="text-xs font-title font-bold text-[#DEA36C] block">฿{recipe.price}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Orange discount coupon banner matching Screen 2 */}
                        <div className="bg-gradient-to-r from-[#DEA36C] to-[#FAB270] border-2 border-[#322B24] rounded-[22px] p-4 flex items-center justify-between shadow-md text-white overflow-hidden relative min-h-[92px]">
                          <div className="space-y-1 z-10 text-left">
                            <span className="text-[10px] font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">โปรโมชั่นพิเศษประจำวัน ⚡</span>
                            <h4 className="text-sm font-title font-bold">รับส่วนลดเพิ่มทันที 10%</h4>
                            <p className="text-[10px] text-white/90">พิมพ์รหัสคูปองในขั้นตอนสุดท้ายเพื่อรับส่วนลดเพิ่มเติม</p>
                          </div>
                          
                          {/* Cute character holding the TOY20 coupon banner */}
                          <div className="flex flex-col items-center z-10">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm">
                              {renderPetIcon(1, "none", "none", 0)}
                            </div>
                            <div className="bg-white border border-[#322B24] text-[#322B24] text-[8px] font-bold px-1.5 py-0.2 rounded-md shadow-sm -mt-1 font-mono">
                              WHATDADOG
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Freq & Treats */}
                    {step === 3 && (
                      <div className="space-y-4">
                        <div className="text-left">
                          <h3 className="text-sm sm:text-base font-title font-bold">3. รอบจัดส่งและโพชั่นท็อปปิ้งเพิ่มเติม</h3>
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-[10px] font-bold text-[#322B24] uppercase tracking-wider block">ความถี่จัดส่งพัสดุ</label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {FREQUENCIES.map((freq) => (
                              <button
                                key={freq.id}
                                onClick={() => setSelectedFrequency(freq)}
                                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                                  selectedFrequency.id === freq.id
                                    ? "border-[#DEA36C] bg-white shadow-sm font-bold"
                                    : "border-[#E5D3BD]/50 bg-white/40 hover:bg-white"
                                }`}
                              >
                                <span className="text-sm font-title block">{freq.label}</span>
                                <span className="text-[9px] mt-1 bg-[#DEA36C]/5 border border-[#DEA36C]/20 text-[#DEA36C] px-1.5 rounded-full font-bold inline-block">
                                  ส่วนลด {(freq.discount * 100)}%
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-3">
                          <label className="text-[10px] font-bold text-[#322B24] uppercase tracking-wider block">ท็อปปิ้งเสริมพลัง ( One-time )</label>
                          <div className="space-y-2">
                            {TREATS.map((treat) => {
                              const isSelected = selectedTreats.includes(treat.id);
                              return (
                                <button
                                  key={treat.id}
                                  onClick={() => toggleTreat(treat.id)}
                                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                    isSelected
                                      ? "border-[#DEA36C] bg-white shadow-sm"
                                      : "border-[#E5D3BD]/40 bg-white/20 hover:bg-white/50"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2.5">
                                    <span className="text-xl">{treat.icon}</span>
                                    <div>
                                      <span className="text-xs sm:text-sm font-semibold block">{treat.name}</span>
                                      <span className="text-[10.5px] text-[#6A5C50]">เสริมโภชนาการธรรมชาติ</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs sm:text-sm font-title font-bold">+฿{treat.price}</span>
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-[#9F9F8B] border-transparent" : "bg-white border-[#322B24]/20"}`}>
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Summary Bill (สไตล์สินค้า Product Details หน้าที่ 3 ของภาพตัวอย่าง) */}
                    {step === 4 && (
                      <div className="space-y-5">
                        
                        <div className="clay-card p-5 space-y-4 bg-white shadow-md relative overflow-hidden">
                          
                          {/* Large Spotlight Viewport */}
                          <div className="text-center relative">
                            <label className="text-[10px] font-bold text-[#322B24] uppercase tracking-wider block mb-2">PRODUCT DETAILS</label>
                            
                            <div className="spotlight-stage w-36 h-36 mx-auto flex items-center justify-center p-3.5 bg-yellow-100/30">
                              {renderPetIcon(selectedPet.id)}
                            </div>
                            
                            {/* Color variant thumbnails under model */}
                            <div className="flex justify-center gap-2 mt-3">
                              <span className="w-5 h-5 rounded-full bg-[#DEA36C] border-2 border-[#322B24] cursor-pointer hover:scale-105 active:scale-95" title="สีส้มคอร์กี้" />
                              <span className="w-5 h-5 rounded-full bg-[#F2D5CB] border-2 border-[#322B24]/20 cursor-pointer hover:scale-105 active:scale-95" title="สีลิ้นชมพู" />
                              <span className="w-5 h-5 rounded-full bg-[#9F9F8B] border-2 border-[#322B24]/20 cursor-pointer hover:scale-105 active:scale-95" title="สีเซจกรีน" />
                            </div>
                          </div>

                          {/* Typography details block */}
                          <div className="space-y-1 text-left border-t border-[#322B24]/10 pt-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-title text-base sm:text-lg font-bold leading-none">{selectedRecipe.name}</h4>
                                <span className="text-[9.5px] text-[#9F9F8B] font-bold">โดย WhatDaDog Kitchen - สูตรอบช้าพรีเมียม</span>
                              </div>
                              <span className="font-title text-base sm:text-lg font-extrabold text-[#DEA36C]">฿{getFinalTotal().toFixed(0)}</span>
                            </div>
                            <p className="text-[11px] text-[#6A5C50] leading-relaxed pt-1.5 font-light">
                              เนื้อสัตว์สดโฮมเมดปรุงช้าอย่างใส่ใจ ผสมวิตามินและท็อปปิ้งสมุนไพร เพื่อฟื้นฟูระดับ HP และความว่องไวของน้อง {selectedPet.name} สไตล์ 3D Pixar
                            </p>
                          </div>

                          {/* Specification Table mapping Screen 3 */}
                          <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-b border-[#322B24]/10 py-3">
                            <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#322B24]/5">
                              <span className="block text-[8.5px] text-[#6A5C50] uppercase font-bold">ขนาดบรรจุ</span>
                              <strong className="text-[#322B24]">150g x 30 ซอง</strong>
                            </div>
                            <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#322B24]/5">
                              <span className="block text-[8.5px] text-[#6A5C50] uppercase font-bold">ส่วนผสมหลัก</span>
                              <strong className="text-[#322B24] truncate block">เนื้อสดเกรดโฮลฟู้ด</strong>
                            </div>
                            <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#322B24]/5">
                              <span className="block text-[8.5px] text-[#6A5C50] uppercase font-bold">ความอึด HP</span>
                              <strong className="text-[#322B24]">+{statHp} HP/มื้อ</strong>
                            </div>
                          </div>

                          {/* Dynamic summary costs */}
                          <div className="space-y-1.5 text-[11px] font-light text-left">
                            <div className="flex justify-between">
                              <span>ราคารายเดือนหลัก:</span>
                              <span>฿{calculateSubtotal()}</span>
                            </div>
                            {appliedDiscount > 0 && (
                              <div className="flex justify-between text-[#9F9F8B] font-bold">
                                <span>ส่วนลดคูปองพิเศษ (10%):</span>
                                <span>-฿{(calculateSubtotal() * appliedDiscount).toFixed(0)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-[#9F9F8B] font-bold">
                              <span>ส่วนลดการสมัครส่ง ({selectedFrequency.label}):</span>
                              <span>-฿{(calculateSubtotal() * selectedFrequency.discount).toFixed(0)}</span>
                            </div>
                          </div>

                        </div>

                        {/* Coupon Form input underneath details card */}
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="ป้อนโค้ดส่วนลด (เช่น ลดสิบ)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            disabled={appliedDiscount > 0}
                            className="flex-1 bg-white border-2 border-[#322B24] rounded-xl px-3 py-2 text-xs focus:outline-none"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={appliedDiscount > 0 || !promoCode}
                            className="clay-button-gray text-xs font-bold px-4 py-2 cursor-pointer"
                          >
                            ใช้รหัส
                          </button>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* Wizard Footer Controls */}
                  <div className="border-t border-[#E5D3BD]/50 bg-white p-4 flex justify-between items-center">
                    {step > 1 ? (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="bg-[#FDFBF7] hover:bg-[#E5D3BD]/25 text-[#322B24] border border-[#E5D3BD] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> ย้อนกลับ
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedPet(PET_COMPANIONS[0]);
                          setSelectedRecipe(RECIPES[0]);
                          setSelectedTreats([]);
                          setAppliedDiscount(0);
                          setPromoCode("");
                          setCouponStatus("none");
                          setSelectedHat("none");
                          setSelectedBag("none");
                          setSelectedClass("explorer");
                        }}
                        className="text-[#322B24]/50 text-[10px] hover:underline flex items-center gap-0.5 cursor-pointer font-light"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> ล้างข้อมูล
                      </button>
                    )}

                    {step < 4 ? (
                      <button
                        onClick={() => setStep(step + 1)}
                        className="bg-[#9F9F8B] hover:bg-[#B5B5A3] text-white px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        ถัดไป <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleStartSubscription}
                        disabled={isSubmitting}
                        className="bg-[#322B24] hover:bg-black text-white text-xs sm:text-sm font-extrabold py-3.5 px-8 rounded-full shadow-md active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                      >
                        {isSubmitting ? "กำลังจัดส่ง..." : "ลงทะเบียนเข้าตะกร้า 🛒"}
                      </button>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4: PROFILE / LINE LIFF SETTINGS */}
              {activeTab === "contact" && (
                <div className="p-6 bg-[#FDFBF7] border border-[#E5D3BD] rounded-2xl space-y-5 animate-fade-in text-xs font-light text-left shadow-sm">
                  
                  {/* Profile Details Card */}
                  <div className="flex items-center justify-between border-b border-[#E5D3BD]/30 pb-4.5">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border border-[#E5D3BD] flex items-center justify-center text-2xl shadow-sm">
                        {lineProfile.pictureUrl}
                      </div>
                      <div>
                        <h4 className="font-title text-sm sm:text-base font-bold">คุณ{lineProfile.displayName}</h4>
                        <p className="text-[10px] text-[#6A5C50] mt-0.5">สถานะ LINE Chat: {lineProfile.statusMessage}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLineLogout}
                      className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> ออกจากระบบ LINE
                    </button>
                  </div>

                  {/* Active subscriptions */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#322B24] uppercase tracking-wider block">สัญญากล่องจัดส่งที่ทำงาน ({activeSubscriptions.length})</label>
                    {activeSubscriptions.map((sub) => (
                      <div key={sub.id} className="bg-white border border-[#E5D3BD]/60 rounded-xl p-3.5 shadow-sm flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full border border-[#E5D3BD] bg-white flex items-center justify-center overflow-hidden">
                            {renderPetIcon(sub.pet.id)}
                          </div>
                          <div>
                            <span className="font-bold text-[#322B24] block text-xs sm:text-sm">เพื่อนร่วมเดินทาง: น้อง{sub.pet.name}</span>
                            <span className="text-[10px] text-[#9F9F8B] font-semibold">{sub.recipe.name} (ส่งทุก {sub.frequency.label})</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`ยกเลิกแผนการส่งอาหารสดของน้อง ${sub.pet.name}?`)) {
                              handleCancelSub(sub.id);
                            }
                          }}
                          className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                        >
                          ยกเลิกบริการ
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Settings addresses */}
                  <div className="space-y-3.5 pt-2">
                    <div className="bg-[#FAF6F0] border border-[#E5D3BD]/50 p-4 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-[#322B24] text-xs sm:text-sm">
                        <MapPin className="w-4.5 h-4.5 text-[#DEA36C]" />
                        <span>ที่อยู่รับกล่องพัสดุในแอป LINE</span>
                      </div>
                      <p className="text-xs text-[#6A5C50] pl-6.5 leading-relaxed font-light">
                        123/45 ถนนทุ่งหญ้าสีเขียว, แขวงจิบลิ, เขตป่าใหญ่, กรุงเทพมหานคร 10120
                      </p>
                    </div>

                    <div className="bg-[#FAF6F0] border border-[#E5D3BD]/50 p-4 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-[#322B24] text-xs sm:text-sm">
                        <CreditCard className="w-4.5 h-4.5 text-[#9F9F8B]" />
                        <span>ช่องทางการหักจ่ายค่าอาหารสด</span>
                      </div>
                      <div className="flex justify-between items-center pl-6.5 text-xs font-light text-[#6A5C50]">
                        <span>บัญชีหลัก LINE Pay (วีซ่า *4242)</span>
                        <span className="text-[10px] bg-[#E5D3BD] text-[#322B24] px-2 rounded-md font-semibold">ผูกเรียบร้อย</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </main>

          </div>

          {/* Bottom Sticky Navigation Tab Bar */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[58px] bg-white border-t border-[#E5D3BD] flex justify-around items-center z-20 shadow-[0_-3px_12px_rgba(50,43,36,0.03)]">
            {[
              { id: "home", label: "หน้าแรก", icon: HomeIcon },
              { id: "services", label: "ค้นหาบริการ", icon: Compass },
              { id: "shop", label: "จัดกล่องอาหาร", icon: ShoppingBag },
              { id: "contact", label: "โปรไฟล์", icon: User }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as "home" | "services" | "shop" | "contact");
                    if (tab.id === "shop") setStep(1);
                  }}
                  className={`flex flex-col items-center justify-center w-14 h-full transition-all focus:outline-none cursor-pointer ${
                    isActive 
                      ? "text-[#DEA36C] scale-102" 
                      : "text-[#6A5C50]/50 hover:text-[#322B24]"
                  }`}
                >
                  <IconComponent className={`w-4.5 h-4.5 ${isActive ? "stroke-[2.2px] text-[#DEA36C]" : "stroke-[1.8px] text-[#6A5C50]/50"}`} />
                  <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? "font-bold text-[#322B24]" : "text-[#6A5C50]"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#322B24]/40 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white border border-[#E5D3BD] p-6 rounded-[24px] max-w-xs w-full text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-xl border border-[#E5D3BD] bg-white flex items-center justify-center mx-auto" style={{ backgroundColor: selectedPet.avatarBg }}>
              {renderPetIcon(selectedPet.id, selectedHat, selectedBag)}
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider text-[#9F9F8B] font-bold uppercase">สมัครสำเร็จแล้ว</span>
              <h3 className="font-title text-base sm:text-lg font-bold text-[#322B24] font-semibold">กางเต็นท์เตรียมออกเดินทาง! ⛺</h3>
              <p className="text-xs text-[#6A5C50] leading-relaxed font-light">
                ลงทะเบียนประวัติกล่องโภชนาการเรียบร้อยแล้ว {selectedPet.name} สวมหมวกและสะพายเป้เตรียมจัดส่งพัสดุด่วนควบคุมความเย็นส่งตรงถึงบ้านคุณแล้วงับ!
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setActiveTab("home"); 
              }}
              className="w-full bg-[#9F9F8B] text-white py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-sm font-title"
            >
              ดูรายละเอียดกล่องสั่งซื้อ 📅
            </button>
          </div>
        </div>
      )}

      {/* STORY MODAL */}
      {activeStoryPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#322B24]/40 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white border border-[#E5D3BD] p-6 rounded-[24px] max-w-xs w-full text-center space-y-3.5 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#E5D3BD]/15 pb-2.5">
              <span className="text-[10px] text-[#DEA36C] font-bold">บันทึกของเพื่อนเดินทาง 📖</span>
              <button 
                onClick={() => setActiveStoryPet(null)}
                className="text-xs text-[#6A5C50] hover:text-[#322B24] font-semibold font-title"
              >
                ✕ ปิด
              </button>
            </div>

            <div className="w-14 h-14 rounded-xl border border-[#E5D3BD] bg-white flex items-center justify-center mx-auto" style={{ backgroundColor: activeStoryPet.avatarBg }}>
              {renderPetIcon(activeStoryPet.id, "none", "none", 0)}
            </div>

            <div className="space-y-1">
              <h4 className="font-title text-base sm:text-lg font-bold text-[#322B24]">{activeStoryPet.name}</h4>
              <p className="text-[10px] font-semibold text-[#9F9F8B] uppercase tracking-wider">{activeStoryPet.type}</p>
              <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#E5D3BD]/30 text-left text-xs text-[#6A5C50] font-light italic leading-relaxed mt-2.5">
                🐾 สถานะล่าสุด: <strong className="text-[#322B24] not-italic">{activeStoryPet.status}</strong>
                <p className="mt-1">ขนมที่โปรดปราน: &ldquo;{activeStoryPet.favorite}&rdquo;</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPet(activeStoryPet);
                setActiveStoryPet(null);
                setActiveTab("shop");
                setStep(1);
              }}
              className="w-full bg-[#DEA36C] hover:bg-[#E9BD96] text-white py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-sm font-title"
            >
              จัดกล่องให้ตัวละครนี้ 🎒
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
