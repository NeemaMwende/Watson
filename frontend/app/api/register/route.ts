import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/schemas/auth";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await pool.query(`SELECT id FROM "User" WHERE email = $1`, [
    normalizedEmail,
  ]);

  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);

  await pool.query(
    `INSERT INTO "User" (id, name, email, password, "emailVerified")
     VALUES (gen_random_uuid(), $1, $2, $3, NULL)`,
    [name, normalizedEmail, hashedPassword]
  );

  return NextResponse.json({ success: true });
}
