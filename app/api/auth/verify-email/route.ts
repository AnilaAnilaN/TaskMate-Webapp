import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  await dbConnect();

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return NextResponse.redirect(new URL(`/verify-email?status=invalid`, request.url));
  }

  if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
    return NextResponse.redirect(new URL(`/verify-email?status=expired`, request.url));
  }

  user.emailVerified = true;
  user.verificationToken = "";
  user.tokenExpiry = new Date();
  await user.save();

  return NextResponse.redirect(new URL(`/verify-email?status=success`, request.url));
}
