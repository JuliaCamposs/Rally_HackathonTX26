# Rally website UI update

This is the updated Next.js website source, with its original event APIs, SQLite data model, RSVP and chat flows preserved.

## Changes
- Supplied SVG logo, preserved without recoloring or redrawing.
- Reusable Buddy component derived from the supplied JSON, rendered as a lightweight front-view SVG in map/detail loading and empty-result states.
- Refined cream/green styling, typography, spacing, filters, event cards, and aligned desktop map/event panel.
- Correct Base UI pressed-state styling, keyboard focus, skip link, reduced-motion support, map zoom controls and descriptive marker labels.
- OpenStreetMap tiles replace the previous CARTO tiles that displayed an API-key watermark. Optional tile URL and attribution settings are in `.env.example`.
- Locally bundled Plus Jakarta Sans font and its license.

## Run
Use an x64 Node.js runtime on Windows: the existing Prisma 6 Windows engine requires x64, including on Windows ARM computers.

```sh
pnpm install
```

Copy `.env.example` to `.env`, then:

```sh
pnpm db:setup
pnpm dev
```

Open http://localhost:4317 in your browser. This is a server-backed web page, so it cannot run by double-clicking an HTML file.

## Validation
TypeScript and ESLint checks passed. The page rendered in a desktop browser; category/time filtering and the Buddy empty-result state were verified. Further mobile testing was skipped at the user's request. Full end-to-end RSVP/chat testing and a completed production build are not claimed.

The existing shadcn MCP configuration is preserved in `.cursor/mcp.json`. The MCP connection and registry queries were verified during this update. Existing Base UI shadcn components were reused.

Buddy is a front-view interpretation of the 3D avatar definition, not an exact 3D renderer. The university and profile indicators retain their original display-only behavior. No new campus data or authentication was added.

OpenStreetMap's public tiles are suitable for modest interactive use; review https://operations.osmfoundation.org/policies/tiles/ before deployment at scale, or configure your own provider and its required attribution.
