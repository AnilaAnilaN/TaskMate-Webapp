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

  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "No user found" }, { status: 404 });

    if (!user.emailVerified) {
      return NextResponse.json({ error: "Email not verified" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful" });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: (err && err.message) || "Internal server error" }, { status: 500 });
  }
}
