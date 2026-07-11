"use client";

import { type ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material";
import { ArrowLeft, Check, Eye, ImagePlus, Minus, Pencil, Plus, Sparkles, Star, Trash2, UploadCloud } from "lucide-react";
import { AdminPagination } from "../_components/AdminPagination";
import { DS } from "../../components/DesignSystem";
import { useToast } from "../../components/ToastProvider";
import { saveClientShopData, useClientShopData } from "../../lib/clientProductStorage";
import { PRODUCTS, PRODUCT_BADGE_COLORS, type ProductCategory, type ShopProduct } from "../../lib/productCatalog";
import { adminFontFamily } from "../_components/adminFonts";
import { useShopCategories } from "../../lib/clientCategoryStorage";

const badges = ["", "ขายดี", "แนะนำ", "ใหม่", "คุ้มค่า"];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: DS.white,
    borderRadius: "14px",
    "& fieldset": { borderColor: DS.line },
    "&:hover fieldset": { borderColor: DS.peach },
    "&.Mui-focused fieldset": { borderColor: DS.peach },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#B96449" },
} as const;

const selectMenuProps = {
  slotProps: {
    paper: {
      sx: {
        border: `1px solid ${DS.line}`,
        borderRadius: "14px",
        boxShadow: "0 16px 34px rgba(43,43,51,.12)",
        mt: .6,
        "& .MuiMenu-list": { py: .6 },
        "& .MuiMenuItem-root": {
          fontFamily: adminFontFamily,
          fontSize: 13.5,
          fontWeight: 700,
          borderRadius: "10px",
          mx: .7,
          minHeight: 38,
          "&.Mui-selected": { bgcolor: DS.peachSoft },
          "&.Mui-selected:hover": { bgcolor: DS.peachSoft },
        },
      },
    },
  },
} as const;

type FormState = {
  name: string;
  slug: string;
  category: ProductCategory;
  detail: string;
  description: string;
  weight: string;
  price: string;
  oldPrice: string;
  image: string;
  galleryImages: string[];
  color: string;
  badge: string;
  rating: string;
  benefits: string;
  ingredients: string;
};

type ManagerMode = "list" | "new" | "edit";

type PendingImage = {
  file: File;
  previewUrl: string;
};

type FormErrors = Partial<Record<keyof FormState | "images", string>>;

const initialForm: FormState = {
  name: "",
  slug: "",
  category: "อาหารสุนัข",
  detail: "",
  description: "",
  weight: "",
  price: "",
  oldPrice: "",
  image: "",
  galleryImages: [],
  color: "#FFF0E8",
  badge: "",
  rating: "4.8",
  benefits: "",
  ingredients: "",
};

function slugify(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("th-TH")
    .normalize("NFC")
    .replace(/[^\p{Script=Thai}a-z0-9]+/giu, "-")
    .replace(/^-+|-+$/g, "");
}

function parseBenefits(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueImages(images: string[]) {
  return Array.from(new Set(images.filter(Boolean)));
}

function normalizeDecimal(value: string) {
  return value
    .replace(/[^\d.]/g, "")
    .replace(/(\..*)\./g, "$1");
}

function parseWeightKg(value: string) {
  const normalized = value.trim().toLowerCase();
  const number = Number(normalized.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(number) || number <= 0) return "";

  if (normalized.includes("kg") || normalized.includes("กิโลกรัม")) {
    return String(number);
  }

  if (normalized.includes("กรัม") || normalized.includes("gram") || normalized.includes("g")) {
    return String(Math.round(number) / 1000);
  }

  return String(number);
}

function formatWeightKg(value: string) {
  const weight = Number(value);
  if (!Number.isFinite(weight) || weight <= 0) return "0 kg";

  return `${Number(weight.toFixed(2)).toLocaleString()} kg`;
}

function isValidHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

function productImages(product: ShopProduct) {
  return uniqueImages([product.image, ...(product.galleryImages ?? [])]);
}

function uploadedShopImages(product: ShopProduct) {
  return productImages(product).filter((image) => image.startsWith("/uploads/shop/"));
}

function unreferencedUploadedImages(target: ShopProduct, products: ShopProduct[]) {
  const remainingImages = new Set(
    products
      .filter((product) => product.slug !== target.slug)
      .flatMap(productImages),
  );

  return uploadedShopImages(target).filter((image) => !remainingImages.has(image));
}

function productToForm(product: ShopProduct): FormState {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    detail: product.detail,
    description: product.description,
    weight: parseWeightKg(product.weight),
    price: String(product.price),
    oldPrice: product.oldPrice ? String(product.oldPrice) : "",
    image: product.image,
    galleryImages: product.galleryImages ?? [],
    color: product.color,
    badge: product.badge ?? "",
    rating: String(product.rating),
    benefits: product.benefits.join("\n"),
    ingredients: product.ingredients,
  };
}

function ProductImage({ src, alt, sizes, padding = 14, eager = false }: { src: string; alt: string; sizes: string; padding?: number | string; eager?: boolean }) {
  if (!src) {
    return (
      <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2, textAlign: "center", color: DS.gray }}>
        <Box>
          <Box sx={{ width: 44, height: 44, display: "grid", placeItems: "center", mx: "auto", bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "15px", mb: 1 }}>
            <UploadCloud size={20} />
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 900 }}>Upload cover image</Typography>
          <Typography sx={{ fontSize: 11.5, mt: .25 }}>ยังไม่มีรูปสินค้า</Typography>
        </Box>
      </Box>
    );
  }

  const uploaded = src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("http://") || src.startsWith("https://");

  if (uploaded) {
    return <Box component="img" src={src} alt={alt} loading={eager ? "eager" : "lazy"} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} style={{ padding: typeof padding === "number" ? `${padding}px` : padding }} />;
  }

  return <Image src={src} alt={alt} fill sizes={sizes} loading={eager ? "eager" : "lazy"} priority={eager} style={{ objectFit: "contain", padding }} />;
}

export function ProductAdminManager() {
  const { showToast } = useToast();
  const { products, deletedSlugs } = useClientShopData();
  const { categories: dbCategories } = useShopCategories();
  const [mode, setMode] = useState<ManagerMode>("list");
  const [editingSlug, setEditingSlug] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ShopProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const nextId = useMemo(() => Math.max(...products.map((item) => item.id), 0) + 1, [products]);
  const customCount = products.filter((product) => !PRODUCTS.some((catalogProduct) => catalogProduct.slug === product.slug)).length;
  const categoryCount = new Set(products.map((product) => product.category)).size;
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pagedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const benefits = parseBenefits(form.benefits);
  const gallery = uniqueImages([form.image, ...form.galleryImages]);
  const preview: ShopProduct = {
    id: nextId,
    slug: form.slug || slugify(form.name) || "new-product",
    name: form.name || "ชื่อสินค้าใหม่",
    category: form.category,
    detail: form.detail || "คำอธิบายสั้นสำหรับหน้ารวมสินค้า",
    description: form.description || "คำอธิบายเต็มสำหรับหน้ารายละเอียดสินค้า",
    weight: form.weight ? formatWeightKg(form.weight) : "0 kg",
    price: Number(form.price) || 0,
    oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
    image: form.image,
    galleryImages: form.galleryImages,
    color: form.color || "#FFF0E8",
    badge: form.badge || undefined,
    rating: Number(form.rating) || 4.8,
    benefits: benefits.length ? benefits : ["จุดเด่นสินค้า 1", "จุดเด่นสินค้า 2", "จุดเด่นสินค้า 3"],
    ingredients: form.ingredients || "ส่วนประกอบสำคัญของสินค้า",
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const price = Number(form.price);
    const oldPrice = Number(form.oldPrice);
    const rating = Number(form.rating);
    const weight = Number(form.weight);

    if (!form.name.trim()) nextErrors.name = "กรอกชื่อสินค้า";

    if (!form.slug.trim()) nextErrors.slug = "กรอก slug";
    else if (products.some((item) => item.slug === preview.slug && (mode === "new" || item.slug !== editingSlug))) nextErrors.slug = "slug นี้ถูกใช้แล้ว";

    if (!Number.isFinite(weight) || weight <= 0) nextErrors.weight = "กรอกน้ำหนักมากกว่า 0 kg";
    if (!Number.isFinite(price) || price <= 0) nextErrors.price = "กรอกราคามากกว่า 0";
    if (form.oldPrice && (!Number.isFinite(oldPrice) || oldPrice <= 0)) nextErrors.oldPrice = "ราคาเดิมต้องมากกว่า 0";
    else if (form.oldPrice && oldPrice <= price) nextErrors.oldPrice = "ราคาเดิมควรมากกว่าราคาขาย";

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) nextErrors.rating = "Rating ต้องอยู่ระหว่าง 0-5";
    if (!isValidHexColor(form.color)) nextErrors.color = "ใช้รูปแบบสี เช่น #FFF0E8";
    if (!form.detail.trim()) nextErrors.detail = "กรอกคำอธิบายสั้น";
    if (!form.description.trim()) nextErrors.description = "กรอกรายละเอียดสินค้า";
    if (!form.image.trim()) nextErrors.images = "เลือกภาพหน้าปกสินค้า";
    if (!form.benefits.trim()) nextErrors.benefits = "กรอกจุดเด่นสินค้า";
    if (!form.ingredients.trim()) nextErrors.ingredients = "กรอกส่วนประกอบสำคัญ";

    return nextErrors;
  };

  const update = (key: keyof FormState, value: string) => {
    setMessage("");
    setErrors((current) => ({ ...current, [key]: undefined, ...(key === "image" ? { images: undefined } : {}) }));
    if (key === "slug") setSlugEdited(Boolean(value.trim()));

    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !slugEdited ? { slug: slugify(value) } : {}),
    }));
  };

  const stepNumber = (key: "weight" | "price" | "oldPrice", amount: number, precision = 0) => {
    setMessage("");
    setErrors((current) => ({ ...current, [key]: undefined }));
    setForm((current) => {
      const currentValue = Number(current[key]) || 0;
      const nextValue = Math.max(0, currentValue + amount);

      return {
        ...current,
        [key]: precision > 0 ? Number(nextValue.toFixed(precision)).toString() : String(Math.round(nextValue)),
      };
    });
  };

  const clearPendingImages = (images = pendingImages) => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  };

  const selectImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    event.target.value = "";
    if (!files.length) return;

    setMessage("");
    setErrors((current) => ({ ...current, images: undefined }));
    const nextPending = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    const previews = nextPending.map((image) => image.previewUrl);

    setPendingImages((current) => [...current, ...nextPending]);
    setForm((current) => {
      const nextGallery = uniqueImages([...current.galleryImages, ...previews]);

      return {
        ...current,
        image: current.image || previews[0],
        galleryImages: nextGallery,
      };
    });
    setMessage(`เลือกไว้ ${files.length} รูปแล้ว ระบบจะอัปโหลดเมื่อกดบันทึก`);
  };

  const uploadPendingImages = async () => {
    if (!pendingImages.length) return new Map<string, string>();

    const payload = new FormData();
    pendingImages.forEach((image) => payload.append("images", image.file));
    const response = await fetch("/api/admin/shop/upload", { method: "POST", body: payload });
    const result = await response.json() as { images?: string[]; error?: string };

    if (!response.ok || !result.images || result.images.length !== pendingImages.length) {
      throw new Error(result.error ?? "Upload failed");
    }

    return new Map(pendingImages.map((image, index) => [image.previewUrl, result.images?.[index] ?? image.previewUrl]));
  };

  const resolvePendingForm = (urlMap: Map<string, string>) => {
    const image = urlMap.get(form.image) ?? form.image;
    const galleryImages = uniqueImages(form.galleryImages.map((item) => urlMap.get(item) ?? item));

    return {
      ...form,
      image,
      galleryImages,
    };
  };

  const setCoverImage = (image: string) => {
    setMessage("");
    setErrors((current) => ({ ...current, images: undefined }));
    setForm((current) => ({ ...current, image, galleryImages: uniqueImages([image, ...current.galleryImages]) }));
  };

  const removeImage = (image: string) => {
    setMessage("");
    setPendingImages((current) => {
      const removed = current.find((item) => item.previewUrl === image);
      if (removed) URL.revokeObjectURL(removed.previewUrl);

      return current.filter((item) => item.previewUrl !== image);
    });
    setForm((current) => {
      const nextGallery = current.galleryImages.filter((item) => item !== image);
      const nextImage = current.image === image ? nextGallery[0] ?? "" : current.image;
      if (nextImage) setErrors((currentErrors) => ({ ...currentErrors, images: undefined }));
      return { ...current, image: nextImage, galleryImages: nextGallery };
    });
  };

  const openNew = () => {
    clearPendingImages();
    setPendingImages([]);
    setForm(initialForm);
    setErrors({});
    setSlugEdited(false);
    setEditingSlug("");
    setMessage("");
    setMode("new");
  };

  const openEdit = (product: ShopProduct) => {
    clearPendingImages();
    setPendingImages([]);
    setForm(productToForm(product));
    setErrors({});
    setSlugEdited(true);
    setEditingSlug(product.slug);
    setMessage("");
    setMode("edit");
  };

  const backToList = () => {
    clearPendingImages();
    setPendingImages([]);
    setForm(initialForm);
    setErrors({});
    setSlugEdited(false);
    setEditingSlug("");
    setMode("list");
  };

  const saveProduct = async () => {
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("ตรวจสอบข้อมูลที่ต้องแก้ไขก่อนบันทึก");
      return;
    }

    setIsSaving(true);
    let productToSave = preview;

    try {
      const urlMap = await uploadPendingImages();
      const resolvedForm = resolvePendingForm(urlMap);
      productToSave = {
        ...preview,
        image: resolvedForm.image,
        galleryImages: resolvedForm.galleryImages,
      };
    } catch {
      setMessage("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
      setIsSaving(false);
      return;
    }

    const nextProducts = mode === "edit"
      ? products.map((product) => product.slug === editingSlug ? { ...productToSave, id: product.id } : product)
      : [productToSave, ...products];
    const nextDeletedSlugs = deletedSlugs.filter((slug) => slug !== productToSave.slug);
    saveClientShopData(nextProducts, nextDeletedSlugs);
    clearPendingImages();
    setPendingImages([]);
    setForm(initialForm);
    setSlugEdited(false);
    setEditingSlug("");
    setMode("list");
    setPage(1);
    setIsSaving(false);
    setMessage(mode === "edit" ? `บันทึก ${productToSave.name} แล้ว` : `เพิ่ม ${productToSave.name} ในรายการหลังบ้านแล้ว`);
    showToast({
      title: mode === "edit" ? "บันทึกสินค้าแล้ว" : "เพิ่มสินค้าแล้ว",
      message: productToSave.name,
      hideAction: true,
    });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const target = deleteTarget;
    const imagesToDelete = unreferencedUploadedImages(target, products);
    const nextProducts = products.filter((item) => item.slug !== target.slug);
    const nextDeletedSlugs = uniqueImages([...deletedSlugs, target.slug]);

    if (imagesToDelete.length) {
      try {
        await fetch("/api/admin/shop/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: imagesToDelete }),
        });
      } catch {
        setMessage("ลบสินค้าแล้ว แต่ลบไฟล์รูปบางส่วนไม่สำเร็จ");
      }
    }

    saveClientShopData(nextProducts, nextDeletedSlugs);
    setMessage(`ลบ ${target.name} ออกจากรายการแล้ว`);
    setDeleteTarget(null);
    setIsDeleting(false);
    setPage((p) => Math.min(p, Math.max(1, Math.ceil(nextProducts.length / PAGE_SIZE))));
    showToast({ title: "ลบสินค้าแล้ว", message: `${target.name}${imagesToDelete.length ? ` · ลบรูป ${imagesToDelete.length} ไฟล์` : ""}`, hideAction: true });
  };

  if (mode === "list") {
    return (
      <Box sx={{ display: "grid", gap: 1.6 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 1.2 }}>
          {[
            { label: "Products", value: products.length, detail: "รายการทั้งหมด" },
            { label: "Categories", value: categoryCount, detail: "หมวดหมู่ที่เปิดใช้" },
            { label: "Custom", value: customCount, detail: "แก้ไข/เพิ่มจากหลังบ้าน" },
          ].map((item) => (
            <Box key={item.label} sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "18px", p: 1.7 }}>
              <Typography sx={{ color: DS.gray, fontSize: 12, fontWeight: 900 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 29, fontWeight: 900, lineHeight: 1.1, mt: .3 }}>{item.value}</Typography>
              <Typography sx={{ color: DS.gray, fontSize: 12.5, mt: .3 }}>{item.detail}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "24px", overflow: "hidden", boxShadow: "0 8px 22px rgba(43,43,51,.05)" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap", px: { xs: 1.6, md: 2.1 }, py: 1.6, borderBottom: `1px solid ${DS.line}` }}>
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 900 }}>รายการสินค้า</Typography>
              <Typography sx={{ color: DS.gray, fontSize: 13, mt: .25 }}>จัดการสินค้าในหน้าร้าน แก้ไขข้อมูล หรือลบรายการที่ไม่ต้องการแสดง</Typography>
            </Box>
            <Button onClick={openNew} startIcon={<Plus size={16} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.2, py: 1, fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#44444D" } }}>
              New product
            </Button>
          </Box>

          {message && (
            <Box sx={{ mx: { xs: 1.6, md: 2.1 }, mt: 1.3, bgcolor: message.startsWith("ลบ") ? "#FFF8E7" : "#EEF7F0", color: message.startsWith("ลบ") ? "#8A6320" : "#4D7D5B", border: `1px solid ${message.startsWith("ลบ") ? "#F6DCA6" : "#CFE5D4"}`, borderRadius: "14px", px: 1.35, py: 1, fontSize: 12.8, fontWeight: 800 }}>
              {message}
            </Box>
          )}

          <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "minmax(0,1.1fr) 150px 130px 110px 236px", gap: 1, bgcolor: "#F8F7F5", borderTop: message ? `1px solid ${DS.line}` : 0, borderBottom: `1px solid ${DS.line}`, px: 2.1, py: 1.15, mt: message ? 1.3 : 0 }}>
            {["สินค้า", "หมวดหมู่", "ราคา", "สถานะ", "จัดการ"].map((item) => <Typography key={item} sx={{ color: DS.gray, fontSize: 12, fontWeight: 900, letterSpacing: ".06em" }}>{item}</Typography>)}
          </Box>
          {pagedProducts.map((product, index) => (
            <Box key={product.slug} sx={{ display: "grid", gridTemplateColumns: { xs: "64px minmax(0,1fr)", md: "minmax(0,1.1fr) 150px 130px 110px 236px" }, gap: { xs: 1, md: 1 }, alignItems: "center", borderBottom: `1px solid ${DS.line}`, px: 2.1, py: 1.35, "&:last-child": { borderBottom: 0 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.15, minWidth: 0 }}>
                <Box sx={{ position: "relative", width: 52, height: 52, bgcolor: product.color, borderRadius: "14px", overflow: "hidden", flexShrink: 0 }}>
                  <ProductImage src={product.image} alt={product.name} sizes="52px" padding={7} eager={index === 0} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 900 }}>{product.name}</Typography>
                  <Typography sx={{ color: DS.gray, fontSize: 12, mt: .1 }}>{product.slug} · {product.weight}</Typography>
                </Box>
              </Box>
              <Typography sx={{ color: DS.gray, fontSize: 13 }}>{product.category}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 900 }}>฿{product.price.toLocaleString()}</Typography>
              <Box sx={{ justifySelf: { md: "start" }, color: "#568768", bgcolor: "#EEF7F0", border: "1px solid #CFE5D4", borderRadius: DS.radius.pill, px: 1.15, py: .5, fontSize: 11.5, fontWeight: 900 }}>
                เปิดใช้งาน
              </Box>
              <Box sx={{ display: "flex", gap: .65, flexWrap: "wrap", gridColumn: { xs: "1 / -1", md: "auto" } }}>
                <Button component={Link} href={`/shop/${product.slug}`} target="_blank" startIcon={<Eye size={14} />} sx={{ color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.2, py: .65, fontSize: 12, textTransform: "none" }}>
                  View
                </Button>
                <Button onClick={() => openEdit(product)} startIcon={<Pencil size={14} />} sx={{ color: "#B96449", bgcolor: "#FFF7F3", border: "1px solid #F4C8B4", borderRadius: DS.radius.pill, px: 1.2, py: .65, fontSize: 12, fontWeight: 900, textTransform: "none" }}>
                  Edit
                </Button>
                <Button onClick={() => setDeleteTarget(product)} startIcon={<Trash2 size={14} />} sx={{ color: "#9A3F35", bgcolor: "#FFF4F2", border: "1px solid #F2C9C2", borderRadius: DS.radius.pill, px: 1.2, py: .65, fontSize: 12, fontWeight: 900, textTransform: "none" }}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={products.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </Box>

        <Dialog
          open={Boolean(deleteTarget)}
          onClose={() => !isDeleting && setDeleteTarget(null)}
          fullWidth
          maxWidth="xs"
          slotProps={{
            paper: {
              sx: {
                borderRadius: "22px",
                border: `1px solid ${DS.line}`,
                boxShadow: "0 24px 70px rgba(43,43,51,.22)",
                fontFamily: adminFontFamily,
              },
            },
          }}
        >
          <DialogTitle sx={{ fontFamily: adminFontFamily, fontSize: 21, fontWeight: 900, pb: .5 }}>ยืนยันการลบสินค้า</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography sx={{ color: DS.gray, fontFamily: adminFontFamily, fontSize: 14, lineHeight: 1.7 }}>
              ต้องการลบ {deleteTarget?.name} ออกจากหลังบ้านใช่ไหม
            </Typography>
            {deleteTarget && (
              <Box sx={{ mt: 1.4, bgcolor: "#FFF4F2", border: "1px solid #F2C9C2", borderRadius: "14px", p: 1.2 }}>
                <Typography sx={{ color: "#9A3F35", fontFamily: adminFontFamily, fontSize: 12.5, fontWeight: 900 }}>
                  จะลบไฟล์รูปในโฟลเดอร์ {unreferencedUploadedImages(deleteTarget, products).length} ไฟล์
                </Typography>
                <Typography sx={{ color: DS.gray, fontFamily: adminFontFamily, fontSize: 11.8, mt: .3 }}>
                  ระบบจะลบเฉพาะรูปใน /uploads/shop ที่ไม่มีสินค้าอื่นใช้งานอยู่
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: .8 }}>
            <Button disabled={isDeleting} onClick={() => setDeleteTarget(null)} sx={{ color: DS.gray, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.8, fontFamily: adminFontFamily, fontWeight: 900, textTransform: "none" }}>
              Cancel
            </Button>
            <Button disabled={isDeleting} onClick={confirmDeleteProduct} startIcon={<Trash2 size={15} />} sx={{ color: DS.white, bgcolor: "#9A3F35", borderRadius: DS.radius.pill, px: 1.8, fontFamily: adminFontFamily, fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#84342D" }, "&.Mui-disabled": { bgcolor: "#D8D2CC", color: DS.white } }}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  const sectionCard = { bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "22px", overflow: "hidden" } as const;
  const sectionHeader = (icon: React.ReactNode, title: string, subtitle: string) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: { xs: 1.6, md: 2.2 }, pt: { xs: 1.5, md: 1.8 }, pb: 1.2 }}>
      <Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center", bgcolor: "#FFF7F1", color: "#B96449", border: "1px solid #F6E4D8", borderRadius: "11px", flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: 15, fontWeight: 900, lineHeight: 1.2 }}>{title}</Typography>
        <Typography sx={{ color: DS.gray, fontSize: 12, mt: .1 }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
  const sectionBody = { px: { xs: 1.6, md: 2.2 }, pb: { xs: 1.6, md: 2 } } as const;

  return (
    <Box sx={{ display: "grid", gap: 1.6 }}>
      {/* ── Top bar ── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Button onClick={backToList} startIcon={<ArrowLeft size={15} />} sx={{ color: DS.gray, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.4, py: .65, fontSize: 12.5, fontWeight: 900, textTransform: "none" }}>
            Back
          </Button>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 900, lineHeight: 1.15 }}>{mode === "edit" ? "Edit product" : "New product"}</Typography>
            <Typography sx={{ color: DS.gray, fontSize: 12.5 }}>กรอกข้อมูลสินค้าเพื่อแสดงบนหน้าร้าน</Typography>
          </Box>
        </Box>
        <Button disabled={isSaving} onClick={saveProduct} startIcon={mode === "edit" ? <Check size={16} /> : <Plus size={16} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.4, py: 1.05, fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#44444D" }, "&.Mui-disabled": { bgcolor: "#D8D2CC", color: DS.white } }}>
          {isSaving ? "กำลังบันทึก..." : mode === "edit" ? "บันทึกสินค้า" : "เพิ่มสินค้า"}
        </Button>
      </Box>

      {message && (
        <Box sx={{ bgcolor: message.startsWith("เพิ่ม") || message.startsWith("อัปโหลด") || message.startsWith("เลือกไว้") ? "#EEF7F0" : "#FFF8E7", color: message.startsWith("เพิ่ม") || message.startsWith("อัปโหลด") || message.startsWith("เลือกไว้") ? "#4D7D5B" : "#8A6320", border: `1px solid ${message.startsWith("เพิ่ม") || message.startsWith("อัปโหลด") || message.startsWith("เลือกไว้") ? "#CFE5D4" : "#F6DCA6"}`, borderRadius: "14px", px: 1.35, py: 1, fontSize: 12.8, fontWeight: 800 }}>
          {message}
        </Box>
      )}

      {/* ── Main 2-column layout ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0,1.16fr) 430px" }, gap: 1.6, alignItems: "start" }}>
        <Box sx={{ display: "grid", gap: 1.4 }}>

          {/* ── Section: General info ── */}
          <Box sx={sectionCard}>
            {sectionHeader(<Pencil size={17} />, "ข้อมูลทั่วไป", "ชื่อ, หมวดหมู่ และ slug สำหรับ URL")}
            <Box sx={{ ...sectionBody, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.2 }}>
              <TextField label="ชื่อสินค้า" value={form.name} onChange={(event) => update("name", event.target.value)} size="small" required error={Boolean(errors.name)} helperText={errors.name} sx={fieldSx} />
              <TextField label="Slug (URL)" value={form.slug} onChange={(event) => update("slug", slugify(event.target.value))} size="small" required error={Boolean(errors.slug)} helperText={errors.slug || `baebite.com/shop/${form.slug || "..."}`} sx={fieldSx} />
              <TextField select label="หมวดหมู่" value={form.category} onChange={(event) => update("category", event.target.value)} size="small" sx={fieldSx} slotProps={{ select: { MenuProps: selectMenuProps } }}>
                {dbCategories.map((cat) => <MenuItem key={cat.id} value={cat.name}>{cat.icon ? `${cat.icon} ` : ""}{cat.name}</MenuItem>)}
              </TextField>
              <TextField select label="Badge" value={form.badge} onChange={(event) => update("badge", event.target.value)} size="small" sx={fieldSx} slotProps={{ select: { MenuProps: selectMenuProps } }}>
                {badges.map((item) => <MenuItem key={item || "none"} value={item}>{item || "ไม่มี badge"}</MenuItem>)}
              </TextField>
            </Box>
          </Box>

          {/* ── Section: Pricing & weight ── */}
          <Box sx={sectionCard}>
            {sectionHeader(<Typography sx={{ fontSize: 17, fontWeight: 900, lineHeight: 1 }}>฿</Typography>, "ราคาและน้ำหนัก", "ตั้งราคาขาย ราคาเดิม และน้ำหนักสินค้า")}
            <Box sx={{ ...sectionBody, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "36px minmax(0,1fr) 36px", gap: .5, alignItems: "center" }}>
                <Button onClick={() => stepNumber("price", -10)} aria-label="ลดราคา" sx={{ minWidth: 36, width: 36, height: 36, color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: "10px", p: 0 }}><Minus size={14} /></Button>
                <TextField label="ราคาขาย" value={form.price} onChange={(event) => update("price", event.target.value.replace(/\D/g, ""))} size="small" required error={Boolean(errors.price)} helperText={errors.price} sx={fieldSx} slotProps={{ input: { endAdornment: <Typography sx={{ color: DS.gray, fontSize: 12, fontWeight: 900 }}>฿</Typography> } }} />
                <Button onClick={() => stepNumber("price", 10)} aria-label="เพิ่มราคา" sx={{ minWidth: 36, width: 36, height: 36, color: DS.white, bgcolor: DS.ink, borderRadius: "10px", p: 0, "&:hover": { bgcolor: "#44444D" } }}><Plus size={14} /></Button>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "36px minmax(0,1fr) 36px", gap: .5, alignItems: "center" }}>
                <Button onClick={() => stepNumber("oldPrice", -10)} aria-label="ลดราคาเดิม" sx={{ minWidth: 36, width: 36, height: 36, color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: "10px", p: 0 }}><Minus size={14} /></Button>
                <TextField label="ราคาเดิม (ถ้ามี)" placeholder="ว่าง = ไม่แสดง" value={form.oldPrice} onChange={(event) => update("oldPrice", event.target.value.replace(/\D/g, ""))} size="small" error={Boolean(errors.oldPrice)} helperText={errors.oldPrice} sx={fieldSx} slotProps={{ input: { endAdornment: <Typography sx={{ color: DS.gray, fontSize: 12, fontWeight: 900 }}>฿</Typography> } }} />
                <Button onClick={() => stepNumber("oldPrice", 10)} aria-label="เพิ่มราคาเดิม" sx={{ minWidth: 36, width: 36, height: 36, color: DS.white, bgcolor: DS.ink, borderRadius: "10px", p: 0, "&:hover": { bgcolor: "#44444D" } }}><Plus size={14} /></Button>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "36px minmax(0,1fr) 36px", gap: .5, alignItems: "center", gridColumn: { md: "1 / -1" } }}>
                <Button onClick={() => stepNumber("weight", -.1, 2)} aria-label="ลดน้ำหนัก" sx={{ minWidth: 36, width: 36, height: 36, color: DS.ink, border: `1px solid ${DS.line}`, borderRadius: "10px", p: 0 }}><Minus size={14} /></Button>
                <TextField label="น้ำหนัก" value={form.weight} onChange={(event) => update("weight", normalizeDecimal(event.target.value))} size="small" required error={Boolean(errors.weight)} helperText={errors.weight} sx={fieldSx} slotProps={{ input: { endAdornment: <Typography sx={{ color: DS.gray, fontSize: 12, fontWeight: 900 }}>kg</Typography> } }} />
                <Button onClick={() => stepNumber("weight", .1, 2)} aria-label="เพิ่มน้ำหนัก" sx={{ minWidth: 36, width: 36, height: 36, color: DS.white, bgcolor: DS.ink, borderRadius: "10px", p: 0, "&:hover": { bgcolor: "#44444D" } }}><Plus size={14} /></Button>
              </Box>
            </Box>
          </Box>

          {/* ── Section: Appearance ── */}
          <Box sx={sectionCard}>
            {sectionHeader(<Star size={17} />, "การแสดงผล", "สีพื้นหลังการ์ดสินค้าและคะแนน")}
            <Box sx={{ ...sectionBody, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.2, alignItems: "start" }}>
              <Box>
                <TextField label="สีพื้นหลังสินค้า" value={form.color} onChange={(event) => update("color", event.target.value)} size="small" error={Boolean(errors.color)} helperText={errors.color} fullWidth sx={fieldSx} />
                <Box sx={{ display: "flex", gap: .6, mt: 1, flexWrap: "wrap" }}>
                  {["#FFF0E8", "#EEF4FF", "#FFF5E3", "#F4EEFF", "#EEFAF2", "#FFF0F1", "#EEF7F5", "#FAF1E8"].map((c) => (
                    <Box key={c} onClick={() => update("color", c)} sx={{ width: 28, height: 28, bgcolor: c, border: `2px solid ${form.color === c ? DS.ink : DS.line}`, borderRadius: "8px", cursor: "pointer", transition: "border-color .15s", "&:hover": { borderColor: DS.peach } }} />
                  ))}
                </Box>
              </Box>
              <TextField label="Rating (0-5)" value={form.rating} onChange={(event) => update("rating", normalizeDecimal(event.target.value))} size="small" error={Boolean(errors.rating)} helperText={errors.rating} sx={fieldSx} />
            </Box>
          </Box>

          {/* ── Section: Description ── */}
          <Box sx={sectionCard}>
            {sectionHeader(<Sparkles size={17} />, "คำอธิบายสินค้า", "ข้อความที่แสดงบนหน้ารวมสินค้าและหน้ารายละเอียด")}
            <Box sx={{ ...sectionBody, display: "grid", gap: 1.2 }}>
              <TextField label="คำอธิบายสั้น" placeholder="แสดงบนการ์ดสินค้าในหน้ารวม" value={form.detail} onChange={(event) => update("detail", event.target.value)} size="small" required multiline minRows={2} error={Boolean(errors.detail)} helperText={errors.detail} sx={fieldSx} />
              <TextField label="รายละเอียดสินค้า" placeholder="แสดงเต็มในหน้ารายละเอียดสินค้า" value={form.description} onChange={(event) => update("description", event.target.value)} size="small" required multiline minRows={4} error={Boolean(errors.description)} helperText={errors.description} sx={fieldSx} />
            </Box>
          </Box>

          {/* ── Section: Media gallery ── */}
          <Box sx={sectionCard}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.2, flexWrap: "wrap", px: { xs: 1.6, md: 2.2 }, pt: { xs: 1.5, md: 1.8 }, pb: 1.2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center", bgcolor: "#FFF7F1", color: "#B96449", border: "1px solid #F6E4D8", borderRadius: "11px", flexShrink: 0 }}><ImagePlus size={17} /></Box>
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 900, lineHeight: 1.2 }}>Media gallery</Typography>
                  <Typography sx={{ color: DS.gray, fontSize: 12, mt: .1 }}>อัปโหลดหลายรูปแล้วเลือกภาพหน้าปก</Typography>
                </Box>
              </Box>
              <Button component="label" startIcon={<UploadCloud size={15} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 1.6, py: .75, fontWeight: 900, fontSize: 12, textTransform: "none", "&:hover": { bgcolor: "#44444D" } }}>
                Select images
                <Box component="input" hidden type="file" accept="image/*" multiple onChange={selectImages} />
              </Button>
            </Box>
            {errors.images && (
              <Box sx={{ mx: { xs: 1.6, md: 2.2 }, mb: 1, bgcolor: "#FFF4F2", border: "1px solid #F2C9C2", color: "#9A3F35", borderRadius: "13px", px: 1.2, py: .85, fontSize: 12.5, fontWeight: 900 }}>
                {errors.images}
              </Box>
            )}
            <Box sx={{ ...sectionBody, pt: 0 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: .9 }}>
                {gallery.length === 0 && (
                  <Box sx={{ gridColumn: "1 / -1", minHeight: 140, display: "grid", placeItems: "center", bgcolor: "#F8F7F5", border: `1px dashed ${DS.line}`, borderRadius: "16px", p: 2, textAlign: "center" }}>
                    <Box>
                      <Box sx={{ width: 44, height: 44, display: "grid", placeItems: "center", mx: "auto", bgcolor: DS.white, color: "#B96449", border: `1px solid ${DS.line}`, borderRadius: "14px", mb: .8 }}>
                        <UploadCloud size={20} />
                      </Box>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 900 }}>ยังไม่มีรูปสินค้า</Typography>
                      <Typography sx={{ color: DS.gray, fontSize: 12, mt: .2 }}>กด Select images เพื่อเลือกรูปก่อนบันทึก</Typography>
                    </Box>
                  </Box>
                )}
                {gallery.map((image, index) => (
                  <Box key={image} sx={{ position: "relative", minWidth: 0 }}>
                    <Box sx={{ position: "relative", height: 88, bgcolor: image === form.image ? form.color : "#F8F7F5", border: `1.5px solid ${image === form.image ? DS.peach : DS.line}`, borderRadius: "14px", overflow: "hidden" }}>
                      <ProductImage src={image} alt={`รูปสินค้า ${index + 1}`} sizes="130px" padding={9} />
                      {image === form.image && <Box sx={{ position: "absolute", top: 6, left: 6, width: 22, height: 22, display: "grid", placeItems: "center", bgcolor: DS.ink, color: DS.white, borderRadius: "50%" }}><Check size={12} /></Box>}
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 30px", gap: .4, mt: .5 }}>
                      <Button onClick={() => setCoverImage(image)} disabled={image === form.image} sx={{ minWidth: 0, color: image === form.image ? "#568768" : DS.ink, bgcolor: image === form.image ? "#EEF7F0" : "#F8F7F5", border: `1px solid ${image === form.image ? "#CFE5D4" : DS.line}`, borderRadius: "10px", py: .4, fontSize: 10.5, fontWeight: 900, textTransform: "none" }}>
                        {image === form.image ? "Cover" : "Set cover"}
                      </Button>
                      <Button onClick={() => removeImage(image)} disabled={gallery.length <= 1} aria-label="ลบรูป" sx={{ minWidth: 30, width: 30, height: 30, color: DS.gray, border: `1px solid ${DS.line}`, borderRadius: "10px", p: 0 }}>
                        <Trash2 size={13} />
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* ── Section: Product content ── */}
          <Box sx={sectionCard}>
            {sectionHeader(<Check size={17} />, "จุดเด่นและส่วนประกอบ", "ข้อมูลเชิงลึกที่แสดงในหน้ารายละเอียดสินค้า")}
            <Box sx={{ ...sectionBody, display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1.2 }}>
              <Box>
                <TextField label="จุดเด่นสินค้า" placeholder={"1 บรรทัดต่อ 1 ข้อ\nเช่น\nโปรตีนคุณภาพสูง\nโอเมก้า 3 และ 6"} value={form.benefits} onChange={(event) => update("benefits", event.target.value)} size="small" multiline minRows={5} error={Boolean(errors.benefits)} helperText={errors.benefits} fullWidth sx={fieldSx} />
                {benefits.length > 0 && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: .5, mt: .8 }}>
                    {benefits.map((b, i) => (
                      <Chip key={i} label={b} size="small" sx={{ bgcolor: "#EEF7F0", color: "#4D7D5B", border: "1px solid #CFE5D4", fontWeight: 700, fontSize: 11.5 }} />
                    ))}
                  </Box>
                )}
              </Box>
              <TextField label="ส่วนประกอบสำคัญ" placeholder="ระบุส่วนประกอบหลักของสินค้า" value={form.ingredients} onChange={(event) => update("ingredients", event.target.value)} size="small" multiline minRows={5} error={Boolean(errors.ingredients)} helperText={errors.ingredients} sx={fieldSx} />
            </Box>
          </Box>

          {/* ── Bottom save button (mobile) ── */}
          <Box sx={{ display: { xs: "flex", xl: "none" }, justifyContent: "flex-end" }}>
            <Button disabled={isSaving} onClick={saveProduct} startIcon={mode === "edit" ? <Check size={16} /> : <Plus size={16} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.4, py: 1.05, fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#44444D" }, "&.Mui-disabled": { bgcolor: "#D8D2CC", color: DS.white } }}>
              {isSaving ? "กำลังบันทึก..." : mode === "edit" ? "บันทึกสินค้า" : "เพิ่มสินค้า"}
            </Button>
          </Box>
        </Box>

        {/* ── Sticky preview sidebar ── */}
        <Box sx={{ position: { xl: "sticky" }, top: 24, display: "grid", gap: 1.4 }}>
          <Box sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "24px", p: 1.35, boxShadow: "0 14px 34px rgba(43,43,51,.06)" }}>
            <Box sx={{ position: "relative", height: { xs: 280, xl: 340 }, bgcolor: preview.color, borderRadius: "18px", overflow: "hidden" }}>
              {preview.badge && <Chip label={preview.badge} size="small" sx={{ position: "absolute", zIndex: 2, top: 12, left: 12, bgcolor: PRODUCT_BADGE_COLORS[preview.badge]?.background ?? DS.white, color: PRODUCT_BADGE_COLORS[preview.badge]?.color ?? DS.ink, border: `1px solid ${PRODUCT_BADGE_COLORS[preview.badge]?.border ?? DS.line}`, fontWeight: 800 }} />}
              <ProductImage src={preview.image} alt={preview.name} sizes="430px" padding={32} eager />
            </Box>
            {gallery.length > 0 && (
              <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(gallery.length, 4)},1fr)`, gap: .65, mt: .75 }}>
                {gallery.slice(0, 4).map((image) => (
                  <Box key={image} sx={{ position: "relative", height: 60, bgcolor: image === preview.image ? preview.color : "#F8F7F5", border: `1px solid ${image === preview.image ? DS.peach : DS.line}`, borderRadius: "11px", overflow: "hidden" }}>
                    <ProductImage src={image} alt="" sizes="90px" padding={7} />
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ p: "12px 6px 4px" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                <Typography sx={{ color: "#B96449", fontSize: 12, fontWeight: 900 }}>{preview.category}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: .35 }}><Star size={12} fill="#F6C85F" color="#F6C85F" /><Typography sx={{ color: DS.gray, fontSize: 11.5 }}>{preview.rating}</Typography></Box>
              </Box>
              <Typography sx={{ fontSize: 20, fontWeight: 900, mt: .4, lineHeight: 1.2 }}>{preview.name}</Typography>
              <Typography sx={{ color: DS.gray, fontSize: 12.5, lineHeight: 1.5, mt: .3 }}>{preview.detail}</Typography>
              <Typography sx={{ color: DS.gray, fontSize: 11.5, mt: .6 }}>{preview.weight}</Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: .7 }}>
                <Typography sx={{ fontSize: 25, fontWeight: 900, mt: .4 }}>฿{preview.price.toLocaleString()}</Typography>
                {preview.oldPrice && <Typography sx={{ color: DS.gray, fontSize: 12.5, textDecoration: "line-through" }}>฿{preview.oldPrice.toLocaleString()}</Typography>}
              </Box>
            </Box>
          </Box>

          <Box sx={{ bgcolor: "#FFF7F1", border: "1px solid #F6E4D8", borderRadius: "18px", p: 1.4 }}>
            <Typography sx={{ display: "flex", alignItems: "center", gap: .6, fontSize: 13.5, fontWeight: 900 }}><Eye size={15} />Live preview</Typography>
            <Typography sx={{ color: DS.gray, fontSize: 12, lineHeight: 1.6, mt: .5 }}>
              ตัวอย่างที่แสดงจะเปลี่ยนแบบ real-time ตามข้อมูลที่กรอก รูปจะอัปโหลดจริงเมื่อกดบันทึก
            </Typography>
          </Box>
        </Box>
      </Box>

    </Box>
  );
}

