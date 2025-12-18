import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password: hashed,
    verificationToken: token,
    tokenExpiry: expiry,
    emailVerified: false,
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-email?token=${token}`;

  await sendEmail(
    email,
    "Verify Your Email",
    `<p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`
  );

  return NextResponse.json({ message: "Signup successful, check your email" });
}
