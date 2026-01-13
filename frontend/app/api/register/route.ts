import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await pool.query(`SELECT id FROM "User" WHERE email = $1`, [
    email,
  ]);

  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);

  await pool.query(
    `INSERT INTO "User" (id, name, email, password, "emailVerified")
     VALUES (gen_random_uuid(), $1, $2, $3, NULL)`,
    [name, email, hashedPassword]
  );

  return NextResponse.json({ success: true });
}
