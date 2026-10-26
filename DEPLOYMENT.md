# Deploying Allavanchy to Vercel

This repository is a monorepo with three deployable applications. Create three Vercel projects connected to this same Git repository.

| Project | Root Directory | Framework | Build Command | Output Directory |
| --- | --- | --- | --- | --- |
| Storefront | `client` | Vite | `npm run build` | `dist` |
| Admin | `admin-app` | Vite | `npm run build` | `dist` |
| API | `server` | Express | none | none |

## 1. Prepare PostgreSQL

Create a PostgreSQL database with a provider that supplies an SSL connection URL and connection pooling. Keep the database in a region close to your Vercel API project.

**Brand-new database:** run the schema once.

```powershell
psql "$env:DATABASE_URL" -f server/database/schema.sql
```

**Existing database:** run the migrations instead (safe to re-run).

```powershell
psql "$env:DATABASE_URL" -f server/database/migrations/001_paystack_payments.sql
psql "$env:DATABASE_URL" -f server/database/migrations/002_fixes.sql
```

Run `002_fixes.sql` against the production database before deploying this API version (order sizes, product deletes, site settings row).

### Clean the store and create the admin

From the `server` folder, with `DATABASE_URL` in `server/.env`:

```powershell
npm install

# Existing database: wipe ALL products, collections, orders and users,
# leaving only the admin account (Tshepo Ndlovu, designerndlovu0713@gmail.com)
npm run reset-store -- --confirm --password "admin"

# Brand-new database (nothing to wipe): just create the admin
npm run create-admin -- --password "admin"
```

Sign in to the admin dashboard and change the password straight away under Profile. `create-admin` can be re-run at any time to reset the admin password. Images already uploaded to Cloudinary are not removed by `reset-store`; delete them from the Cloudinary console if needed.

## 2. Deploy the API

1. In Vercel, choose **Add New → Project** and import this Git repository.
2. Set **Root Directory** to `server`. Vercel detects the Express application in `src/server.js`, which exports the app (it only calls `app.listen` locally).
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
| `SHIPPING_FLAT_FEE` | Flat shipping fee per order, e.g. `10`. Default `0` |
| `TAX_RATE` | Tax as a decimal. Default `0.0825` (8.25%) |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (`sk_test_...` while testing, `sk_live_...` in production) |
| `PAYSTACK_CURRENCY` | `USD` (must be enabled on your Paystack account) |
| `CLIENT_URL` | Storefront URL, e.g. `https://allavanchy.vercel.app` |

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

## 6. Set up Paystack

1. Create a Paystack account and complete business verification so live payments are enabled. Ask Paystack to enable **USD** on the account (or change `PAYSTACK_CURRENCY` to a currency the account supports, and update prices to match).
2. In **Paystack Dashboard → Settings → API Keys & Webhooks**:
   - Copy the secret key into the API project's `PAYSTACK_SECRET_KEY`.
   - Set **Webhook URL** to `https://YOUR-API.vercel.app/api/payments/paystack/webhook`.
3. Redeploy the API.

How checkout works: the customer fills in shipping details, the API creates the order (status `Pending`, payment `unpaid`, stock reserved) and starts a Paystack transaction, then the customer pays on Paystack's page. Paystack sends them back to `/payment/callback`, where the API verifies the payment with Paystack. The webhook also confirms it if the customer closes the browser early. Paid orders move to `Processing`. Unpaid orders show a **Pay Now** button under My Orders. Cancel abandoned unpaid orders in the admin.

Test with `sk_test_` keys and Paystack's [test cards](https://paystack.com/docs/payments/test-payments/) before switching to live keys.

## Upload limit

Vercel Functions allow request bodies up to 4.5 MB. Product uploads are now limited to 4 MB total, leaving room for multipart request data. For larger or more numerous images, change the application to use signed browser-to-Cloudinary uploads.
