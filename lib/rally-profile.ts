import type { User as Auth0User } from "@auth0/nextjs-auth0/types";
import { prisma } from "@/lib/db";

const AVATAR_COLORS = [
  "#2e8b6f",
  "#1d685d",
  "#5c8a3a",
  "#0f5c4c",
  "#3f7f66",
  "#6b9b45",
  "#256b5c",
  "#4a8f5e",
];

function avatarColor(subject: string): string {
  let hash = 0;
  for (const character of subject) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/** Creates a Rally profile once, then restores and refreshes it on future logins. */
export async function syncRallyProfile(identity: Auth0User) {
  const name = identity.name?.trim() || identity.nickname?.trim() || "Rally member";

  return prisma.user.upsert({
    where: { auth0Id: identity.sub },
    create: {
      auth0Id: identity.sub,
      name,
      email: identity.email ?? null,
      avatarUrl: identity.picture ?? null,
      avatarColor: avatarColor(identity.sub),
    },
    update: {
      name,
      email: identity.email ?? null,
      avatarUrl: identity.picture ?? null,
    },
  });
}
