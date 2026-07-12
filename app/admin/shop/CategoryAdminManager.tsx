"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, TextField, Tooltip, Typography,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { AdminPagination } from "../_components/AdminPagination";
import { DS } from "../../components/DesignSystem";
import { useToast } from "../../components/ToastProvider";
import { fetchCategories, invalidateCategoriesCache, type ShopCategoryItem } from "../../lib/clientCategoryStorage";
import { adminFontFamily } from "../_components/adminFonts";

const EMOJI_PRESETS = ["🐕", "🐈", "🦴", "💊", "🎾", "✂️", "🏠", "🐾", "🍖", "🐟", "🌿", "💧", "⭐", "🎁", "🧴"];

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

function slugify(value: string) {
  return value.trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormState = { name: string; slug: string; icon: string; sortOrder: string };
const emptyForm: FormState = { name: "", slug: "", icon: "", sortOrder: "" };

/* ─────────────────────── Sortable row ─────────────────────── */

type RowProps = {
  cat: ShopCategoryItem;
  onEdit: (cat: ShopCategoryItem) => void;
  onToggle: (cat: ShopCategoryItem) => void;
  onDelete: (cat: ShopCategoryItem) => void;
  isDragging?: boolean;
};

function CategoryRow({ cat, onEdit, onToggle, onDelete, isDragging = false }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0,1fr)", md: "32px 1fr 140px 90px 220px" },
        gap: { xs: .5, md: 1 },
        alignItems: "center",
        borderBottom: `1px solid ${DS.line}`,
        px: { xs: 1.6, md: 2.1 },
        py: 1.3,
        bgcolor: isDragging ? "#FFF7F1" : DS.white,
        boxShadow: isDragging ? "0 8px 30px rgba(43,43,51,.14)" : "none",
        borderRadius: isDragging ? "18px" : 0,
        "&:last-child": { borderBottom: 0 },
        transition: "background-color .15s",
      }}
    >
      {/* Drag handle */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          color: DS.line,
          cursor: "grab",
          width: 28,
          height: 36,
          borderRadius: "8px",
          transition: "color .15s, background-color .15s",
          "&:hover": { color: DS.gray, bgcolor: "#F8F7F5" },
          "&:active": { cursor: "grabbing" },
        }}
      >
        <GripVertical size={16} />
      </Box>

      {/* Name + icon */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
        <Box sx={{ width: 38, height: 38, display: "grid", placeItems: "center", bgcolor: "#FFF7F1", borderRadius: "11px", fontSize: 18, flexShrink: 0 }}>
          {cat.icon || <Tag size={16} color={DS.gray} />}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14.5, fontWeight: 900 }}>{cat.name}</Typography>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: .7, mt: .2 }}>
            <Typography sx={{ color: DS.gray, fontSize: 12 }}>{cat.slug}</Typography>
            <Typography sx={{ color: DS.gray, fontSize: 12 }}>· ลำดับ {cat.sortOrder}</Typography>
          </Box>
        </Box>
        {!cat.isActive && (
          <Chip label="ปิด" size="small" sx={{ bgcolor: "#FFF4F2", color: "#9A3F35", border: "1px solid #F2C9C2", fontSize: 11, fontWeight: 900 }} />
        )}
      </Box>

      <Typography sx={{ display: { xs: "none", md: "block" }, color: DS.gray, fontSize: 12.5, fontFamily: "monospace" }}>{cat.slug}</Typography>
      <Typography sx={{ display: { xs: "none", md: "block" }, color: DS.gray, fontSize: 13 }}>{cat.sortOrder}</Typography>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: .65, flexWrap: "wrap", gridColumn: { xs: "1 / -1", md: "auto" } }}>
        <Button onClick={() => onEdit(cat)} startIcon={<Pencil size={14} />} sx={{ color: "#B96449", bgcolor: "#FFF7F3", border: "1px solid #F4C8B4", borderRadius: DS.radius.pill, px: 1.2, py: .65, fontSize: 12, fontWeight: 900, textTransform: "none" }}>
          Edit
        </Button>
        <Button onClick={() => onToggle(cat)} sx={{ color: cat.isActive ? DS.gray : "#568768", bgcolor: cat.isActive ? DS.white : "#EEF7F0", border: `1px solid ${cat.isActive ? DS.line : "#CFE5D4"}`, borderRadius: DS.radius.pill, px: 1.2, py: .65, fontSize: 12, fontWeight: 900, textTransform: "none" }}>
          {cat.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
        </Button>
        <Tooltip title="ลบ category" placement="top">
          <IconButton onClick={() => onDelete(cat)} sx={{ width: 32, height: 32, color: "#9A3F35", bgcolor: "#FFF4F2", border: "1px solid #F2C9C2", borderRadius: "10px" }}>
            <Trash2 size={14} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

/* ─────────────────────── Main component ─────────────────────── */

export function CategoryAdminManager() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<ShopCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ShopCategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const saveOrderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const totalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const pagedCategories = categories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const loadCategories = async () => {
    setLoading(true);
    invalidateCategoriesCache();
    const cats = await fetchCategories();
    setCategories(cats);
    setPage(1);
    setLoading(false);
  };

  useEffect(() => { queueMicrotask(() => { void loadCategories(); }); }, []);

  /* ── Drag handlers ── */

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setCategories((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex).map((cat, i) => ({
        ...cat,
        sortOrder: i + 1,
      }));

      // Debounce PATCH to avoid spamming on rapid drags
      if (saveOrderTimeout.current) clearTimeout(saveOrderTimeout.current);
      saveOrderTimeout.current = setTimeout(() => {
        void persistOrder(next);
      }, 600);

      return next;
    });
  };

  const persistOrder = async (ordered: ShopCategoryItem[]) => {
    try {
      await Promise.all(
        ordered.map((cat) =>
          fetch(`/api/admin/shop/categories/${cat.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sortOrder: cat.sortOrder }),
          }),
        ),
      );
      invalidateCategoriesCache();
    } catch {
      showToast({ title: "บันทึกลำดับไม่สำเร็จ", message: "กรุณาลองใหม่", hideAction: true });
    }
  };

  /* ── CRUD helpers ── */

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sortOrder: String(categories.length + 1) });
    setSlugEdited(false);
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (cat: ShopCategoryItem) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, sortOrder: String(cat.sortOrder) });
    setSlugEdited(true);
    setError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (isSaving) return;
    setDialogOpen(false);
    setError("");
  };

  const update = (key: keyof FormState, value: string) => {
    setError("");
    if (key === "slug") setSlugEdited(Boolean(value.trim()));
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "name" && !slugEdited ? { slug: slugify(value) } : {}),
    }));
  };

  const save = async () => {
    const name = form.name.trim();
    const slug = form.slug.trim();
    if (!name) { setError("กรอกชื่อ category"); return; }
    if (!slug) { setError("กรอก slug"); return; }

    setIsSaving(true);
    setError("");

    try {
      const payload = {
        name,
        slug,
        icon: form.icon.trim() || null,
        sortOrder: Number(form.sortOrder) || categories.length + 1,
      };

      const res = editingId
        ? await fetch(`/api/admin/shop/categories/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        : await fetch("/api/admin/shop/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

      const json = await res.json() as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "บันทึกไม่สำเร็จ");
        setIsSaving(false);
        return;
      }

      setDialogOpen(false);
      showToast({
        title: editingId ? "แก้ไข Category แล้ว" : "เพิ่ม Category แล้ว",
        message: name,
        hideAction: true,
      });
      await loadCategories();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (cat: ShopCategoryItem) => {
    try {
      const res = await fetch(`/api/admin/shop/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      });
      if (res.ok) {
        showToast({
          title: cat.isActive ? "ปิดใช้งาน Category" : "เปิดใช้งาน Category",
          message: cat.name,
          hideAction: true,
        });
        await loadCategories();
      }
    } catch { /* ignore */ }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/shop/categories/${deleteTarget.id}`, { method: "DELETE" });
      const json = await res.json() as { error?: string };
      if (!res.ok) {
        showToast({ title: "ลบไม่สำเร็จ", message: json.error ?? "เกิดข้อผิดพลาด", hideAction: true });
        setDeleteTarget(null);
        setIsDeleting(false);
        return;
      }
      showToast({ title: "ลบ Category แล้ว", message: deleteTarget.name, hideAction: true });
      setDeleteTarget(null);
      await loadCategories();
    } catch {
      showToast({ title: "ลบไม่สำเร็จ", message: "เกิดข้อผิดพลาด", hideAction: true });
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCategory = categories.find((c) => c.id === activeId);

  return (
    <Box sx={{ display: "grid", gap: 1.6 }}>
      {/* Summary cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3,1fr)" }, gap: 1.2 }}>
        {[
          { label: "Total", value: categories.length, detail: "ทุก category" },
          { label: "Active", value: categories.filter((c) => c.isActive).length, detail: "เปิดใช้งาน" },
          { label: "Hidden", value: categories.filter((c) => !c.isActive).length, detail: "ปิดใช้งาน" },
        ].map((item) => (
          <Box key={item.label} sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "18px", p: 1.7 }}>
            <Typography sx={{ color: DS.gray, fontSize: 12, fontWeight: 900 }}>{item.label}</Typography>
            <Typography sx={{ fontSize: 29, fontWeight: 900, lineHeight: 1.1, mt: .3 }}>{item.value}</Typography>
            <Typography sx={{ color: DS.gray, fontSize: 12.5, mt: .3 }}>{item.detail}</Typography>
          </Box>
        ))}
      </Box>

      {/* Table */}
      <Box sx={{ bgcolor: DS.white, border: `1px solid ${DS.line}`, borderRadius: "24px", overflow: "hidden", boxShadow: "0 8px 22px rgba(43,43,51,.05)" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, px: { xs: 1.6, md: 2.1 }, py: 1.6, borderBottom: `1px solid ${DS.line}` }}>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 900 }}>หมวดหมู่สินค้า</Typography>
            <Typography sx={{ color: DS.gray, fontSize: 13, mt: .25 }}>
              ลาก <GripVertical size={13} style={{ display: "inline", verticalAlign: "middle", color: DS.gray }} /> เพื่อเรียงลำดับ — บันทึกอัตโนมัติ
            </Typography>
          </Box>
          <Button onClick={openNew} startIcon={<Plus size={16} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 2.2, py: 1, fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#44444D" } }}>
            New category
          </Button>
        </Box>

        {loading && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ color: DS.gray, fontSize: 14 }}>กำลังโหลด...</Typography>
          </Box>
        )}

        {!loading && categories.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ color: DS.gray, fontSize: 14 }}>ยังไม่มี category กด New category เพื่อเพิ่ม</Typography>
          </Box>
        )}

        {!loading && categories.length > 0 && (
          <>
            <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "32px 1fr 140px 90px 220px", gap: 1, bgcolor: "#F8F7F5", borderBottom: `1px solid ${DS.line}`, px: 2.1, py: 1.15 }}>
              {["", "หมวดหมู่", "Slug", "ลำดับ", "จัดการ"].map((h) => (
                <Typography key={h} sx={{ color: DS.gray, fontSize: 12, fontWeight: 900, letterSpacing: ".06em" }}>{h}</Typography>
              ))}
            </Box>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={pagedCategories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                {pagedCategories.map((cat) => (
                  <CategoryRow
                    key={cat.id}
                    cat={cat}
                    onEdit={openEdit}
                    onToggle={(c) => void toggleActive(c)}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </SortableContext>

              {/* Drag overlay — floating card while dragging */}
              <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(.18,.67,.6,1.22)" }}>
                {activeCategory && (
                  <CategoryRow
                    cat={activeCategory}
                    onEdit={() => {}}
                    onToggle={() => {}}
                    onDelete={() => {}}
                    isDragging
                  />
                )}
              </DragOverlay>
            </DndContext>
            <AdminPagination
              page={page}
              totalPages={totalPages}
              totalItems={categories.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </Box>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: "22px", border: `1px solid ${DS.line}`, boxShadow: "0 24px 70px rgba(43,43,51,.22)", fontFamily: adminFontFamily } } }}>
        <DialogTitle sx={{ fontFamily: adminFontFamily, fontSize: 20, fontWeight: 900, pb: .5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {editingId ? "แก้ไข Category" : "New Category"}
          <IconButton onClick={closeDialog} size="small" sx={{ color: DS.gray }}><X size={18} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.5, pt: "12px !important" }}>
          {error && (
            <Box sx={{ bgcolor: "#FFF4F2", border: "1px solid #F2C9C2", color: "#9A3F35", borderRadius: "12px", px: 1.3, py: .9, fontSize: 13, fontWeight: 800 }}>
              {error}
            </Box>
          )}
          <TextField label="ชื่อ Category" value={form.name} onChange={(e) => update("name", e.target.value)} size="small" required autoFocus sx={fieldSx} />
          <TextField label="Slug (URL)" value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} size="small" required helperText={`/shop?category=${form.slug || "..."}`} sx={fieldSx} />
          <Box>
            <TextField label="Icon (emoji)" value={form.icon} onChange={(e) => update("icon", e.target.value)} size="small" placeholder="เช่น 🐾" sx={{ ...fieldSx, width: "100%" }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: .5, mt: .8 }}>
              {EMOJI_PRESETS.map((emoji) => (
                <Box key={emoji} onClick={() => update("icon", emoji)}
                  sx={{ width: 34, height: 34, display: "grid", placeItems: "center", bgcolor: form.icon === emoji ? DS.peachSoft : "#F8F7F5", border: `1.5px solid ${form.icon === emoji ? DS.peach : DS.line}`, borderRadius: "10px", cursor: "pointer", fontSize: 16, transition: "border-color .15s" }}>
                  {emoji}
                </Box>
              ))}
            </Box>
          </Box>
          <TextField select label="ลำดับ" value={form.sortOrder} onChange={(e) => update("sortOrder", e.target.value)} size="small" sx={fieldSx}>
            {Array.from({ length: Math.max(categories.length + 1, 10) }, (_, i) => i + 1).map((n) => (
              <MenuItem key={n} value={String(n)}>{n}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: .8 }}>
          <Button disabled={isSaving} onClick={closeDialog} sx={{ color: DS.gray, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.8, fontFamily: adminFontFamily, fontWeight: 900, textTransform: "none" }}>
            Cancel
          </Button>
          <Button disabled={isSaving} onClick={() => void save()} startIcon={<Check size={15} />} sx={{ bgcolor: DS.ink, color: DS.white, borderRadius: DS.radius.pill, px: 1.8, fontFamily: adminFontFamily, fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#44444D" }, "&.Mui-disabled": { bgcolor: "#D8D2CC", color: DS.white } }}>
            {isSaving ? "กำลังบันทึก..." : editingId ? "บันทึก" : "เพิ่ม Category"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => !isDeleting && setDeleteTarget(null)} fullWidth maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: "22px", border: `1px solid ${DS.line}`, boxShadow: "0 24px 70px rgba(43,43,51,.22)", fontFamily: adminFontFamily } } }}>
        <DialogTitle sx={{ fontFamily: adminFontFamily, fontSize: 21, fontWeight: 900, pb: .5 }}>ยืนยันการลบ Category</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: DS.gray, fontFamily: adminFontFamily, fontSize: 14, lineHeight: 1.7 }}>
            ต้องการลบ <strong>{deleteTarget?.name}</strong> ออกจากระบบใช่ไหม?
          </Typography>
          <Box sx={{ mt: 1.4, bgcolor: "#FFF4F2", border: "1px solid #F2C9C2", borderRadius: "14px", p: 1.2 }}>
            <Typography sx={{ color: "#9A3F35", fontFamily: adminFontFamily, fontSize: 12.5, fontWeight: 900 }}>
              ⚠️ ลบไม่ได้ถ้ายังมีสินค้าใช้ category นี้อยู่
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: .8 }}>
          <Button disabled={isDeleting} onClick={() => setDeleteTarget(null)} sx={{ color: DS.gray, border: `1px solid ${DS.line}`, borderRadius: DS.radius.pill, px: 1.8, fontFamily: adminFontFamily, fontWeight: 900, textTransform: "none" }}>
            Cancel
          </Button>
          <Button disabled={isDeleting} onClick={() => void confirmDelete()} startIcon={<Trash2 size={15} />} sx={{ color: DS.white, bgcolor: "#9A3F35", borderRadius: DS.radius.pill, px: 1.8, fontFamily: adminFontFamily, fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#84342D" }, "&.Mui-disabled": { bgcolor: "#D8D2CC", color: DS.white } }}>
            {isDeleting ? "กำลังลบ..." : "ลบ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
