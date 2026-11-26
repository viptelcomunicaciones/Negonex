# Deploying NegoNEX AI on Dokploy

This project runs on **Astro 7** with the `@astrojs/node` standalone adapter (`dist/server/entry.mjs`). Static pages (`es` and `en`) are prerendered at build time while Astro Actions (`contact` and `newsletter`) and localized 404 fallback run on the Node HTTP server on port `4321`.

## 1. Create the Application in Dokploy

1. In Dokploy, create a new **Application** inside your project.
2. Under **Provider → GitHub**, connect repository **`viptelcomunicaciones/Negonex`** and set the branch to **`main`**.
3. Under **Build Type**, select **`Dockerfile`** and set:
   - **Docker File:** `./Dockerfile`
   - **Docker Context Path:** `.`
4. Set the **Container Port** to **`4321`** (under Network / Domains).

## 2. Build Arguments & Environment Variables

Set these variables in Dokploy **before** triggering the first deploy:

### Build Arguments (Build-time)

- `SITE_URL=https://your-domain.com` *(required so the sitemap, canonical URLs, `hreflang`, and Open Graph share tags point to your real domain)*
- `DEPLOY_TARGET=node`

### Runtime Environment Variables

- `SITE_URL=https://your-domain.com` *(must match the domain serving the site for `astro:env/server` and Astro `checkOrigin` CSRF checks)*
- `DEPLOY_TARGET=node`
- `HOST=0.0.0.0`
- `PORT=4321`

### Optional Variables (Future Configuration)

These are **not** required for the initial preview deploy; add them later when wiring live email/CRM forms or analytics:

- `CONTACT_FORM_ENDPOINT=https://...`
- `NEWSLETTER_ENDPOINT=https://...`
- `NEWSLETTER_API_KEY=...`
- `PUBLIC_GA_MEASUREMENT_ID=G-...`
- `PUBLIC_GTM_ID=GTM-...`
- `GOOGLE_SITE_VERIFICATION=...`

## 3. Domain & HTTPS (Traefik)

1. In Dokploy under the Application's **Domains** tab, add your domain (or temporary `sslip.io` / staging subdomain).
2. Set **Container Port** to **`4321`**.
3. Enable **HTTPS** with Let's Encrypt (`letsencrypt`).
4. Ensure your `SITE_URL` Build Arg and Runtime Env use the exact `https://` origin configured here, then click **Deploy**.

## 4. Post-Deploy Verification Checklist

After the container starts and passes the built-in healthcheck (`/` on port `4321`):

- [ ] `/` loads the Spanish default Home page and `#sandbox` works interactively.
- [ ] `/en/` loads the English localized Home page.
- [ ] `/contacto/` displays `info@negonex.ia` as the example contact email.
- [ ] `/search/` returns Pagefind results when searching `"Keigo"` or `"FOB"`.
- [ ] `/sitemap-index.xml` lists URLs with your real `SITE_URL` domain.
