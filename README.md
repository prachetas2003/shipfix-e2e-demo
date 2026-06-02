# shipfix-e2e-demo

Minimal **public** test application for [ShipFix](https://github.com/your-org/shipfix-v2) live E2E
deployments. It matches the recommended layout in ShipFix’s
[`docs/e2e-manual-test.md`](https://github.com/your-org/shipfix-v2/blob/main/docs/e2e-manual-test.md).

**This repo contains no secrets.** ShipFix provisions Neon, deploys the API to Render, deploys
the web app to Vercel, wires `VITE_API_URL` from the backend URL, and verifies the live system.

## Layout

```
apps/
  api/    Express + TypeScript  → Render node_api
  web/    Vite + React           → Vercel frontend_static
```

| App | Detected needs | Deploy target |
| --- | --- | --- |
| `apps/api` | `DATABASE_URL`, `GET /health`, `PORT` | Render |
| `apps/web` | `VITE_API_URL` (build-time) | Vercel |

CORS is **enabled** (`cors({ origin: true })`) so a full-stack ShipFix run can reach
`succeeded` when the plan includes a `cors_from` check. To test **partial `diagnosed`**
(CORS failure with live URLs), remove the CORS middleware in `apps/api/src/index.ts` and
push a new commit.

## Local development (optional)

Secrets stay out of git. For local runs only, create untracked env files:

**`apps/api/.env`** (optional, gitignored):

```env
PORT=4001
DATABASE_URL=postgres://user:pass@localhost:5432/demo
```

**`apps/web/.env.local`** (optional, gitignored):

```env
VITE_API_URL=http://localhost:4001
```

```bash
# Terminal 1 — API
cd apps/api
npm install
npm run build
npm run start

# Terminal 2 — Web
cd apps/web
npm install
npm run dev
```

Open the Vite dev URL. The page fetches `{VITE_API_URL}/health`.

## Scripts (ShipFix grounding)

| App | Scripts | Notes |
| --- | --- | --- |
| `apps/api` | `build` → `tsc`, `start` → `node dist/index.js` | Render runs install + build + start |
| `apps/web` | `build` → `vite build` | Output in `dist/`; Vercel runs install + build |

## Testing with ShipFix

1. Push this repo to **public GitHub** (default branch `main`).
2. Ensure your Render and Vercel accounts can deploy from that GitHub repo.
3. In ShipFix, connect **Neon**, **Render**, and **Vercel** credentials.
4. Paste `YOUR_GITHUB_USER/shipfix-e2e-demo` in the UI.
5. Optional: **Generate plan** — expect `web` (Vercel), `api` (Render), `db` (Neon), wiring
   `api.publicUrl` → `web.VITE_API_URL`, verification `health_path` + `frontend_loads`.
6. Click **Deploy** and follow the timeline to `succeeded`, `diagnosed`, or `failed`.

### Expected ShipFix outcomes

| Outcome | When |
| --- | --- |
| **`succeeded`** | All services deployed + all plan verification checks pass |
| **`diagnosed`** | Services live but e.g. `cors_from` failed (disable CORS to test this path) |
| **`failed`** | Render/Vercel deploy error, or nothing useful deployed |

## What not to commit

- `.env`, `.env.local`, API keys, `DATABASE_URL`, or baked-in `VITE_API_URL`
- `node_modules/`, `dist/`

## License

MIT — use freely as a ShipFix E2E fixture.
