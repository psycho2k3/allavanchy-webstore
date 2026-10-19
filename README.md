# allavanchy-webstore

Monorepo for the ALLAVANCHY store.

| Folder | What it is | Local dev |
| --- | --- | --- |
| `client/` | Customer storefront (React + Vite + Tailwind) | `npm install && npm run dev` (port 5173) |
| `admin-app/` | Admin dashboard (React + Vite) | `npm install && npm run dev` (port 5174) |
| `server/` | REST API (Express 5 + PostgreSQL + Cloudinary) | `npm install && npm run dev` (port 5000) |

Copy each folder's `.env.example` to `.env` and fill in the values. For local work, set `VITE_API_BASE_URL=http://localhost:5000` in both front ends.

See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting on Vercel.
