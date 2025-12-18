import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { token, newPassword } = body || {};
  if (!token || !newPassword) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (typeof newPassword !== "string" || newPassword.length < 6) return NextResponse.json({ error: "Password too short" }, { status: 400 });

  try {
    await dbConnect();
    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = "";
    user.resetPasswordExpiry = new Date();
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err: any) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: (err && err.message) || "Internal server error" }, { status: 500 });
  }
}
