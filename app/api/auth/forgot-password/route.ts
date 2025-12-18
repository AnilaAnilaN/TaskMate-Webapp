import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email } = body || {};
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Missing or invalid email" }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "No user found" }, { status: 404 });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await user.save();

    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "http://localhost:3000";
    const resetUrl = `${base}/reset-password?token=${token}`;

    try {
      await sendEmail(
        email,
        "Reset your password",
        `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
      );
    } catch (sendErr) {
      console.error("Failed to send reset email", sendErr);
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }

    return NextResponse.json({ message: "Reset email sent" });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: (err && err.message) || "Internal server error" }, { status: 500 });
  }
}
