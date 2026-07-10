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

await prisma.$disconnect();
console.log(`Seeded admin user, package tiers, and formula goals: ${email}`);
