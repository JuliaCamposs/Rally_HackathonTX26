import { cookies } from "next/headers";

export const DEMO_USER_ID = "demo-user";
const COOKIE_NAME = "rally-uid";

/**
 * Resolves the current user id from the session cookie, falling back to the
 * seeded demo identity. This is the single swap point for real auth later.
 */
export async function getCurrentUserId(): Promise<string> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? DEMO_USER_ID;
}
