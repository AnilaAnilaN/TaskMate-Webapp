import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { name, email, password } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
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

    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "http://localhost:3000";
    const verifyUrl = `${base}/api/auth/verify-email?token=${token}`;

    try {
      await sendEmail(
        email,
        "Verify Your Email",
        `<p>Click <a href="${verifyUrl}">here</a> to verify your account.</p>`
      );
    } catch (sendErr) {
      console.error("Failed to send verification email", sendErr);
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({ message: "Signup successful, check your email" });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: (err && err.message) || "Internal server error" }, { status: 500 });
  }
}
