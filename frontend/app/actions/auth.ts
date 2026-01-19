"use server";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/schemas/auth";

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const { email, password } = parsed.data;

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (!result || result.error) {
    throw new Error("Invalid email or password");
  }

  redirect("/dashboard");
}
