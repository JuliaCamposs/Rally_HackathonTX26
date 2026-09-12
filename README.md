# Rally — Happening at Texas Tech

A live campus map for Texas Tech University. Events appear as pins on a real
map of campus; filter by time, type, and category; open an event to join it
and chat with the group.

Built with Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui,
Leaflet (react-leaflet) for the map, and Prisma + SQLite for persistence.

## Run it locally

```bash
pnpm install
cp .env.example .env        # DATABASE_URL for the local SQLite file
pnpm db:setup               # prisma migrate + seed (9 events, real TTU coords)
pnpm dev                    # http://localhost:4317
```

## Auth0 and Rally Buddy setup

Create an Auth0 **Regular Web Application**, then copy `.env.example` to
`.env.local` and replace the Auth0 placeholders. Generate `AUTH0_SECRET` with
`openssl rand -hex 32`. In the Auth0 application, allow:

- Callback URL: `http://localhost:4317/auth/callback`
- Logout URL: `http://localhost:4317`
- Web origin: `http://localhost:4317`

Enable the Google social connection and the Microsoft Account social
connection configured for **Azure AD personal accounts**. Their default Auth0
connection names are `google-oauth2` and `windowslive`; override the two
connection environment variables if your tenant uses different names.

Set `GEMINI_API_KEY` only in `.env.local` or your deployment's secret manager.
The browser never receives the key. `GEMINI_MODEL` is optional and defaults to
`gemini-2.5-flash`.

Re-run `pnpm prisma db seed` at any time to reset the demo data — event times
are seeded relative to "now" so the map always has live and upcoming events.

## Environment files and Git

Keep your local configuration in `.env`; it and other `.env.*` files are
ignored by Git. Only `.env.example` is committed, with a local SQLite path
and placeholder configuration. Never put real credentials in that template.
Local databases, private keys, build output, dependencies, and ZIP archives
are also excluded from commits.

## What's inside

- **Real map** — `react-leaflet` with OpenStreetMap basemap tiles by default
  (free, no API key; shows real campus streets/buildings). Custom Rally pin
  markers (vector recreation of `public/assets/pin.png`) with
  live/later/official/selected states, attendee-count badges, rich hover
  bubbles, clustering, and zoom controls. Tile URL and attribution are
  configurable via `NEXT_PUBLIC_MAP_TILE_URL` / `NEXT_PUBLIC_MAP_ATTRIBUTION`
  (see `.env.example`).
- **Events highlight panel** — featured "Happening now" and "Upcoming"
  sections with photos, badges, time/place, attendee stacks, and Join /
  Details actions (shadcn Card, Badge, Avatar, Button, ScrollArea, Skeleton).
- **Join flow + group chat** — preserved from the original prototype: the
  gradient "Join this event" CTA flips to "You are going · Leave", and the
  group chat unlocks once joined. Joins and messages are persisted.
- **Landing** — marketing homepage at `/` with Features, How it works, Why
  Rally, reviews, FAQs, and store-style download buttons. The live map lives
  at `/app`.
- **APIs** — Route Handlers under `app/api/events`:
  - `GET /api/events?time=now|later|all&source=all|official|community&category=sports,study`
  - `GET /api/events/[id]`
  - `POST|DELETE /api/events/[id]/join`
  - `GET|POST /api/events/[id]/messages` (POST requires a join — 403 otherwise)
- **Data model** — `prisma/schema.prisma`: `User`, `Event`, `Rsvp`,
  `Message`. SQLite locally; switch `DATABASE_URL` and the datasource
  provider to Postgres for production.

## Notes for production

- **Map tiles**: the default OSM public tiles are free with attribution for
  modest use — review the
  [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
  before deploying at scale and configure a dedicated provider (MapTiler,
  self-hosted, etc.) via `NEXT_PUBLIC_MAP_TILE_URL`.
- **Brand assets**: `public/brand/rally-logo.svg` is used as supplied (no
  recoloring); `components/rally-buddy.tsx` renders the Buddy avatar
  definition as a lightweight front-view SVG in loading/empty states. Plus
  Jakarta Sans is bundled locally in `public/fonts/` (OFL license included).
- **Auth**: Auth0 handles Google and personal Microsoft sign-in. Rally creates
  a local profile keyed by the stable Auth0 subject on first login and restores
  it on later sessions. `/app`, RSVPs, presence, points, and event chats require
  authentication; chat messages are visible only to event members.
- **Rally Buddy**: authenticated users can describe an activity in natural
  language. The server sends Gemini only Rally's current event catalog,
  validates returned IDs against that catalog, and rate-limits each profile to
  six searches per minute. For multi-instance production deployments, replace
  the in-memory limiter with a shared store such as Redis.
- **Chat realtime**: the UI polls every 5s while a joined event is open. For
  instant delivery, swap `useEventDetail` in `lib/api.ts` for SSE, Pusher, or
  Supabase Realtime.
- **Photos**: event photos are vendored in `public/photos/` (Unsplash) and
  served through `next/image`; no runtime hotlink dependency.

## shadcn MCP

The shadcn MCP server is configured in `.cursor/mcp.json` (added via
`pnpm dlx shadcn@latest mcp init --client cursor`), so new UI components are
added from the shadcn registry rather than hand-rolled.
