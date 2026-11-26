# Site brief

Status: built
<!-- The project's memory: what the site is, how it looks, what is still unknown.
     Every agent session reads this before changing pages, copy or styles, and updates it after.
     Keep the headings; they are how agents find things. Facts holds only what the user said. -->

## Business

Plataforma SaaS B2B de NegoNEX AI (Intercultural Intelligence Technologies S.A.S. — IIT S.A.S.) que ofrece agentes conversacionales multilingües (+95 idiomas) con inteligencia artificial y etiqueta intercultural, integración bidireccional CRM/ERP y analítica predictiva de mercados para empresas exportadoras e importadoras.

## Audience

Directores de Comercio Exterior, Gerentes de Exportación, Gerentes Comerciales y Gerentes Generales (CEOs) de PyMEs y medianas/grandes empresas exportadoras e importadoras en Latinoamérica y mercados globales.

## Primary action

Agendar una demostración consultiva o solicitar la activación del agente (CTA principal: «Agendar demo» en `/contacto`, acompañado de prueba inmediata del Sandbox Intercultural en Inicio).

## Voice

Técnico, claro, diplomático y confiable — orientado a tomadores de decisión B2B. Evitar hipérboles, jerga promocional vacía, modismos regionales en el copy público y métricas o testimonios inventados.

## Brand

- Site name: NegoNEX AI
- Legal entity: Intercultural Intelligence Technologies S.A.S. (IIT S.A.S.)
- Tagline: "Donde los negocios globales hablan el mismo idioma: claridad, cultura y cierres sin fronteras."
- Logo files: `src/assets/branding/logomark.svg`, `logomark-dark.svg`, `logo-full.svg`, `logo-full-dark.svg`, `public/favicon.svg` (globo terráqueo dentro de burbuja comercial con red neuronal, Fig. 1).
- Brand color: Verde Esmeralda (`--brand-hue: 162`, `#00A878` / OKLCH) + Azul Marino corporativo (`#0F2A44` / OKLCH).

## Design

- Visual direction: Fiel a la Figura 1 del documento empresarial — Azul Marino profundo (rigor corporativo, seguridad de datos y confianza institucional) combinado con Verde Esmeralda (fluidez comunicativa y crecimiento transfronterizo).
- Theme mode: Claro por defecto (`defaultTheme: 'light'`) con alternancia a modo oscuro en azul marino profundo.
- Typography: Manrope (cuerpo), Outfit (títulos), JetBrains Mono (datos y códigos), autoalojadas vía `@fontsource-variable/*`.
- Build path: `code` (code-first en `.impeccable/config.json`).

## Languages

- `es` (default)
- `en`

## Sitemap

- Inicio (`/`, `/en/`) → Hero B2B + Indicadores técnicos + 4 Pilares de valor + Sandbox Intercultural (isla React 19) + Proceso de despliegue en 4 pasos + Resumen de planes + Seguridad y cumplimiento + CTA final → built
- Plataforma (`/plataforma`, `/en/platform`) → PageHero + Motor IA híbrido (+95 idiomas) + Integración omnicanal y CRM/ERP + Plan Intelligence (BI) + Arquitectura cloud, seguridad Zero Trust y cumplimiento normativo → built
- Precios (`/precios`, `/en/pricing`) → PageHero + Tarjetas de planes (Starter, Enterprise, Intelligence) + Estimador interactivo de precios y Overage (isla React 19) + Tabla comparativa + Medios de pago y garantías + FAQ con JSON-LD → built
- Nosotros (`/nosotros`, `/en/about`) → PageHero + Identidad y objeto social IIT S.A.S. + 5 Socios fundadores (avatares con iniciales) + 4 Roles operativos de planta + Cadena de Valor de Porter + Horizonte estratégico → built
- Contacto (`/contacto`, `/en/contact`) → PageHero + Rutas Self-Service y Consultiva + ContactSection con ContactForm + Garantías de onboarding → built
- Blog (`/blog`, `/en/blog`) → 2 guías técnicas interculturales B2B bilingües (ES/EN) → built
- Buscar (`/search`, `/en/search`) → Búsqueda estática con Pagefind → built

## Facts

- Razón social: Intercultural Intelligence Technologies S.A.S. (IIT S.A.S.), S.A.S. constituida bajo la Ley 1258 de 2008 en Colombia.
- Ciudad de origen: Ibagué, Tolima, Colombia. Modalidad de servicio: 100% remota en la nube.
- Socios fundadores (5): Angie Jimena Rodríguez Velásquez, César Camilo Barrero García, Juan David Vélez Manjarrez, Juan Diego Restrepo Galindo, Rafael Ricardo Giraldo Martínez.
- Plan Starter: Setup USD $1,200 (pago único); suscripción USD $450/mes (hasta 2,500 conversaciones activas/mes, +95 idiomas, 4 macrorregiones, 5 usuarios/agentes, 1 sede, Widget web + WhatsApp Business Cloud API, Chatwoot + ERPNext CRM). Entrega: 10–15 días hábiles. Descuento 15% por pago anual anticipado en renovaciones (USD $4,590/año, ahorro USD $810). Paquete extra de 5 usuarios o 1 sede: USD $150/mes.
- Plan Enterprise: Setup USD $2,800 (contrato estándar 12 meses; 50% descuento a USD $1,400 en compromiso multianual 24 meses); suscripción USD $1,100/mes (hasta 10,000 conversaciones/mes, 15 usuarios, 3 sedes, APIs REST/Webhooks con Salesforce/HubSpot/SAP/Odoo/ERPNext, paquetes culturales Medio Oriente y Asia Oriental, WeChat/LINE opcional, scoring MQL/SQL, soporte 24/7, GDPR/CCPA/Ley 1581). Incluye 6 meses gratis de Plan Intelligence. Entrega: 20–30 días hábiles.
- Plan Intelligence (Add-on BI y Consultoría): Módulo analítico USD $250/mes (Power BI / Looker Studio + scripts Python + informe trimestral). Sesiones de consultoría ejecutiva: USD $400/sesión. Activación en 1 día hábil tras 30 días de captura.
- Gestión Elástica de Volumen Excedente (Overage Pricing): Starter USD $60 por bloque de 250 conversaciones ($0.24/conv.); Enterprise USD $90 por bloque de 500 conversaciones ($0.18/conv.). Alertas al 80%, 90% y 100%; activación < 1 segundo.
- Stack tecnológico: Anthropic Claude Sonnet 4.5 + Google Gemini 2.5 Flash (Context Caching), n8n, Python 3.11+ (FastAPI, LangChain, Pandas, DuckDB, Plotly), Chatwoot CE, ERPNext CRM, AWS Lightsail + S3, Cloudflare Pro & Zero Trust WAF, Auth0 (OAuth 2.0 / MFA), TLS 1.3, AES-256, Twilio VoIP/SIP, Meta WhatsApp Cloud API, Power BI / Google Looker Studio.
- Medios de pago: Stripe (USD), transferencia internacional SWIFT/ACH, PayPal Business y Wompi/PSE/Bancolombia (Colombia).
- Garantías: SLA 99.9% mensual (nota crédito 10%–25%), garantía de satisfacción de 30 días en Setup (reembolso 100% si no se subsana en 5 días hábiles), 30 días de calibración lingüística ilimitada sin costo, cancelación Starter con preaviso de 15 días sin penalidad.
- Metas operativas del modelo: CSAT ≥ 90%, NPS ≥ +65, Churn < 2% mensual, margen bruto SaaS > 72%.

## Placeholders

- `SITE_URL` en `.env` — subdominio de prueba aún por asignar al desplegar (actualmente usa respaldo `https://example.com`).
- Correo corporativo temporal de ejemplo en `src/config/site.config.ts` y página de Contacto (`info@negonex.ia`) — pendiente de confirmación definitiva.
- Teléfono / línea oficial de WhatsApp Business en página de Contacto (`[[placeholder: número de WhatsApp Business o teléfono corporativo]]`).
- Perfiles oficiales de redes sociales (LinkedIn / YouTube) en `src/config/site.config.ts` y pie de página (`[[placeholder: enlaces oficiales de LinkedIn y YouTube]]`).
- Endpoints reales de formularios (`CONTACT_FORM_ENDPOINT`, `NEWSLETTER_ENDPOINT`) — actualmente en modo stub de Velocity Actions.

## Assumptions

- Los locales iniciales se limitan a español (`es`, predeterminado) e inglés (`en`); portugués (`pt`) podrá agregarse posteriormente con `velocity-add-locale`.
- El Sandbox Intercultural y el Estimador de Precios son demostraciones interactivas en cliente con datos curados del documento empresarial (sin conexión a APIs externas ni pasarelas de pago en v1).
- En la página Nosotros, los 5 socios fundadores se muestran con avatares de iniciales (sin fotografías de stock) junto a los 4 cargos operativos especializados.

## Decisions log

- 2026-11-26: project created with create-velocity-astro.
- 2026-11-26: locked v1 commercial architecture via /grill-me — locales es (default) + en, 6-section B2B sitemap, both React 19 islands (Intercultural Sandbox + Pricing Estimator), Navy + Emerald Fig. 1 light-first theme, Impeccable code-first buildPath, staging subdomain via SITE_URL, explicit contact placeholders, 5 founders with initial avatars + 4 roles + Porter Value Chain.
- 2026-11-26: standardized centered title/eyebrow hierarchy, block organization, card grids (including Porter Value Chain, 5-founder balanced flex grid, narrow FAQ/Timeline, BlogIndexView & SearchView unification), status color tokens, zero-CLS Sandbox typing, and CSP-safe Emil Kowalski architectural motion system across all 9 views.
