"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

function getSafeCallbackUrl(value: FormDataEntryValue | null) {
  const callbackUrl = String(value ?? "/account");

  return callbackUrl.startsWith("/") ? callbackUrl : "/account";
}

function getLoginErrorUrl(callbackUrl: string) {
  const params = new URLSearchParams({ error: "CredentialsSignin" });
  if (callbackUrl !== "/account") params.set("next", callbackUrl);

  return `/login?${params.toString()}`;
}

export async function memberLogin(formData: FormData) {
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));

  try {
    await signIn("member-credentials", {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(getLoginErrorUrl(callbackUrl));
    }

    throw error;
  }
}

export async function devLineLogin() {
  await signIn("dev-line", { redirectTo: "/account" });
}
