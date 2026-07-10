export type ProductCategory = "อาหารสุนัข" | "อาหารแมว" | "ขนม" | "อาหารเสริม" | "ของเล่น" | "อุปกรณ์ดูแล" | "ที่นอน & บ้าน";

export interface ShopProduct {
  id: number;
  slug: string;
  name: string;
  category: ProductCategory;
  detail: string;
  description: string;
  weight: string;
  price: number;
  oldPrice?: number;
  image: string;
  galleryImages?: string[];
  color: string;
  badge?: string;
  rating: number;
  benefits: string[];
  ingredients: string;
}

export const PRODUCT_BADGE_COLORS: Record<string, { background: string; color: string; border: string }> = {
  "ขายดี": { background: "#FFF0EC", color: "#B9573E", border: "#F6CFC4" },
  "แนะนำ": { background: "#EAF6EE", color: "#3F7750", border: "#CBE6D3" },
  "ใหม่": { background: "#F1EDFA", color: "#6D58A0", border: "#DDD3F1" },
  "คุ้มค่า": { background: "#FFF7DE", color: "#956C13", border: "#F1DEA2" },
};

export const PRODUCTS: ShopProduct[] = [
  { id: 1, slug: "daily-balance-dog", name: "Daily Balance Dog", category: "อาหารสุนัข", detail: "โปรตีนคุณภาพสูง สำหรับสุนัขโตทุกสายพันธุ์", description: "อาหารเม็ดสูตรสมดุลสำหรับสุนัขโต ออกแบบให้ได้รับโปรตีน ไขมัน และไฟเบอร์ในสัดส่วนเหมาะสมสำหรับการดูแลทุกวัน", weight: "1.5 กก.", price: 590, oldPrice: 650, image: "/images/food_dog.webp", color: "#FFF0E8", badge: "ขายดี", rating: 4.9, benefits: ["โปรตีนคุณภาพช่วยดูแลกล้ามเนื้อ", "โอเมก้า 3 และ 6 ดูแลผิวและขน", "ไฟเบอร์ช่วยให้ระบบขับถ่ายสมดุล"], ingredients: "โปรตีนจากไก่ ข้าวกล้อง น้ำมันปลา ไฟเบอร์ธรรมชาติ วิตามินและแร่ธาตุ" },
  { id: 2, slug: "indoor-care-cat", name: "Indoor Care Cat", category: "อาหารแมว", detail: "สูตรสมดุลแร่ธาตุ ดูแลแมวเลี้ยงในบ้าน", description: "อาหารเม็ดสำหรับแมวโตที่ใช้ชีวิตในบ้าน ให้พลังงานเหมาะกับกิจกรรมและดูแลสมดุลแร่ธาตุในมื้อประจำวัน", weight: "1.2 กก.", price: 520, image: "/images/food_cat.webp", color: "#EEF4FF", badge: "แนะนำ", rating: 4.8, benefits: ["พลังงานเหมาะกับแมวเลี้ยงในบ้าน", "ไฟเบอร์ช่วยดูแลก้อนขน", "สมดุลแร่ธาตุสำหรับแมวโต"], ingredients: "โปรตีนจากปลาและไก่ ข้าว น้ำมันปลา บีทพัลพ์ ทอรีน วิตามินและแร่ธาตุ" },
  { id: 3, slug: "salmon-bites", name: "Salmon Bites", category: "ขนม", detail: "แซลมอนอบแห้ง โปรตีนสูง ไม่เติมเกลือ", description: "ขนมชิ้นพอดีคำจากปลาแซลมอน เหมาะสำหรับให้เป็นรางวัลระหว่างวันหรือใช้ฝึกพฤติกรรม", weight: "80 กรัม", price: 159, image: "/images/snack1.webp", color: "#FFF5E3", badge: "ใหม่", rating: 4.9, benefits: ["โปรตีนจากปลาแซลมอน", "ไม่เติมเกลือและน้ำตาล", "แบ่งให้เป็นรางวัลได้ง่าย"], ingredients: "ปลาแซลมอนและวิตามินอีจากธรรมชาติ" },
  { id: 4, slug: "skin-coat-oil", name: "Skin & Coat Oil", category: "อาหารเสริม", detail: "น้ำมันปลาแซลมอน เสริมโอเมก้า 3 และ 6", description: "ผลิตภัณฑ์เสริมอาหารชนิดน้ำสำหรับคลุกกับอาหารมื้อหลัก ช่วยเพิ่มกรดไขมันจำเป็นในมื้อประจำวัน", weight: "100 มล.", price: 290, image: "/images/groom3.webp", color: "#F4EEFF", rating: 4.7, benefits: ["มีโอเมก้า 3 และ 6", "ใช้ง่าย เพียงผสมในอาหาร", "เหมาะทั้งสุนัขและแมว"], ingredients: "น้ำมันปลาแซลมอน น้ำมันดอกทานตะวัน และวิตามินอี" },
  { id: 5, slug: "weight-control-dog", name: "Weight Control Dog", category: "อาหารสุนัข", detail: "ไขมันต่ำ ไฟเบอร์สูง ช่วยดูแลน้ำหนัก", description: "อาหารสุนัขสูตรควบคุมพลังงานที่ยังคงโปรตีนเพียงพอ เหมาะกับสุนัขโตที่มีกิจกรรมน้อยหรือดูแลน้ำหนัก", weight: "1.5 กก.", price: 640, image: "/images/diet1.webp", color: "#EEFAF2", rating: 4.8, benefits: ["พลังงานและไขมันลดลง", "ไฟเบอร์ช่วยให้อิ่มนาน", "โปรตีนช่วยคงมวลกล้ามเนื้อ"], ingredients: "โปรตีนจากไก่ ข้าวโอ๊ต ไฟเบอร์ถั่ว น้ำมันปลา แอล-คาร์นิทีน" },
  { id: 6, slug: "digestive-care-cat", name: "Digestive Care Cat", category: "อาหารแมว", detail: "สูตรย่อยง่าย พร้อมพรีไบโอติกดูแลลำไส้", description: "อาหารแมวโตสูตรย่อยง่าย คัดเลือกแหล่งโปรตีนและเสริมพรีไบโอติกเพื่อดูแลระบบทางเดินอาหาร", weight: "1.2 กก.", price: 560, image: "/images/food1.webp", color: "#FFF0F1", rating: 4.8, benefits: ["โปรตีนคัดสรรที่ย่อยง่าย", "พรีไบโอติกดูแลจุลินทรีย์ในลำไส้", "ไฟเบอร์สมดุลช่วยการขับถ่าย"], ingredients: "โปรตีนจากปลา ข้าว พรีไบโอติก FOS น้ำมันปลา ทอรีน" },
  { id: 7, slug: "joint-support", name: "Joint Support", category: "อาหารเสริม", detail: "กลูโคซามีนและแร่ธาตุ สำหรับข้อและกระดูก", description: "อาหารเสริมแบบเม็ดสำหรับการดูแลข้อและการเคลื่อนไหว เหมาะกับสัตว์เลี้ยงโตเต็มวัยและวัยสูงอายุ", weight: "60 เม็ด", price: 390, image: "/images/bone.webp", color: "#EEF7F5", rating: 4.7, benefits: ["กลูโคซามีนและคอนดรอยติน", "เสริมแร่ธาตุสำหรับกระดูก", "แบ่งให้ตามน้ำหนักตัวได้"], ingredients: "กลูโคซามีน คอนดรอยติน แคลเซียม และวิตามินดี" },
  { id: 8, slug: "play-treat-set", name: "Play & Treat Set", category: "ของเล่น", detail: "ของเล่นเสริมพัฒนาการพร้อมขนมสุขภาพ", description: "ชุดของขวัญสำหรับสร้างช่วงเวลาดี ๆ ระหว่างเจ้าของกับสัตว์เลี้ยง รวมขนมคำเล็กและของเล่นที่เลือกตามประเภทสัตว์", weight: "1 ชุด", price: 349, image: "/images/toy2.webp", color: "#FFF4EC", badge: "คุ้มค่า", rating: 4.9, benefits: ["ขนมสำหรับให้เป็นรางวัล", "ของเล่นเสริมกิจกรรม", "เหมาะเป็นของขวัญ"], ingredients: "ขนมปลาอบแห้งและของเล่นวัสดุปลอดภัยสำหรับสัตว์เลี้ยง" },
  { id: 9, slug: "soft-grooming-brush", name: "Soft Grooming Brush", category: "อุปกรณ์ดูแล", detail: "แปรงขนนุ่ม ช่วยเก็บขนร่วงและนวดผิว", description: "แปรงดูแลขนที่ออกแบบให้จับถนัดมือ ปลายแปรงโค้งมนสำหรับการแปรงขนประจำวันของสุนัขและแมว", weight: "1 ชิ้น", price: 259, image: "/images/blow.webp", color: "#F1F8F5", badge: "ใหม่", rating: 4.8, benefits: ["ปลายแปรงโค้งมน", "ช่วยเก็บขนที่หลุดร่วง", "ด้ามจับกระชับมือ"], ingredients: "วัสดุ ABS และซี่แปรงสเตนเลสปลายมน" },
  { id: 10, slug: "cozy-pet-house", name: "Cozy Pet House", category: "ที่นอน & บ้าน", detail: "บ้านนุ่มทรงโค้ง ให้พื้นที่พักผ่อนเป็นส่วนตัว", description: "บ้านสัตว์เลี้ยงน้ำหนักเบาพร้อมเบาะรองถอดซักได้ เหมาะสำหรับวางในห้องนั่งเล่นหรือมุมพักผ่อนของน้อง", weight: "ขนาด M", price: 890, image: "/images/home.webp", color: "#FAF1E8", rating: 4.7, benefits: ["เบาะรองถอดซักได้", "ทรงโค้งให้ความรู้สึกปลอดภัย", "น้ำหนักเบา เคลื่อนย้ายง่าย"], ingredients: "ผ้าโพลีเอสเตอร์ โฟมนุ่ม และฐานกันลื่น" },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}
