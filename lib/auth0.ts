import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { syncRallyProfile } from "@/lib/rally-profile";

export const auth0 = new Auth0Client({
  signInReturnToPath: "/app",
  enableAccessTokenEndpoint: false,
  authorizationParameters: {
    scope: "openid profile email",
  },
  beforeSessionSaved: async (session) => {
    await syncRallyProfile(session.user);
    return session;
  },
});
