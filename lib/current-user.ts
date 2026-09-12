import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/db";
import { syncRallyProfile } from "@/lib/rally-profile";

export async function getCurrentRallyUser() {
  const session = await auth0.getSession();
  if (!session) return null;
  return (
    (await prisma.user.findUnique({ where: { auth0Id: session.user.sub } })) ??
    syncRallyProfile(session.user)
  );
}

export async function getCurrentUserId(): Promise<string | null> {
  return (await getCurrentRallyUser())?.id ?? null;
}
