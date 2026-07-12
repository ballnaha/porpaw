"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Chip, Container, IconButton, ThemeProvider, Typography } from "@mui/material";
import { Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { BackButton } from "../../components/BackButton";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { Footer } from "../../components/Footer";
import { useCart } from "../../components/CartProvider";
import { MobileBottomNav } from "../../components/MobileBottomNav";
import { DS, theme } from "../../components/DesignSystem";
import { useClientShopHydrated, useClientShopProducts } from "../../lib/clientProductStorage";
import { PRODUCT_BADGE_COLORS, type ShopProduct } from "../../lib/productCatalog";

function getLinkedCartId(productId: number, packageId: number) {
  return Array.from(`${productId}|${packageId}|with-package`).reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2000,
  );
}

export default function ProductDetailClient({ product: initialProduct, slug, packageId }: { product: ShopProduct | null; slug: string; packageId?: number }) {
  const allProducts = useClientShopProducts();
  const clientShopHydrated = useClientShopHydrated();
  const product = initialProduct ?? allProducts.find((item) => item.slug === slug) ?? null;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem, items } = useCart();
  const openLine = () => { window.location.href = "https://line.me/R/ti/p/@baebite"; };

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | baebite`;
    }
  }, [product]);

  if (!product && !clientShopHydrated) {
    return <ThemeProvider theme={theme}>
      <Sidebar sectionBase="/" activeItem="Shop" />
      <Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", color: DS.ink, pb: { xs: 10, md: 0 }, pl: { lg: "104px" } }}>
        <Navbar handleLineLogin={openLine} isConnecting={false} />
        <Container component="main" maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, lg: 1 }, py: { xs: 2.5, md: 4.5 } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) minmax(360px,.88fr)" }, gap: { xs: 3, md: 5 }, alignItems: "start" }}>
            <Box sx={{ height: { xs: 360, sm: 480, md: 560 }, bgcolor: "#F3F0EC", borderRadius: { xs: "24px", md: "30px" }, border: `1px solid ${DS.line}` }} />
            <Box sx={{ py: { md: 2 } }}>
              <Box sx={{ width: 130, height: 18, bgcolor: "#F3F0EC", borderRadius: DS.radius.pill, mb: 1.5 }} />
              <Box sx={{ width: "78%", height: 48, bgcolor: "#F3F0EC", borderRadius: "16px", mb: 1.4 }} />
              <Box sx={{ width: "100%", height: 18, bgcolor: "#F3F0EC", borderRadius: DS.radius.pill, mb: .8 }} />
              <Box sx={{ width: "88%", height: 18, bgcolor: "#F3F0EC", borderRadius: DS.radius.pill, mb: 2 }} />
              <Typography sx={{ color: DS.gray, fontSize: 14.5, fontWeight: 700 }}>กำลังโหลดข้อมูลสินค้า...</Typography>
            </Box>
          </Box>
        </Container>
        <MobileBottomNav />
      </Box>
    </ThemeProvider>;
  }

  if (!product) {
    return <ThemeProvider theme={theme}>
      <Sidebar sectionBase="/" activeItem="Shop" />
      <Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", color: DS.ink, pb: { xs: 10, md: 0 }, pl: { lg: "104px" } }}>
        <Navbar handleLineLogin={openLine} isConnecting={false} />
        <Container component="main" maxWidth="sm" sx={{ px: { xs: 2.5, sm: 3 }, py: { xs: 5, md: 8 }, textAlign: "center" }}>
          <Typography component="h1" sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 800 }}>ไม่พบสินค้า</Typography>
          <Typography sx={{ color: DS.gray, fontSize: 15, lineHeight: 1.7, mt: 1 }}>สินค้าอาจถูกลบ หรือข้อมูลยังไม่ถูกบันทึกใน browser นี้</Typography>
          <Button component={Link} href="/shop" sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.5, py: 1.1, mt: 2.2, "&:hover": { bgcolor: "#44444D" } }}>กลับร้านค้า</Button>
        </Container>
        <MobileBottomNav />
      </Box>
    </ThemeProvider>;
  }

  const gallery = product.galleryImages?.length
    ? Array.from(new Set([product.image, ...product.galleryImages]))
    : [product.image, "/images/box4.webp", "/images/delivery.webp"];
  const targetPackage = packageId ? items.find((item) => item.id === packageId && item.packageContents) : undefined;
  const relatedProducts = [
    ...allProducts.filter((item) => item.category === product.category && item.id !== product.id),
    ...allProducts.filter((item) => item.category !== product.category && item.id !== product.id),
  ].slice(0, 4);
  const addToCart = () => {
    addItem(targetPackage ? {
      ...product,
      id: getLinkedCartId(product.id, targetPackage.id),
      productId: product.id,
      deliveryMode: "every-package",
      packageId: targetPackage.id,
      packageName: targetPackage.name,
    } : product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  const addRelatedToCart = (item: ShopProduct) => {
    addItem(targetPackage ? {
      ...item,
      id: getLinkedCartId(item.id, targetPackage.id),
      productId: item.id,
      deliveryMode: "every-package",
      packageId: targetPackage.id,
      packageName: targetPackage.name,
    } : item);
  };
  const showPreviousImage = () => setActiveImage((current) => (current - 1 + gallery.length) % gallery.length);
  const showNextImage = () => setActiveImage((current) => (current + 1) % gallery.length);

  return <ThemeProvider theme={theme}>
    <Sidebar sectionBase="/" activeItem="Shop" />
    <Box sx={{ minHeight: "100vh", bgcolor: "#FCFBFA", color: DS.ink, pb: { xs: 10, md: 0 }, pl: { lg: "104px" } }}>
      <Navbar handleLineLogin={openLine} isConnecting={false} />
      <Container component="main" maxWidth="lg" sx={{ px: { xs: 2.5, sm: 3, lg: 1 }, py: { xs: 2.5, md: 4.5 } }}>
        <BackButton fallbackHref={targetPackage ? `/shop?packageId=${targetPackage.id}` : "/shop"} preferHistory>
          กลับ
        </BackButton>
        <Box component="nav" aria-label="Breadcrumb" sx={{ display: "flex", alignItems: "center", gap: .75, color: DS.gray, fontSize: 13.5, mb: 2.5 }}><Box component={Link} href={targetPackage ? `/shop?packageId=${targetPackage.id}` : "/shop"} sx={{ color: DS.gray, textDecoration: "none", "&:hover": { color: DS.ink } }}>ร้านค้า</Box><span>/</span><Box component={Link} href={`/shop?category=${encodeURIComponent(product.category)}${targetPackage ? `&packageId=${targetPackage.id}` : ""}`} sx={{ color: DS.gray, textDecoration: "none", "&:hover": { color: "#B96449" } }}>{product.category}</Box><span>/</span><Typography component="span" noWrap sx={{ color: DS.ink, fontSize: 13.5, maxWidth: 200 }}>{product.name}</Typography></Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) minmax(360px,.88fr)" }, gap: { xs: 3, md: 5 }, alignItems: "start" }}>
          <Box>
            <Box sx={{ position: "relative", height: { xs: 360, sm: 480, md: 560 }, bgcolor: product.color, borderRadius: { xs: "24px", md: "30px" }, overflow: "hidden" }}>
              {product.badge && <Chip label={product.badge} sx={{ position: "absolute", zIndex: 2, top: 18, left: 18, bgcolor: PRODUCT_BADGE_COLORS[product.badge]?.background ?? DS.white, color: PRODUCT_BADGE_COLORS[product.badge]?.color ?? DS.ink, border: `1px solid ${PRODUCT_BADGE_COLORS[product.badge]?.border ?? DS.line}`, fontSize: 13, fontWeight: 600, boxShadow: "0 5px 14px rgba(43,43,51,.08)" }} />}
              <IconButton aria-label="บันทึกสินค้า" sx={{ position: "absolute", zIndex: 2, top: 14, right: 14, bgcolor: "rgba(255,255,255,.82)", color: DS.ink, "&:hover": { bgcolor: DS.white, color: "#D35F69" } }}><Heart size={20} /></IconButton>
              <Image key={gallery[activeImage]} src={gallery[activeImage]} alt={activeImage === 0 ? `${product.name} ${product.detail}` : `${product.name} ภาพประกอบ ${activeImage + 1}`} fill priority={activeImage === 0} loading={activeImage === 0 ? "eager" : "lazy"} sizes="(max-width:900px) 92vw,600px" style={{ objectFit: "contain", padding: "clamp(28px,6vw,70px)" }} />
              <IconButton onClick={showPreviousImage} aria-label="ดูภาพก่อนหน้า" sx={{ position: "absolute", zIndex: 2, left: 14, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,.9)", color: DS.ink, boxShadow: "0 6px 18px rgba(43,43,51,.1)", "&:hover": { bgcolor: DS.white } }}><ChevronLeft size={20} /></IconButton>
              <IconButton onClick={showNextImage} aria-label="ดูภาพถัดไป" sx={{ position: "absolute", zIndex: 2, right: 14, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,.9)", color: DS.ink, boxShadow: "0 6px 18px rgba(43,43,51,.1)", "&:hover": { bgcolor: DS.white } }}><ChevronRight size={20} /></IconButton>
              <Box sx={{ position: "absolute", zIndex: 2, left: "50%", bottom: 15, transform: "translateX(-50%)", display: "flex", gap: .65 }}>{gallery.map((_, index) => <Box key={index} component="button" onClick={() => setActiveImage(index)} aria-label={`ดูภาพที่ ${index + 1}`} sx={{ width: activeImage === index ? 22 : 7, height: 7, border: 0, p: 0, borderRadius: DS.radius.pill, bgcolor: activeImage === index ? DS.ink : "rgba(43,43,51,.25)", cursor: "pointer", transition: "width .2s, background-color .2s" }} />)}</Box>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, mt: 1 }}>
              {gallery.map((image, index) => <Box key={image} component="button" type="button" onClick={() => setActiveImage(index)} aria-label={`เลือกภาพสินค้า ${index + 1}`} aria-pressed={activeImage === index} sx={{ position: "relative", height: { xs: 82, sm: 105 }, bgcolor: index === 0 ? product.color : DS.white, border: `1.5px solid ${activeImage === index ? DS.peach : DS.line}`, borderRadius: "14px", overflow: "hidden", cursor: "pointer", boxShadow: activeImage === index ? "0 0 0 3px rgba(245,185,155,.2)" : "none", transition: "border-color .2s, box-shadow .2s, transform .2s", "&:hover": { transform: "translateY(-2px)", borderColor: DS.peach } }}><Image src={image} alt="" fill sizes="180px" style={{ objectFit: "contain", padding: 10 }} /></Box>)}
            </Box>
          </Box>

          <Box sx={{ position: { md: "sticky" }, top: 20 }}>
            {targetPackage && <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#EEF7F0", border: "1px solid #CFE5D4", borderRadius: "14px", p: 1.25, mb: 2 }}><ShoppingCart size={17} color="#568768" /><Box><Typography sx={{ fontSize: 13, fontWeight: 700 }}>ส่งพร้อม {targetPackage.name}</Typography><Typography sx={{ color: DS.gray, fontSize: 11.5 }}>สินค้านี้จะถูกส่งพร้อมแพ็กเกจทุกครั้งตามรอบจัดส่ง</Typography></Box></Box>}            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}><Typography sx={{ color: "#B96449", fontSize: 13.5, fontWeight: 600 }}>{product.category}</Typography><Box sx={{ display: "flex", alignItems: "center", gap: .5 }}><Star size={16} fill="#F6C85F" color="#F6C85F" /><Typography sx={{ fontSize: 14, fontWeight: 600 }}>{product.rating}</Typography><Typography sx={{ color: DS.gray, fontSize: 13 }}>(Mockup reviews)</Typography></Box></Box>
            <Typography component="h1" sx={{ fontSize: { xs: 34, sm: 40, md: 46 }, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-.03em", mt: 1 }}>{product.name}</Typography>
            <Typography sx={{ color: "#625E65", fontSize: { xs: 16, md: 17 }, fontWeight: 400, lineHeight: 1.75, mt: 1.5 }}>{product.description}</Typography>
            <Typography sx={{ color: DS.gray, fontSize: 14, fontWeight: 500, mt: 1.25 }}>ขนาด {product.weight}</Typography>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 2.5 }}><Typography sx={{ fontSize: 38, fontWeight: 700, letterSpacing: "-.025em" }}>฿{product.price.toLocaleString()}</Typography>{product.oldPrice && <Typography sx={{ color: DS.gray, fontSize: 16, textDecoration: "line-through" }}>฿{product.oldPrice.toLocaleString()}</Typography>}</Box>

            <Box sx={{ borderTop: `1px solid ${DS.line}`, borderBottom: `1px solid ${DS.line}`, py: 2.25, mt: 2 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1.25 }}>จุดเด่นของสินค้า</Typography>
              <Box sx={{ display: "grid", gap: 1 }}>{product.benefits.map((benefit) => <Box key={benefit} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}><Box sx={{ width: 21, height: 21, display: "grid", placeItems: "center", bgcolor: DS.mint, color: "#568768", borderRadius: "50%", flexShrink: 0, mt: .1 }}><Check size={12} strokeWidth={3} /></Box><Typography sx={{ color: "#625E65", fontSize: 15, fontWeight: 400, lineHeight: 1.5 }}>{benefit}</Typography></Box>)}</Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mt: 2.5 }}><Box sx={{ display: "flex", alignItems: "center", border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, p: .4 }}><IconButton disabled={added} size="small" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="ลดจำนวน"><Minus size={15} /></IconButton><Typography sx={{ width: 38, textAlign: "center", fontSize: 15, fontWeight: 600 }}>{quantity}</Typography><IconButton disabled={added} size="small" onClick={() => setQuantity((value) => value + 1)} aria-label="เพิ่มจำนวน"><Plus size={15} /></IconButton></Box><Button disabled={added} onClick={addToCart} startIcon={added ? <Check size={18} /> : <ShoppingCart size={18} />} fullWidth sx={{ bgcolor: added ? DS.mint : DS.ink, color: added ? "#436E51" : DS.white, borderRadius: DS.radius.pill, py: 1.25, fontSize: 16, fontWeight: 600, "&:hover": { bgcolor: added ? DS.mint : "#44444D" }, "&.Mui-disabled": { bgcolor: DS.mint, color: "#436E51" } }}>{added ? "เพิ่มลงตะกร้าแล้ว" : targetPackage ? "เพิ่มเป็นสินค้าเสริมทุกรอบ" : "เพิ่มลงตะกร้า"}</Button></Box>
            <Button component={Link} href="/cart" fullWidth sx={{ color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, py: 1.1, mt: 1 }}>ดูตะกร้าและชำระเงิน</Button>

          </Box>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mt: { xs: 4, md: 6 } }}><Box sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "22px", p: { xs: 2.25, md: 3 } }}><Typography sx={{ fontSize: 21, fontWeight: 700 }}>ส่วนประกอบสำคัญ</Typography><Typography sx={{ color: "#625E65", fontSize: 15.5, fontWeight: 400, lineHeight: 1.75, mt: 1 }}>{product.ingredients}</Typography></Box><Box sx={{ bgcolor: "#FFF7F1", border: "1px solid #F6E4D8", borderRadius: "22px", p: { xs: 2.25, md: 3 } }}><Typography sx={{ fontSize: 21, fontWeight: 700 }}>คำแนะนำการให้อาหาร</Typography><Typography sx={{ color: "#625E65", fontSize: 15.5, fontWeight: 400, lineHeight: 1.75, mt: 1 }}>ปริมาณที่เหมาะสมขึ้นอยู่กับน้ำหนัก อายุ กิจกรรม และผลิตภัณฑ์หลักของน้อง ควรอ่านฉลากและปรับตามคำแนะนำของสัตวแพทย์</Typography></Box></Box>
        {relatedProducts.length > 0 && <Box component="section" aria-labelledby="related-products-title" sx={{ mt: { xs: 5, md: 7 } }}>
          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 2.5 }}><Box><Typography id="related-products-title" sx={{ fontSize: { xs: 25, md: 30 }, fontWeight: 700 }}>สินค้าที่ใกล้เคียงกัน</Typography><Typography sx={{ color: DS.gray, fontSize: 14, mt: .4 }}>สินค้าอื่นที่น้องอาจชอบ</Typography></Box><Button component={Link} href={`/shop?category=${encodeURIComponent(product.category)}${targetPackage ? `&packageId=${targetPackage.id}` : ""}`} sx={{ display: { xs: "none", sm: "inline-flex" }, color: "#B96449", fontSize: 13.5 }}>ดูหมวด {product.category}</Button></Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }, gap: 1.5 }}>
            {relatedProducts.map((item) => <Box key={item.id} component="article" sx={{ display: "flex", flexDirection: "column", bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "20px", p: 1.1, transition: "transform .2s, box-shadow .2s", "&:hover": { transform: "translateY(-3px)", boxShadow: DS.cardShadow } }}>
              <Box component={Link} href={`/shop/${item.slug}${targetPackage ? `?packageId=${targetPackage.id}` : ""}`} sx={{ position: "relative", display: "block", height: 180, bgcolor: item.color, borderRadius: "15px", overflow: "hidden" }}><Image src={item.image} alt={item.name} fill sizes="(max-width:600px) 88vw,260px" style={{ objectFit: "contain", padding: 18 }} /></Box>
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1, p: "12px 7px 7px" }}><Typography sx={{ color: "#B96449", fontSize: 12, fontWeight: 600 }}>{item.category}</Typography><Typography component={Link} href={`/shop/${item.slug}${targetPackage ? `?packageId=${targetPackage.id}` : ""}`} sx={{ color: DS.ink, fontSize: 17, fontWeight: 700, lineHeight: 1.3, textDecoration: "none", mt: .5, "&:hover": { color: "#B96449" } }}>{item.name}</Typography><Typography sx={{ color: DS.gray, fontSize: 13, lineHeight: 1.5, mt: .4 }}>{item.weight}</Typography><Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto", pt: 1.2 }}><Typography sx={{ fontSize: 20, fontWeight: 700 }}>฿{item.price.toLocaleString()}</Typography><IconButton onClick={() => addRelatedToCart(item)} aria-label={`เพิ่ม ${item.name} ลงตะกร้า`} sx={{ width: 38, height: 38, bgcolor: DS.ink, color: DS.white, "&:hover": { bgcolor: DS.peach, color: DS.ink } }}><ShoppingCart size={16} /></IconButton></Box></Box>
            </Box>)}
          </Box>
        </Box>}
      </Container>
      <Box sx={{ display: { xs: "none", md: "block" } }}><Footer /></Box>
      <MobileBottomNav />
    </Box>
  </ThemeProvider>;
}
