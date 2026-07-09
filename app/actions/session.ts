"use server";

import { signOut } from "@/auth";

export async function signOutToHome() {
  await signOut({ redirectTo: "/" });
}

export async function signOutToAdminLogin() {
  await signOut({ redirectTo: "/admin/login" });
}
