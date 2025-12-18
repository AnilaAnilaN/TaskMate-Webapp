This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Required environment variables 🔧

For registration and email verification to work, set the following environment variables (e.g., in `.env.local`):

- `MONGODB_URI` — MongoDB connection string
- `NEXT_PUBLIC_BASE_URL` — Your app base URL (e.g. `http://localhost:3000`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — SMTP credentials for sending verification emails

If you don't set `NEXT_PUBLIC_BASE_URL`, the signup route will fall back to `http://localhost:3000` in development.

---

New endpoints:

- POST `/api/auth/forgot-password` — { email } : sends a reset link to the email if the user exists.
- POST `/api/auth/reset-password` — { token, newPassword } : reset the password for a valid token.

Troubleshooting tips:

- If you see a Mongo error like `Invalid namespace specified`, your `MONGODB_URI` or database name may contain invalid characters (spaces, special characters) — ensure the DB name in the URI is valid and has no spaces.
- The server now surfaces server-side errors as JSON so the client will display helpful messages instead of a parsing error.
