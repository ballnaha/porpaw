import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

function createMariaDbAdapter() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required.");

  const url = new URL(databaseUrl);

  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
  });
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scryptAsync(password, salt, 64);

  return `scrypt:${salt}:${key.toString("hex")}`;
}

const prisma = new PrismaClient({ adapter: createMariaDbAdapter() });

const email = (process.env.ADMIN_EMAIL ?? "admin@baebite.com").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "123456";
const name = process.env.ADMIN_NAME ?? "BaeBite Admin";

await prisma.user.upsert({
  where: { email },
  update: {
    name,
    role: "ADMIN",
    passwordHash: await hashPassword(password),
  },
  create: {
    email,
    name,
    role: "ADMIN",
    passwordHash: await hashPassword(password),
  },
});

const tiers = [
  {
    name: "Essential",
    grade: "ESSENTIAL",
    description: "อาหารเกรดมาตรฐานสำหรับดูแลประจำวัน รอบส่ง 1 เดือน",
    basePrice: 1190,
    sortOrder: 1,
  },
  {
    name: "Plus",
    grade: "PLUS",
    description: "วัตถุดิบดีขึ้น โปรตีนและสารบำรุงเหมาะกับการดูแลจริงจัง รอบส่ง 1 เดือน",
    basePrice: 1590,
    sortOrder: 2,
  },
  {
    name: "Premium",
    grade: "PREMIUM",
    description: "เกรดสูงสำหรับน้องแพ้ง่าย สุขภาพเฉพาะ หรือการดูแลเน้นคุณภาพ รอบส่ง 1 เดือน",
    basePrice: 2190,
    sortOrder: 3,
  },
];

for (const tier of tiers) {
  await prisma.packageTier.upsert({
    where: { grade: tier.grade },
    update: tier,
    create: tier,
  });
}

const formulas = [
  { name: "บำรุงขน", type: "SKIN_COAT", description: "ดูแลผิวหนังและเส้นขนให้เงางาม", multiplier: 1.08, sortOrder: 1 },
  { name: "เสริมภูมิ", type: "IMMUNITY", description: "เสริมสมดุลร่างกายและภูมิคุ้มกัน", multiplier: 1.06, sortOrder: 2 },
  { name: "ระบบย่อย", type: "DIGESTION", description: "ย่อยง่าย ดูแลลำไส้และการขับถ่าย", multiplier: 1.12, sortOrder: 3 },
  { name: "คุมน้ำหนัก", type: "WEIGHT", description: "คุมพลังงานและรูปร่างให้เหมาะสม", multiplier: 1.04, sortOrder: 4 },
  { name: "สูงวัย", type: "SENIOR", description: "โภชนาการสมดุลสำหรับน้องวัยโต-สูงวัย", multiplier: 1.16, sortOrder: 5 },
  { name: "แพ้ง่าย", type: "SENSITIVE", description: "คัดวัตถุดิบสำหรับน้องไวต่ออาหาร", multiplier: 1.22, sortOrder: 6 },
];

for (const formula of formulas) {
  await prisma.formulaGoal.upsert({
    where: { type: formula.type },
    update: formula,
    create: formula,
  });
}

const shopCategories = [
  { slug: "food-dog", name: "อาหารสุนัข", icon: "🐕", sortOrder: 1 },
  { slug: "food-cat", name: "อาหารแมว", icon: "🐈", sortOrder: 2 },
  { slug: "snack", name: "ขนม", icon: "🦴", sortOrder: 3 },
  { slug: "supplement", name: "อาหารเสริม", icon: "💊", sortOrder: 4 },
  { slug: "toy", name: "ของเล่น", icon: "🎾", sortOrder: 5 },
  { slug: "grooming", name: "อุปกรณ์ดูแล", icon: "✂️", sortOrder: 6 },
  { slug: "bed-home", name: "ที่นอน & บ้าน", icon: "🏠", sortOrder: 7 },
];

for (const cat of shopCategories) {
  await prisma.shopCategory.upsert({
    where: { slug: cat.slug },
    update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
    create: cat,
  });
}


const seededProducts = [
  {
    slug: "daily-balance-dog",
    name: "Daily Balance Dog",
    categorySlug: "food-dog",
    detail: "โปรตีนคุณภาพสูง สำหรับสุนัขโตทุกสายพันธุ์",
    description: "อาหารเม็ดสูตรสมดุลสำหรับสุนัขโต ออกแบบให้ได้รับโปรตีน ไขมัน และไฟเบอร์ในสัดส่วนเหมาะสมสำหรับการดูแลทุกวัน",
    weightKg: 1.5,
    weightLabel: "1.5 kg",
    price: 590,
    oldPrice: 650,
    image: "/images/food_dog.webp",
    color: "#FFF0E8",
    badge: "ขายดี",
    rating: 4.9,
    benefits: ["โปรตีนคุณภาพช่วยดูแลกล้ามเนื้อ", "โอเมก้า 3 และ 6 ดูแลผิวและขน", "ไฟเบอร์ช่วยให้ระบบขับถ่ายสมดุล"],
    ingredients: "โปรตีนจากไก่ ข้าวกล้อง น้ำมันปลา ไฟเบอร์ธรรมชาติ วิตามินและแร่ธาตุ",
    sortOrder: 1,
  },
  {
    slug: "indoor-care-cat",
    name: "Indoor Care Cat",
    categorySlug: "food-cat",
    detail: "สูตรสมดุลแร่ธาตุ ดูแลแมวเลี้ยงในบ้าน",
    description: "อาหารเม็ดสำหรับแมวโตที่ใช้ชีวิตในบ้าน ให้พลังงานเหมาะกับกิจกรรมและดูแลสมดุลแร่ธาตุในมื้อประจำวัน",
    weightKg: 1.2,
    weightLabel: "1.2 kg",
    price: 520,
    image: "/images/food_cat.webp",
    color: "#EEF4FF",
    badge: "แนะนำ",
    rating: 4.8,
    benefits: ["พลังงานเหมาะกับแมวเลี้ยงในบ้าน", "ไฟเบอร์ช่วยดูแลก้อนขน", "สมดุลแร่ธาตุสำหรับแมวโต"],
    ingredients: "โปรตีนจากปลาและไก่ ข้าว น้ำมันปลา บีทพัลพ์ ทอรีน วิตามินและแร่ธาตุ",
    sortOrder: 2,
  },
  {
    slug: "salmon-bites",
    name: "Salmon Bites",
    categorySlug: "snack",
    detail: "แซลมอนอบแห้ง โปรตีนสูง ไม่เติมเกลือ",
    description: "ขนมชิ้นพอดีคำจากปลาแซลมอน เหมาะสำหรับให้เป็นรางวัลระหว่างวันหรือใช้ฝึกพฤติกรรม",
    weightKg: 0.08,
    weightLabel: "80 g",
    price: 159,
    image: "/images/snack1.webp",
    color: "#FFF5E3",
    badge: "ใหม่",
    rating: 4.9,
    benefits: ["โปรตีนจากปลาแซลมอน", "ไม่เติมเกลือและน้ำตาล", "แบ่งให้เป็นรางวัลได้ง่าย"],
    ingredients: "ปลาแซลมอนและวิตามินอีจากธรรมชาติ",
    sortOrder: 3,
  },
  {
    slug: "skin-coat-oil",
    name: "Skin & Coat Oil",
    categorySlug: "supplement",
    detail: "น้ำมันปลาแซลมอน เสริมโอเมก้า 3 และ 6",
    description: "ผลิตภัณฑ์เสริมอาหารชนิดน้ำสำหรับคลุกกับอาหารมื้อหลัก ช่วยเพิ่มกรดไขมันจำเป็นในมื้อประจำวัน",
    weightKg: 0.1,
    weightLabel: "100 ml",
    price: 290,
    image: "/images/groom3.webp",
    color: "#F4EEFF",
    rating: 4.7,
    benefits: ["มีโอเมก้า 3 และ 6", "ใช้ง่าย เพียงผสมในอาหาร", "เหมาะทั้งสุนัขและแมว"],
    ingredients: "น้ำมันปลาแซลมอน น้ำมันดอกทานตะวัน และวิตามินอี",
    sortOrder: 4,
  },
  {
    slug: "weight-control-dog",
    name: "Weight Control Dog",
    categorySlug: "food-dog",
    detail: "ไขมันต่ำ ไฟเบอร์สูง ช่วยดูแลน้ำหนัก",
    description: "อาหารสุนัขสูตรควบคุมพลังงานที่ยังคงโปรตีนเพียงพอ เหมาะกับสุนัขโตที่มีกิจกรรมน้อยหรือดูแลน้ำหนัก",
    weightKg: 1.5,
    weightLabel: "1.5 kg",
    price: 640,
    image: "/images/diet1.webp",
    color: "#EEFAF2",
    rating: 4.8,
    benefits: ["พลังงานและไขมันลดลง", "ไฟเบอร์ช่วยให้อิ่มนาน", "โปรตีนช่วยคงมวลกล้ามเนื้อ"],
    ingredients: "โปรตีนจากไก่ ข้าวโอ๊ต ไฟเบอร์ถั่ว น้ำมันปลา แอล-คาร์นิทีน",
    sortOrder: 5,
  },
  {
    slug: "digestive-care-cat",
    name: "Digestive Care Cat",
    categorySlug: "food-cat",
    detail: "สูตรย่อยง่าย พร้อมพรีไบโอติกดูแลลำไส้",
    description: "อาหารแมวโตสูตรย่อยง่าย คัดเลือกแหล่งโปรตีนและเสริมพรีไบโอติกเพื่อดูแลระบบทางเดินอาหาร",
    weightKg: 1.2,
    weightLabel: "1.2 kg",
    price: 560,
    image: "/images/food1.webp",
    color: "#FFF0F1",
    rating: 4.8,
    benefits: ["โปรตีนคัดสรรที่ย่อยง่าย", "พรีไบโอติกดูแลจุลินทรีย์ในลำไส้", "ไฟเบอร์สมดุลช่วยการขับถ่าย"],
    ingredients: "โปรตีนจากปลา ข้าว พรีไบโอติก FOS น้ำมันปลา ทอรีน",
    sortOrder: 6,
  },
  {
    slug: "joint-support",
    name: "Joint Support",
    categorySlug: "supplement",
    detail: "กลูโคซามีนและแร่ธาตุ สำหรับข้อและกระดูก",
    description: "อาหารเสริมแบบเม็ดสำหรับการดูแลข้อและการเคลื่อนไหว เหมาะกับสัตว์เลี้ยงโตเต็มวัยและวัยสูงอายุ",
    weightKg: 0.06,
    weightLabel: "60 tablets",
    price: 390,
    image: "/images/bone.webp",
    color: "#EEF7F5",
    rating: 4.7,
    benefits: ["กลูโคซามีนและคอนดรอยติน", "เสริมแร่ธาตุสำหรับกระดูก", "แบ่งให้ตามน้ำหนักตัวได้"],
    ingredients: "กลูโคซามีน คอนดรอยติน แคลเซียม และวิตามินดี",
    sortOrder: 7,
  },
  {
    slug: "play-treat-set",
    name: "Play & Treat Set",
    categorySlug: "toy",
    detail: "ของเล่นเสริมพัฒนาการพร้อมขนมสุขภาพ",
    description: "ชุดของขวัญสำหรับสร้างช่วงเวลาดี ๆ ระหว่างเจ้าของกับสัตว์เลี้ยง รวมขนมคำเล็กและของเล่นที่เลือกตามประเภทสัตว์",
    weightKg: 0.3,
    weightLabel: "1 set",
    price: 349,
    image: "/images/toy2.webp",
    color: "#FFF4EC",
    badge: "คุ้มค่า",
    rating: 4.9,
    benefits: ["ขนมสำหรับให้เป็นรางวัล", "ของเล่นเสริมกิจกรรม", "เหมาะเป็นของขวัญ"],
    ingredients: "ขนมปลาอบแห้งและของเล่นวัสดุปลอดภัยสำหรับสัตว์เลี้ยง",
    sortOrder: 8,
  },
  {
    slug: "soft-grooming-brush",
    name: "Soft Grooming Brush",
    categorySlug: "grooming",
    detail: "แปรงขนนุ่ม ช่วยเก็บขนร่วงและนวดผิว",
    description: "แปรงดูแลขนที่ออกแบบให้จับถนัดมือ ปลายแปรงโค้งมนสำหรับการแปรงขนประจำวันของสุนัขและแมว",
    weightKg: 0.15,
    weightLabel: "1 piece",
    price: 259,
    image: "/images/blow.webp",
    color: "#F1F8F5",
    badge: "ใหม่",
    rating: 4.8,
    benefits: ["ปลายแปรงโค้งมน", "ช่วยเก็บขนที่หลุดร่วง", "ด้ามจับกระชับมือ"],
    ingredients: "วัสดุ ABS และซี่แปรงสเตนเลสปลายมน",
    sortOrder: 9,
  },
  {
    slug: "cozy-pet-house",
    name: "Cozy Pet House",
    categorySlug: "bed-home",
    detail: "บ้านนุ่มทรงโค้ง ให้พื้นที่พักผ่อนเป็นส่วนตัว",
    description: "บ้านสัตว์เลี้ยงน้ำหนักเบาพร้อมเบาะรองถอดซักได้ เหมาะสำหรับวางในห้องนั่งเล่นหรือมุมพักผ่อนของน้อง",
    weightKg: 1.0,
    weightLabel: "Size M",
    price: 890,
    image: "/images/home.webp",
    color: "#FAF1E8",
    rating: 4.7,
    benefits: ["เบาะรองถอดซักได้", "ทรงโค้งให้ความรู้สึกปลอดภัย", "น้ำหนักเบา เคลื่อนย้ายง่าย"],
    ingredients: "ผ้าโพลีเอสเตอร์ โฟมนุ่ม และฐานกันลื่น",
    sortOrder: 10,
  },
];

for (const product of seededProducts) {
  const category = await prisma.shopCategory.findUnique({ where: { slug: product.categorySlug } });
  await prisma.shopProduct.upsert({
    where: { slug: product.slug },
    update: {
      name: product.name,
      categoryId: category?.id ?? null,
      categoryTag: category?.name ?? product.categorySlug,
      detail: product.detail,
      description: product.description,
      weightKg: product.weightKg,
      weightLabel: product.weightLabel,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      image: product.image,
      galleryImages: [],
      color: product.color,
      badge: product.badge ?? null,
      rating: product.rating,
      benefits: product.benefits,
      ingredients: product.ingredients,
      sortOrder: product.sortOrder,
      isActive: true,
    },
    create: {
      slug: product.slug,
      name: product.name,
      categoryId: category?.id ?? null,
      categoryTag: category?.name ?? product.categorySlug,
      detail: product.detail,
      description: product.description,
      weightKg: product.weightKg,
      weightLabel: product.weightLabel,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      image: product.image,
      galleryImages: [],
      color: product.color,
      badge: product.badge ?? null,
      rating: product.rating,
      benefits: product.benefits,
      ingredients: product.ingredients,
      sortOrder: product.sortOrder,
      isActive: true,
    },
  });
}
await prisma.$disconnect();
console.log(`Seeded admin user, package tiers, formula goals, shop categories, and shop products: ${email}`);
