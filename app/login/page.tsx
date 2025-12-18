import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-r from-sky-700 via-indigo-700 to-emerald-700 p-6">
      <AuthForm initialMode="login" />
    </div>
  );
}
