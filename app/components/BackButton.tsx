"use client";

import { Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { DS } from "./DesignSystem";

type BackButtonProps = {
  children: React.ReactNode;
  fallbackHref: string;
  preferHistory?: boolean;
  topSpacing?: number;
  bottomSpacing?: number;
};

export function BackButton({
  children,
  fallbackHref,
  preferHistory = false,
  topSpacing = 0,
  bottomSpacing = 1.5,
}: BackButtonProps) {
  const router = useRouter();

  const goBack = () => {
    if (preferHistory && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <Button
      type="button"
      onClick={goBack}
      startIcon={<ArrowLeft size={16} />}
      sx={{
        color: DS.ink,
        bgcolor: DS.white,
        border: `1px solid ${DS.line}`,
        borderRadius: DS.radius.pill,
        px: 1.65,
        py: 0.75,
        mt: topSpacing,
        mb: bottomSpacing,
        fontSize: 13,
        fontWeight: 700,
        boxShadow: "0 6px 16px rgba(43,43,51,.04)",
        "&:hover": { bgcolor: "#F8F7F5", borderColor: "#D9D9DD" },
      }}
    >
      {children}
    </Button>
  );
}
