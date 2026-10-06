# Deploying Allavanchy to Vercel

This repository is a monorepo with three deployable applications. Create three Vercel projects connected to this same Git repository.

| Project | Root Directory | Framework | Build Command | Output Directory |
| --- | --- | --- | --- | --- |
| Storefront | `client` | Vite | `npm run build` | `dist` |
| Admin | `admin-app` | Vite | `npm run build` | `dist` |
| API | `server` | Express | none | none |

## 1. Prepare PostgreSQL

Create a PostgreSQL database with a provider that supplies an SSL connection URL and connection pooling. Keep the database in a region close to your Vercel API project.

For a brand-new database, execute [server/database/schema.sql](server/database/schema.sql). For an existing copy of this project, restore `allavanchy_backup.dump` instead; do not run both.

```powershell
# Fresh database
psql "$env:DATABASE_URL" -f server/database/schema.sql

# Existing backup (custom PostgreSQL dump)
pg_restore --no-owner --no-privileges --dbname="$env:DATABASE_URL" allavanchy_backup.dump
```

Create at least one admin user after the schema is loaded. Register a user through the storefront, then change that user's `role` to `admin` in PostgreSQL. Passwords must remain bcrypt hashes, so do not insert a plain-text password manually.

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

## 2. Deploy the API

1. In Vercel, choose **Add New → Project** and import this Git repository.
2. Set **Root Directory** to `server`. Vercel detects the Express application in `src/server.js`.
3. In **Settings → Environment Variables**, add these for Production. Add Preview values too if you want preview environments to use a database.

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Your provider's pooled SSL PostgreSQL URL |
| `DB_POOL_MAX` | `1` |
| `JWT_SECRET` | A long, unique random string |
| `CORS_ALLOWED_ORIGINS` | Storefront and admin URLs, comma-separated; no spaces required |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary value |
| `CLOUDINARY_API_KEY` | Cloudinary value |
| `CLOUDINARY_API_SECRET` | Cloudinary secret |
| `CONTACT_EMAIL_USER` | Gmail sender address |
| `CONTACT_EMAIL_APP_PASSWORD` | Gmail App Password, not your normal password |
| `CONTACT_RECEIVER_EMAIL` | Inbox that receives contact messages |

4. Deploy and open `https://YOUR-API.vercel.app/`. It should return the API-running JSON response.

Do not commit any `.env` files or copy secret server variables into either Vite project.

## 3. Deploy the storefront

1. Add another Vercel project from the same repository and choose `client` as its Root Directory.
2. Add `VITE_API_BASE_URL` with the exact deployed API URL, for example `https://allavanchy-api.vercel.app`.
3. Deploy. The committed `client/vercel.json` makes direct visits to routes such as `/shop` work.

## 4. Deploy the admin dashboard

1. Add the final Vercel project from the same repository with `admin-app` as its Root Directory.
2. Add `VITE_API_BASE_URL` with the same exact API URL.
3. Deploy. The committed `admin-app/vercel.json` enables direct admin routes.

## 5. Finalize CORS and verify

After both front ends have production URLs, set API `CORS_ALLOWED_ORIGINS` to both exact origins, for example:

```text
https://allavanchy.vercel.app,https://allavanchy-admin.vercel.app
```

Redeploy the API after changing any variable. Then verify customer registration/login, product listing, admin login, product creation, image uploads, contact messages, checkout, and direct navigation to a nested page.

## Upload limit

Vercel Functions allow request bodies up to 4.5 MB. Product uploads are now limited to 4 MB total, leaving room for multipart request data. For larger or more numerous images, change the application to use signed browser-to-Cloudinary uploads.
