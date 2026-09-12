-- Add Auth0 identity fields without disturbing seeded demo users.
ALTER TABLE "User" ADD COLUMN "auth0Id" TEXT;
ALTER TABLE "User" ADD COLUMN "email" TEXT;
ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;

CREATE UNIQUE INDEX "User_auth0Id_key" ON "User"("auth0Id");
