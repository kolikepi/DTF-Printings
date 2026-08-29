# Deploy në Vercel — hap pas hapi

Vercel nuk mban disk të përhershëm dhe nuk ka databazë të vetën, ndaj faqja ka nevojë
për dy shërbime të jashtme (të dyja me plan falas):

| Nevoja | Zgjedhja e rekomanduar | Alternativa |
|---|---|---|
| PostgreSQL | [Neon](https://neon.tech) | Supabase, Railway Postgres, Vercel Postgres |
| Storage i dizajneve | [Cloudflare R2](https://dash.cloudflare.com) (10 GB falas, pa tarifa daljeje) | AWS S3, Backblaze B2 |

Koha totale: ~20 minuta.

---

## 1. Databaza (Neon)

1. Krijo një projekt te [neon.tech](https://neon.tech) — rajoni **Frankfurt (eu-central-1)**.
2. Kopjo *connection string*-un e **pooled** (përmban `-pooler`), p.sh.:
   ```
   postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Shto në fund `&pgbouncer=true&connection_limit=1` — Prisma me serverless e do këtë:
   ```
   ...?sslmode=require&pgbouncer=true&connection_limit=1
   ```
   Ruaje veçmas edhe versionin **direct** (pa `-pooler`) — përdoret vetëm te hapi 4.

---

## 2. Storage (Cloudflare R2)

1. Cloudflare → **R2** → *Create bucket*, p.sh. `elev8-uploads` (mbaje **privat**).
2. **Manage R2 API Tokens** → *Create API token* → leje **Object Read & Write** për këtë bucket.
   Ruaj `Access Key ID`, `Secret Access Key` dhe `Account ID`.
3. Te bucket-i → **Settings → CORS policy** shto (zëvendëso domenin pasi ta kesh):
   ```json
   [
     {
       "AllowedOrigins": ["https://emri-yt.vercel.app", "http://localhost:3000"],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedHeaders": ["content-type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
   Pa këtë, browser-i i klientit nuk e ngarkon dot dizajnin direkt në bucket.

---

## 3. Projekti në Vercel

[vercel.com/new](https://vercel.com/new) → *Import* repo-n `kolikepi/DTF-Printings`, pastaj:

- **Root Directory:** lëre siç është (`./`) — projekti është vetë në rrënjë
- **Framework Preset:** Next.js (zbulohet vetë)
- **Branch:** `main`

Te **Environment Variables** shto:

| Emri | Vlera |
|---|---|
| `DATABASE_URL` | connection string-u i pooled nga hapi 1 |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://emri-yt.vercel.app` (përditësoje pas domenit real) |
| `STORAGE_DRIVER` | `s3` |
| `AWS_S3_BUCKET` | `elev8-uploads` |
| `AWS_REGION` | `auto` |
| `AWS_ACCESS_KEY_ID` | nga tokeni R2 |
| `AWS_SECRET_ACCESS_KEY` | nga tokeni R2 |
| `S3_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `ADMIN_EMAIL` | email-i yt i adminit |
| `ADMIN_PASSWORD` | një fjalëkalim i fortë |

> Për AWS S3 në vend të R2: hiq `S3_ENDPOINT` dhe vendos rajonin real, p.sh. `eu-central-1`.
> Për MinIO: shto edhe `S3_FORCE_PATH_STYLE=true`.

Shtyp **Deploy**.

---

## 4. Tabelat dhe të dhënat (një herë të vetme)

Nga kompjuteri yt, me connection string-un **direct** (pa `-pooler`):

```bash
git clone https://github.com/kolikepi/DTF-Printings
cd DTF-Printings
npm install
export DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
export ADMIN_EMAIL="admin@shembull.al"
export ADMIN_PASSWORD="fjalekalimi-yt"
npx prisma db push
npx tsx scripts/seed.ts
```

Pas kësaj hyr te `https://emri-yt.vercel.app/login` me ato kredenciale; paneli është te `/admin`.

---

## 5. Domeni yt

Vercel → *Project → Settings → Domains* → shto p.sh. `elev8.al` dhe ndiq DNS-in që të jep.
Pastaj **përditëso `NEXTAUTH_URL`** te domeni i ri dhe shtoje atë origjinë te CORS-i i R2-shit —
ndryshe login-i dhe upload-et prishen.

---

## Kur diçka nuk shkon

| Simptomë | Shkaku |
|---|---|
| Build dështon me `@prisma/client did not initialize` | Build Command i mbishkruar; duhet `prisma generate && next build` |
| Faqet ngarkohen, por produktet mungojnë | Nuk ke bërë `prisma db push` + seed (hapi 4) |
| `Can't reach database server` | Mungon `?sslmode=require` ose po përdor connection string-un e gabuar |
| Login-i të kthen te `/login` pa gabim | `NEXTAUTH_URL` nuk përputhet me domenin real |
| Upload-i i dizajnit dështon në browser | CORS i R2-shit nuk e lejon origjinën (hapi 2.3) |
| `STORAGE_DRIVER=local nuk funksionon në Vercel` | Vendos `STORAGE_DRIVER=s3` — disku i Vercel-it nuk ruhet |

Skedarët shkojnë direkt nga browser-i te R2/S3 me URL të nënshkruar, ndaj limiti 4.5 MB
i request-eve të Vercel-it nuk vlen; limiti është `MAX_UPLOAD_BYTES` (default 25 MB).
