// lib/auth/session.ts
import { cookies } from 'next/headers';

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.delete({
    name: 'auth-token',
    path: '/',
  });
}
