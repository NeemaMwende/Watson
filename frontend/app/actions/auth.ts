"use server";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Missing credentials");
  }

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.ok) {
    throw new Error("Inavlid email or password");
  }

  redirect("/dashboard");
}
