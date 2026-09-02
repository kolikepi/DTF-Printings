# Elev8 Printings — website e-commerce për printim DTF

Website bilingual (Shqip/Anglisht) për biznesin e printimit DTF: katalog produktesh,
kërkesa oferte me ngarkim dizajni, blerje pa llogari, mockup designer 2D dhe panel admini
me statuse porosish. Çdo kërkesë njoftohet me email, te ti dhe te klienti.

Ky version është **plotësisht i pavarur** — nuk varet nga Abacus AI ose nga ndonjë platformë
tjetër hosting. E ekzekuton kudo: VPS, Docker, Vercel, Railway, Coolify, kompjuteri yt.

---

## Çfarë duhet

- Node.js 18.17+ (rekomandohet 20 LTS)
- PostgreSQL 14+
- Asnjë llogari cloud (storage-i lokal është default; S3 është opsional)

---

## Nisje e shpejtë (lokalisht)

```bash
git clone https://github.com/kolikepi/DTF-Printings
cd DTF-Printings

# 1. Varësitë (prisma generate ekzekutohet automatikisht)
npm install

# 2. Konfigurimi
cp .env.example .env
#   - vendos DATABASE_URL të databazës tënde
#   - gjenero sekretin:  openssl rand -base64 32   →  NEXTAUTH_SECRET

# 3. Krijo tabelat
npm run db:push

# 4. Mbush me të dhëna shembull (kategori, produkte, portfolio, testimoniale, admin)
npm run seed

# 5. Nis serverin
npm run dev
```

Hape http://localhost:3000

Seed-i krijon një përdorues admin. Nëse nuk ke vendosur `ADMIN_EMAIL`/`ADMIN_PASSWORD`
në `.env`, fjalëkalimi gjenerohet rastësisht dhe shtypet **një herë** në terminal — ruaje.

---

## Nisje me Docker (databaza përfshihet)

```bash
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" > .env
docker compose up -d --build

# tabelat + të dhënat fillestare
docker compose exec web npx prisma db push
docker compose exec web npx tsx scripts/seed.ts
```

Aplikacioni ngrihet në http://localhost:3000, Postgres-i dhe skedarët e ngarkuar
ruhen në volume Docker (`db-data`, `uploads`).

---

## Variablat e mjedisit

Të gjitha janë të dokumentuara te [`.env.example`](.env.example). Të domosdoshme:

| Variabël | Përshkrim |
|---|---|
| `DATABASE_URL` | Connection string i PostgreSQL |
| `NEXTAUTH_SECRET` | Sekret i rastësishëm (`openssl rand -base64 32`) — nënshkruan edhe upload-et lokale |
| `NEXTAUTH_URL` | URL-ja publike e faqes, p.sh. `https://elev8.al` |

Opsionale: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `STORAGE_DRIVER`, `UPLOAD_DIR`,
`MAX_UPLOAD_BYTES`, dhe kredencialet S3 kur `STORAGE_DRIVER=s3`.

---

## Njoftimet me email

Çdo kërkesë oferte, mesazh kontakti dhe porosi dërgon dy email: një te ti (me lidhjen
te paneli dhe dizajnin e bashkangjitur) dhe një te klienti (konfirmim). Kur ndryshon
statusin e një porosie te `/admin`, klienti njoftohet vetë.

Konfiguro njërën rrugë te `.env`:

```env
# Resend — 3.000 email/muaj falas
RESEND_API_KEY="re_..."
EMAIL_FROM="Elev8 Printings <porosi@domeni-yt.al>"
ADMIN_NOTIFY_EMAIL="ti@domeni-yt.al"
```

ose SMTP-në tënde (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`). Pa asnjërën,
faqja punon normalisht dhe email-et vetëm shënohen te log-u — asnjë porosi nuk dështon.

---

## Çmimet dhe zbritjet

Të gjitha te [`lib/pricing.ts`](lib/pricing.ts), në një vend të vetëm që e përdorin
njësoj faqet dhe API-ja:

| Sasia | Zbritja |
|---|---|
| 10+ copë | −5% |
| 25+ copë | −10% |
| 50+ copë | −15% |
| 100+ copë | −20% |

Transporti: 300 Lekë, falas mbi 5.000 Lekë (ndryshohen me `NEXT_PUBLIC_SHIPPING_COST`
dhe `NEXT_PUBLIC_FREE_SHIPPING_OVER`). Çmimet e porosisë llogariten gjithmonë nga
serveri me çmimet e databazës, kurrë me ato që dërgon browser-i.

---

## Blerje pa llogari

Vizitori e mbush shportën pa u regjistruar — ajo ruhet te browser-i i tij dhe kalon te
llogaria nëse më vonë hyn. Te checkout-i kërkohet vetëm email-i, ku shkon konfirmimi.

---

## Mbrojtja e formularëve

Formularët publikë kanë validim serveri, fushë karrem kundër robotëve dhe kufi prej
5 dërgimesh për IP çdo 10 minuta. Kufiri mbahet në memorie, ndaj me disa instanca
paralele duhet zëvendësuar me Redis.

---

## Storage i dizajneve

Klientët ngarkojnë dizajne te kërkesa e ofertës dhe te faqja e produktit. Dy mundësi:

**`STORAGE_DRIVER=local` (default)** — skedarët shkojnë në `UPLOAD_DIR` (default `./storage`).
Klienti merr një URL të nënshkruar me HMAC që skadon pas 1 ore; `/api/upload/local` e verifikon
nënshkrimin dhe bllokon shtigjet jashtë dosjes. Në VPS/Docker mban një volume të përhershëm mbi
këtë dosje. (Në hosting serverless — Vercel — disku nuk ruhet, ndaj përdor S3.)

**`STORAGE_DRIVER=s3`** — çdo storage S3-compatible: AWS S3, Cloudflare R2, MinIO, Backblaze B2.
Vendos `AWS_S3_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` dhe, për
jo-AWS, `S3_ENDPOINT` (+ `S3_FORCE_PATH_STYLE=true` për MinIO).

Në të dyja rastet dizajnet janë private: shkarkohen vetëm nga admini te
`/api/upload/download?path=…` (lidhja "Shkarko dizajnin" te tabi Oferta në `/admin`).

---

## Struktura

```
app/
  (public)/        faqet — home, produkte, portfolio, çmime, FAQ, kontakt, ofertë,
                   shportë, checkout, llogari, admin, login/signup, mockup-designer
  api/             route handlers (produkte, shportë, porosi, oferta, kontakt, upload, auth)
components/
  ui/              komponentë shadcn/ui (Radix + Tailwind)
  mockup-designer  editor 2D me react-konva
  language-context sistemi i gjuhës SQ/EN
lib/
  auth.ts          NextAuth (credentials + Prisma adapter, JWT sessions)
  storage.ts       drivera local/S3 për upload-et
  translations.ts  përkthimet SQ/EN
prisma/schema.prisma   modelet e databazës
public/images/         foto produktesh dhe faqeje (lokale, pa CDN të jashtëm)
public/mockups/        template për mockup designer
scripts/seed.ts        të dhëna shembull
```

---

## Komanda

```bash
npm run dev        # server zhvillimi
npm run build      # build produksioni (bën edhe prisma generate)
npm start          # server produksioni
npm run db:push    # sinkronizon skemën me databazën
npm run db:studio  # Prisma Studio
npm run seed       # të dhënat fillestare
npm run lint       # ESLint
```

---

## Të dhënat

Të gjitha të dhënat në `scripts/seed.ts` (produkte, çmime, portfolio, testimoniale) janë
**shembuj** — zëvendësoji me të tuat përpara se ta nxjerrësh online. Të dhënat e kontaktit
dhe ato ligjore janë te [`lib/contact-info.ts`](lib/contact-info.ts); plotëso NIPT-in dhe
adresën përpara se të përdorësh faqet ligjore.

> **Kujdes me fotot e mockup-eve:** `public/mockups/white_tshirt.png` dhe
> `black_hoodie.png` janë foto stoku **me watermark** (Adobe Stock, Dreamstime), të
> trashëguara nga versioni fillestar. Zëvendësoji me foto të tuat ose me licencë
> përpara se faqja të dalë online.

Çmimet janë në Lekë (ALL) dhe konfigurohen te `scripts/seed.ts` (`basePrice`) ose direkt në DB.

---

## Deploy

- **VPS / Docker:** `docker compose up -d --build` pas `.env`; vendos një reverse proxy
  (Caddy/Nginx) me HTTPS dhe `NEXTAUTH_URL` te domeni real.
- **Vercel:** udhëzuesi i plotë hap pas hapi te [`DEPLOY-VERCEL.md`](DEPLOY-VERCEL.md)
  (Neon për databazën, Cloudflare R2 për dizajnet).
- **Railway / Render:** lidh repo-n dhe shto variablat e mjedisit; disku atje është
  i përhershëm, ndaj `STORAGE_DRIVER=local` mjafton.
- Pas çdo deploy-i të parë: `npx prisma db push` dhe `npx tsx scripts/seed.ts`.
