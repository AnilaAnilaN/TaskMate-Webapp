import Link from "next/link";

export default function VerifyPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const status = searchParams?.status;

  let title = "Verification";
  let message = "";

  if (status === "success") {
    title = "Email Verified ✅";
    message = "Your email has been verified. You can now log in.";
  } else if (status === "expired") {
    title = "Link Expired ⚠️";
    message = "This verification link has expired. Please sign up again to receive a new link.";
  } else if (status === "invalid") {
    title = "Invalid Link ⚠️";
    message = "This verification link is invalid. Please check the link or request a new verification email.";
  } else {
    message = "Processing...";
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-4">{message}</p>

      <div className="mt-6 space-x-2">
        <Link href="/test-auth">
          <button className="bg-blue-600 text-white px-4 py-2">Go to Auth Test</button>
        </Link>
        <Link href="/">
          <button className="bg-gray-200 px-4 py-2">Home</button>
        </Link>
      </div>
    </div>
  );
}
