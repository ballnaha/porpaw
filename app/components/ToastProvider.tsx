"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Link from "next/link";
import { Box, Button, IconButton, Snackbar, Typography } from "@mui/material";
import { AlertTriangle, CheckCircle2, Info, ShoppingCart, X, XCircle } from "lucide-react";
import { DS } from "./DesignSystem";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title?: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  hideAction?: boolean;
  variant?: ToastVariant;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle2; label: string; color: string; soft: string; border: string }> = {
  success: { icon: CheckCircle2, label: "Success", color: "#3F7750", soft: "#EEF7F0", border: "#CFE6D2" },
  error: { icon: XCircle, label: "Error", color: "#B64B3C", soft: "#FFF4F2", border: "#F2C9C2" },
  warning: { icon: AlertTriangle, label: "Warning", color: "#956C13", soft: "#FFF7DE", border: "#F1DEA2" },
  info: { icon: Info, label: "Update", color: "#4D668B", soft: "#EEF4FF", border: "#CBDCF4" },
};

function resolveVariant(toast: ToastOptions | null): ToastVariant {
  if (toast?.variant) return toast.variant;

  const content = `${toast?.title ?? ""} ${toast?.message ?? ""}`.toLowerCase();
  if (content.includes("ไม่สำเร็จ") || content.includes("ผิดพลาด") || content.includes("failed") || content.includes("error")) return "error";
  if (content.includes("กรุณา") || content.includes("ลองใหม่") || content.includes("warning")) return "warning";
  return "success";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);
  const variant = resolveVariant(toast);
  const tone = variantStyles[variant];
  const Icon = tone.icon;

  return <ToastContext.Provider value={contextValue}>
    {children}
    <Snackbar
      open={Boolean(toast)}
      autoHideDuration={3400}
      onClose={(_, reason) => reason !== "clickaway" && setToast(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        bottom: { xs: "calc(76px + env(safe-area-inset-bottom))", md: 24 },
        right: { xs: 12, sm: 24 },
        left: { xs: 12, sm: "auto" },
        maxWidth: { xs: "none", sm: 430 },
      }}
    >
      <Box
        role="status"
        aria-live="polite"
        sx={{
          width: "100%",
          position: "relative",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "44px minmax(0,1fr) auto",
          alignItems: "start",
          gap: 1.2,
          bgcolor: "rgba(255,255,255,.96)",
          color: DS.ink,
          border: `1px solid ${tone.border}`,
          borderRadius: "16px",
          p: "13px 13px 12px",
          fontFamily: "var(--font-prompt), sans-serif",
          boxShadow: "0 22px 55px rgba(43,43,51,.18), 0 3px 10px rgba(43,43,51,.08)",
          backdropFilter: "blur(18px)",
          "& .MuiTypography-root, & .MuiButton-root": {
            fontFamily: "var(--font-prompt), sans-serif",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "0 auto 0 0",
            width: 4,
            bgcolor: tone.color,
          },
        }}
      >
        <Box sx={{ width: 44, height: 44, display: "grid", placeItems: "center", bgcolor: tone.soft, color: tone.color, border: `1px solid ${tone.border}`, borderRadius: "12px" }}>
          <Icon size={20} strokeWidth={2.6} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: tone.color, fontSize: 10.5, fontWeight: 900, lineHeight: 1, letterSpacing: ".08em", textTransform: "uppercase", mb: .55 }}>
            {tone.label}
          </Typography>
          <Typography sx={{ fontSize: 14.5, fontWeight: 900, lineHeight: 1.25 }}>
            {toast?.title ?? "เพิ่มลงตะกร้าแล้ว"}
          </Typography>
          <Typography sx={{ color: DS.gray, fontSize: 12.3, lineHeight: 1.45, mt: .35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {toast?.message}
          </Typography>
          {!toast?.hideAction && (
            <Button component={Link} href={toast?.actionHref ?? "/cart"} startIcon={<ShoppingCart size={13} />} onClick={() => setToast(null)} sx={{ minWidth: 0, color: "#B96449", fontSize: 12, fontWeight: 900, p: 0, mt: .55, textTransform: "none", "&:hover": { bgcolor: "transparent", color: DS.ink } }}>
              {toast?.actionLabel ?? "ดูตะกร้า"}
            </Button>
          )}
        </Box>
        <IconButton size="small" aria-label="ปิดการแจ้งเตือน" onClick={() => setToast(null)} sx={{ alignSelf: "start", color: DS.gray, border: `1px solid ${DS.line}`, bgcolor: "#FBFAF8", p: .45, "&:hover": { bgcolor: "#F4F2EF", color: DS.ink } }}>
          <X size={15} />
        </IconButton>
      </Box>
    </Snackbar>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
