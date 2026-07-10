"use client";

import { Button, CircularProgress } from "@mui/material";
import { KeyRound, LockKeyhole, LogIn } from "lucide-react";
import { useFormStatus } from "react-dom";
import { DS } from "./DesignSystem";

type PendingSubmitButtonProps = {
  label: string;
  pendingLabel: string;
  icon: "key" | "lock" | "login";
  tone?: "primary" | "muted";
};

const icons = {
  key: KeyRound,
  lock: LockKeyhole,
  login: LogIn,
};

export function PendingSubmitButton({
  label,
  pendingLabel,
  icon,
  tone = "primary",
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();
  const Icon = icons[icon];
  const isPrimary = tone === "primary";

  return (
    <Button
      type="submit"
      disabled={pending}
      startIcon={
        pending
          ? <CircularProgress size={17} thickness={5} sx={{ color: isPrimary ? DS.white : DS.ink }} />
          : <Icon size={17} />
      }
      fullWidth
      sx={{
        bgcolor: isPrimary ? DS.ink : "#F8F7F5",
        color: isPrimary ? DS.white : DS.ink,
        border: isPrimary ? "1px solid transparent" : `1px solid ${DS.line}`,
        borderRadius: DS.radius.pill,
        py: isPrimary ? 1.25 : 1.15,
        mt: isPrimary ? .2 : 0,
        boxShadow: "none",
        "&:hover": { bgcolor: isPrimary ? "#44444D" : "#F1F0EE" },
        "&.Mui-disabled": {
          bgcolor: isPrimary ? "#77777F" : "#ECEAE7",
          color: isPrimary ? DS.white : DS.gray,
          borderColor: isPrimary ? "transparent" : DS.line,
        },
      }}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}
