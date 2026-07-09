"use server";

import { signIn } from "@/auth";

export async function devLineLogin() {
  await signIn("dev-line", { redirectTo: "/account" });
}
