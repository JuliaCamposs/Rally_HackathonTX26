-- Existing presence rows remain valid. New check-ins require photo proof in the API.
ALTER TABLE "Presence" ADD COLUMN "proofImage" BLOB;
ALTER TABLE "Presence" ADD COLUMN "proofMimeType" TEXT;
