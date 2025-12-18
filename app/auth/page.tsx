import { redirect } from "next/navigation";

export default function AuthPage() {
  // redirect to /login for explicit routes
  redirect("/login");
}

