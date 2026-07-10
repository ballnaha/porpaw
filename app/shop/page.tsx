"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Chip, Container, IconButton, ThemeProvider, Typography } from "@mui/material";
import { ArrowRight, Check, Heart, PackageCheck, Search, ShoppingBag, ShoppingCart, Sparkles, Star } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";
import { DS, theme } from "../components/DesignSystem";
import { useCart } from "../components/CartProvider";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { useClientShopProducts } from "../lib/clientProductStorage";
import { PRODUCT_BADGE_COLORS, type ProductCategory, type ShopProduct } from "../lib/productCatalog";

type Category = "ทั้งหมด" | ProductCategory;
const CATEGORIES: Category[] = ["ทั้งหมด", "อาหารสุนัข", "อาหารแมว", "ขนม", "อาหารเสริม", "ของเล่น", "อุปกรณ์ดูแล", "ที่นอน & บ้าน"];

const lineUrl = "https://line.me/R/ti/p/@baebite";

function getLinkedCartId(productId: number, packageId: number) {
  return Array.from(`${productId}|${packageId}|with-package`).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2000,
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, items, recentlyAddedId } = useCart();
  const allProducts = useClientShopProducts();
  const requestedCategory = searchParams.get("category");
  const category: Category = CATEGORIES.includes(requestedCategory as Category)
    ? requestedCategory as Category
    : "ทั้งหมด";
  const products = allProducts.filter((product) => category === "ทั้งหมด" || product.category === category);
  const requestedPackageId = Number(searchParams.get("packageId"));
  const targetPackage = Number.isFinite(requestedPackageId)
    ? items.find((item) => item.id === requestedPackageId && item.packageContents)
    : undefined;
  const openLine = () => { window.location.href = lineUrl; };
  const getCartId = (product: ShopProduct) => targetPackage ? getLinkedCartId(product.id, targetPackage.id) : product.id;
  const productHref = (product: ShopProduct) => targetPackage
    ? `/shop/${product.slug}?packageId=${targetPackage.id}`
    : `/shop/${product.slug}`;
  const addProduct = (product: ShopProduct) => {
    if (!targetPackage) return addItem(product);
    addItem({
      ...product,
      id: getLinkedCartId(product.id, targetPackage.id),
      productId: product.id,
      deliveryMode: "every-package",
      packageId: targetPackage.id,
      packageName: targetPackage.name,
    });
  };
  const selectCategory = (nextCategory: Category) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategory === "ทั้งหมด") params.delete("category");
    else params.set("category", nextCategory);
    const query = params.toString();
    router.push(`/shop${query ? `?${query}` : ""}`, { scroll: false });
  };

  return <ThemeProvider theme={theme}>
    <Sidebar sectionBase="/" activeItem="Shop" />
    <Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", color: DS.ink, overflowX: "hidden", pb: { xs: 10, md: 0 }, pl: { lg: "104px" } }}>
      <Navbar handleLineLogin={openLine} isConnecting={false} />
      <Box component="main" id="shop">
        <Container maxWidth="lg" sx={{ display: { xs: "none", md: "block" }, px: { xs: 2.5, sm: 3, lg: 1 }, pt: { xs: 2, md: 3 }, pb: 3 }}>
          <Box sx={{ position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr .8fr" }, alignItems: "center", minHeight: { xs: 310, md: 340 }, borderRadius: { xs: "24px", md: "32px" }, background: "linear-gradient(120deg,#FCE8DD 0%,#FFF5EC 58%,#EDF6EF 100%)", p: { xs: 3, sm: 4, md: 5 } }}>
            <Box sx={{ position: "relative", zIndex: 1, maxWidth: 620 }}>
              <Chip icon={<Sparkles size={14} />} label="คัดสรรเพื่อสุขภาพของน้อง" sx={{ bgcolor: "rgba(255,255,255,.78)", fontSize: 13, fontWeight: 600, mb: 2 }} />
              <Typography sx={{ fontSize: { xs: 36, sm: 45, md: 52 }, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-.03em" }}>ของดีที่น้องชอบ<br />และสุขภาพต้องการ</Typography>
              <Typography sx={{ color: "#686169", fontSize: { xs: 16, md: 17 }, fontWeight: 400, lineHeight: 1.7, mt: 1.5, maxWidth: 560 }}>อาหาร ขนม และผลิตภัณฑ์ดูแลที่คัดตามคุณภาพวัตถุดิบ พร้อมคำแนะนำตามสายพันธุ์และเป้าหมายสุขภาพ</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2.5 }}>
                <Button href="#products" endIcon={<ArrowRight size={17} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.75, py: 1.15, "&:hover": { bgcolor: "#44444D" } }}>เลือกซื้อสินค้า</Button>
                <Button component={Link} href="/#calculator" sx={{ color: DS.ink, border: "1px solid rgba(43,43,51,.18)", bgcolor: "rgba(255,255,255,.45)", borderRadius: DS.radius.pill, px: 2.5 }}>คำนวณอาหารก่อน</Button>
              </Box>
            </Box>
            <Box sx={{ position: { xs: "absolute", md: "relative" }, right: { xs: -60, md: 0 }, bottom: { xs: -75, md: -35 }, height: { xs: 220, md: 330 }, opacity: { xs: .3, md: 1 } }}><Image src="/images/box4.webp" alt="กล่องสินค้า baebite" fill priority sizes="(max-width:900px) 240px,420px" style={{ objectFit: "contain", objectPosition: "center bottom" }} /></Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 1.25, mt: 1.5 }}>
            {[[PackageCheck,"คัดคุณภาพ","เลือกจากวัตถุดิบและโภชนาการ"],[ShoppingBag,"จัดกล่องได้","ซื้อแยกหรือรวมใน Subscription"],[Search,"เลือกง่าย","กรองตามประเภทและเป้าหมาย"]].map(([Icon,title,detail]) => { const FeatureIcon = Icon as typeof PackageCheck; return <Box key={title as string} sx={{ display: "flex", alignItems: "center", gap: 1.25, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "16px", p: 1.5 }}><Box sx={{ width: 40, height: 40, display: "grid", placeItems: "center", bgcolor: DS.peachSoft, color: "#B96449", borderRadius: "12px", flexShrink: 0 }}><FeatureIcon size={19} /></Box><Box><Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{title as string}</Typography><Typography sx={{ color: DS.gray, fontSize: 12.5 }}>{detail as string}</Typography></Box></Box>; })}
          </Box>
        </Container>

        <Container id="products" maxWidth="lg" sx={{ px: { xs: 1.5, sm: 3, lg: 1 }, py: { xs: 2.5, md: 6 }, scrollMarginTop: 20 }}>
          {targetPackage && <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 1.5, bgcolor: "#EEF7F0", border: "1px solid #CFE5D4", borderRadius: "18px", px: { xs: 2, sm: 2.5 }, py: 1.75, mb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}><Box sx={{ width: 40, height: 40, display: "grid", placeItems: "center", bgcolor: DS.white, color: "#568768", borderRadius: "12px" }}><PackageCheck size={20} /></Box><Box><Typography sx={{ fontSize: 14.5, fontWeight: 700 }}>เพิ่มสินค้าไปกับ {targetPackage.name}</Typography><Typography sx={{ color: DS.gray, fontSize: 12.5, mt: .2 }}>สินค้าที่เลือกจะถูกส่งพร้อมแพ็กเกจทุกครั้ง และคิดเพิ่มในทุก ๆ รอบ</Typography></Box></Box>
            <Button component={Link} href="/cart" sx={{ color: "#4D7D5B", border: "1px solid #BFD9C5", bgcolor: DS.white, borderRadius: DS.radius.pill, px: 2, fontSize: 12.5, fontWeight: 600 }}>กลับไปตะกร้า</Button>
          </Box>}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "flex-end" }, gap: 2, mb: 3 }}>
            <Box><Typography sx={{ color: "#B96449", fontSize: 13, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>Our products</Typography><Typography sx={{ fontSize: { xs: 30, md: 37 }, fontWeight: 700, letterSpacing: "-.02em", mt: .5 }}>เลือกสิ่งที่ดีที่สุดให้น้อง</Typography><Typography sx={{ color: DS.gray, fontSize: 15, mt: .5 }}>{products.length} รายการ · ราคา Mockup</Typography></Box>
            <Box sx={{ display: "flex", flexWrap: { xs: "nowrap", md: "wrap" }, width: { xs: "calc(100vw - 24px)", md: "auto" }, overflowX: { xs: "auto", md: "visible" }, gap: .75, pb: { xs: .5, md: 0 }, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>{CATEGORIES.map((item) => <Button key={item} onClick={() => selectCategory(item)} aria-pressed={category === item} sx={{ flexShrink: 0, bgcolor: category === item ? DS.ink : DS.white, color: category === item ? DS.white : DS.ink, border: `1px solid ${category === item ? DS.ink : DS.line}`, borderRadius: DS.radius.pill, px: { xs: 1.5, md: 1.9 }, py: .8, fontSize: { xs: 12.5, md: 13.5 }, fontWeight: 600, "&:hover": { bgcolor: category === item ? "#44444D" : DS.peachSoft } }}>{item}</Button>)}</Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", lg: "repeat(4,1fr)" }, gap: { xs: 1, sm: 1.5, md: 2 } }}>
            {products.map((product) => <Box key={product.id} component="article" sx={{ display: "flex", flexDirection: "column", minWidth: 0, bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: { xs: "17px", sm: "22px" }, p: { xs: .75, sm: 1.25 }, transition: "transform .2s,box-shadow .2s", "&:hover": { transform: "translateY(-4px)", boxShadow: DS.cardShadow } }}>
              <Box component={Link} href={productHref(product)} aria-label={`ดูรายละเอียด ${product.name}`} sx={{ position: "relative", display: "block", height: { xs: 145, sm: 210 }, bgcolor: product.color, borderRadius: { xs: "13px", sm: "17px" }, overflow: "hidden" }}>
                {product.badge && <Chip label={product.badge} size="small" sx={{ position: "absolute", zIndex: 2, top: 11, left: 11, bgcolor: PRODUCT_BADGE_COLORS[product.badge]?.background ?? DS.white, color: PRODUCT_BADGE_COLORS[product.badge]?.color ?? DS.ink, border: `1px solid ${PRODUCT_BADGE_COLORS[product.badge]?.border ?? DS.line}`, fontSize: 11.5, fontWeight: 600, boxShadow: "0 4px 12px rgba(43,43,51,.06)" }} />}
                <IconButton aria-label={`บันทึก ${product.name}`} sx={{ position: "absolute", zIndex: 2, top: 8, right: 8, bgcolor: "rgba(255,255,255,.82)", color: DS.ink }}><Heart size={17} /></IconButton>
                <Image src={product.image} alt={product.name} fill sizes="(max-width:600px) 45vw,(max-width:1200px) 45vw,260px" style={{ objectFit: "contain", padding: 14 }} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1, p: "14px 8px 8px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Typography sx={{ color: "#B96449", fontSize: 12.5, fontWeight: 600 }}>{product.category}</Typography><Box sx={{ display: "flex", alignItems: "center", gap: .3 }}><Star size={13} fill="#F6C85F" color="#F6C85F" /><Typography sx={{ color: DS.gray, fontSize: 12.5 }}>{product.rating}</Typography></Box></Box>
                <Typography component={Link} href={productHref(product)} sx={{ color: DS.ink, fontSize: { xs: 15, sm: 18 }, fontWeight: 700, lineHeight: 1.3, mt: .7, textDecoration: "none", "&:hover": { color: "#B96449" } }}>{product.name}</Typography>
                <Typography sx={{ color: "#747079", fontSize: { xs: 12, sm: 14 }, fontWeight: 400, lineHeight: 1.5, mt: .5, minHeight: { xs: 36, sm: 44 }, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.detail}</Typography>
                <Typography sx={{ color: DS.gray, fontSize: 12.5, fontWeight: 500, mt: 1 }}>{product.weight}</Typography>
                <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: .5, mt: "auto", pt: { xs: 1, sm: 1.4 } }}><Box sx={{ minWidth: 0 }}><Typography component="span" sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 700 }}>฿{product.price.toLocaleString()}</Typography>{"oldPrice" in product && <Typography component="span" sx={{ display: { xs: "none", sm: "inline" }, color: DS.gray, fontSize: 12.5, textDecoration: "line-through", ml: .7 }}>฿{product.oldPrice}</Typography>}</Box><IconButton disabled={recentlyAddedId === getCartId(product)} onClick={() => addProduct(product)} aria-label={`เพิ่ม ${product.name} ลงตะกร้า`} sx={{ width: { xs: 36, sm: 42 }, height: { xs: 36, sm: 42 }, flexShrink: 0, bgcolor: recentlyAddedId === getCartId(product) ? DS.mint : DS.ink, color: recentlyAddedId === getCartId(product) ? "#4D7D5B" : DS.white, "&:hover": { bgcolor: DS.peach, color: DS.ink }, "&.Mui-disabled": { bgcolor: DS.mint, color: "#4D7D5B" } }}>{recentlyAddedId === getCartId(product) ? <Check size={17} /> : <ShoppingCart size={17} />}</IconButton></Box>
              </Box>
            </Box>)}
          </Box>
        </Container>

        <Container maxWidth="lg" sx={{ display: { xs: "none", md: "block" }, px: { xs: 2.5, sm: 3, lg: 1 }, pb: { xs: 5, md: 7 } }}><Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 2.5, bgcolor: DS.ink, color: DS.white, borderRadius: { xs: "22px", md: "28px" }, p: { xs: 3, md: 4 } }}><Box><Typography sx={{ color: DS.peach, fontSize: 13, fontWeight: 700, letterSpacing: ".1em" }}>NEED HELP?</Typography><Typography sx={{ fontSize: { xs: 25, md: 32 }, fontWeight: 700, mt: .5 }}>ไม่แน่ใจว่าสูตรไหนเหมาะกับน้อง?</Typography><Typography sx={{ color: "rgba(255,255,255,.7)", fontSize: 15, fontWeight: 400, mt: .6 }}>ส่งข้อมูลน้องให้เรา ช่วยเลือกสินค้าและจัดกล่องให้พอดีได้ฟรี</Typography></Box><Button onClick={openLine} endIcon={<ArrowRight size={17} />} sx={{ bgcolor: DS.peach, color: DS.ink, borderRadius: DS.radius.pill, px: 3, py: 1.15, flexShrink: 0, fontSize: 14 }}>ปรึกษาผ่าน LINE</Button></Box></Container>
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}><Footer /></Box>
      <MobileBottomNav />
    </Box>
  </ThemeProvider>;
}

export default function ShopPage() {
  return <Suspense fallback={<Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA" }} />}>
    <ShopContent />
  </Suspense>;
}
