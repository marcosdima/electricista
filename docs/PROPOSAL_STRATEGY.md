# Internal Proposal Strategy & Technical Breakdown

This document provides the internal engineering justification, hour breakdowns, infrastructure options, and sales talking points for the electrician proposal.

---

## 1. Base Pricing Formula

- **Hourly Rate Reference:** `$15 USD / hr`
- **Exchange Rate Reference:** `$1,500 ARS / USD`
- **ARS Hourly Rate:** `$22,500 ARS / hr`

---

## 2. Detailed Breakdown of Development Hours

### Module A: Static Web Page (`~9 Hours` = `$200,000 ARS`)
> Launch price, rounded down from the exact `~8.9h` hourly equivalent.
| Task | Hours | Details |
| :--- | :---: | :--- |
| **UI Layout & Mobile-First Design** | `3.0h` | Hero with dual CTAs (24h Emergency vs Scheduled Quote), services grid, trust badges. |
| **Content & Copywriting (Spanish)** | `2.0h` | Persuasive local copy tailored to residential/commercial electrical needs, FAQs, coverage map. |
| **Before/After Gallery & WhatsApp Links** | `2.0h` | Optimized WebP image gallery + pre-filled WhatsApp deep links per service category. |
| **Deployment, SEO Meta & Revisions** | `2.0h` | Schema.org `Electrician` local business markup, hosting setup on GitHub Pages/Cloudflare, 1 revision round. |

### Module B: 24/7 WhatsApp Triage Bot + Lead Sheet (`16 Hours` = `$360,000 ARS`)
| Task | Hours | Details |
| :--- | :---: | :--- |
| **Conversation Flow Design** | `3.0h` | Decision tree for *1) Emergency 24h*, *2) Quote Request*, *3) Zones & Visit Rates*. |
| **Bot Engine Setup & Integration** | `6.0h` | Configuring n8n / Typebot / Evolution API or Meta Cloud API webhook with media handling (photos of electrical panels). |
| **Google Sheets CRM Logging** | `3.0h` | Appending qualified leads (Timestamp, Name, Phone, Neighborhood, Issue Type, Photo URL) into a clean Google Sheet. |
| **Urgent Alert Routing & Testing** | `4.0h` | Priority notification routing for emergencies + end-to-end testing with the client. |

### Module C: Desktop Quote Builder — "Presupuestador" (`12 Hours` = `$270,000 ARS`)
| Task | Hours | Details |
| :--- | :---: | :--- |
| **GUI & Client/Project Data Entry** | `3.5h` | Desktop UI: line items, quantities, per-hour/per-visit labor, client history, reusable job types. |
| **Local Catalog & Persistence** | `2.5h` | Editable price catalog (materials + labor rates) stored locally; works fully offline. |
| **Semi-Automatic Web Price Lookup** | `2.5h` | "Search price" helper against MercadoLibre / hardware-store listings with manual confirmation before saving — no brittle fully-automatic scraping. |
| **LaTeX Template & PDF Generation** | `2.5h` | Branded quote template (letterhead, validity, payment terms) compiled to PDF via Tectonic (bundled single-binary TeX engine). |
| **Packaging & Handover** | `1.0h` | PyInstaller `.exe` for Windows, no runtime dependencies, 1-page usage guide. |

**Architecture notes (internal):**
- Python app, zero server, zero recurring hosting cost — this is a selling point vs. the web/bot modules.
- Internet is required only for price lookup and app updates; everything else runs locally.
- LaTeX via **Tectonic** (single static binary, on-demand package downloads) instead of requiring a full TeX Live installation.
- Distribution: portable `.exe` (PyInstaller onefile/onedir) handed to the client on first delivery.
- Long-term: the catalog and template are parametrizable, so the same tool can be productized for other trades.

### Module D — Removed from the Proposal
> The former *"Social Media Initial Kit + Photo-to-Post Automation"* (`10h = $225,000`)
> was removed from the budgeted modules. The step-5 social state now shows a **free,
> demonstrative menu of possible management tasks** instead (see section 3), and the
> *Photo + Audio to Caption* automation idea was moved to the Phase 2 roadmap (section 6).

### Standalone Extras
**Google Maps Setup (`~2.5 Hours` = `$55,000 ARS`)**
| Task | Hours | Details |
| :--- | :---: | :--- |
| **Claim & Configure Listing** | `1.5h` | Create/claim the Google Business Profile, service areas, categories, contact data. |
| **Photos, Shortlink & Review Flow** | `1.0h` | Initial photo upload, review shortlink, verification follow-up. |

**Calendar Integration — Google Calendar (`~3 Hours` = `$67,500 ARS`)**
| Task | Hours | Details |
| :--- | :---: | :--- |
| **Availability Rules & Calendar Sync** | `1.5h` | Working hours, blocked slots and two-way sync with the client's Google Calendar. |
| **Booking Widget, WhatsApp Confirmation & Reminders** | `1.5h` | Request form on the site, automatic confirmation message and pre-visit reminder. |

> **How it runs without a server:** the booking flow is wired through *Google Apps
> Script* (free, lives inside the client's own Google account) or a free-tier
> scheduling tool. No hosting cost, no monthly fee — same selling argument as the
> rest of the stack.

---

## 3. Social Media Sales Approach (Binary State, Free Demonstration)

The old version offered three fixed retainer tiers ($0 / $90k / $157.5k), later a priced
kit behind a gate. Neither worked: price deltas communicated nothing for an undefined
scope. The proposal now presents **two states only**, and the active state costs nothing:

1. **Sin redes** (default, `$0/mes`): self-managed, no commitment.
2. **Quiero trabajar las redes** (badge *"Demostrativo"*, `$0/mes`): reveals a panel of
   idea cards — *Presentación de plantillas*, *Automatización de publicaciones*,
   *Gestión completa de redes*, *Optimización de perfiles* — each with a short
   description. The panel footer states these are demonstrative examples with no cost
   in this proposal, and that continuous management is quoted separately if requested
   later.

**Why free:** the cards are conversation openers, not deliverables. Charging for the
menu itself would force a scope the client did not ask for. Their purpose is to make
"gestión de redes" concrete so the client can decide whether to pursue it.

**Discovery questions if the client later asks for continuous management:**
- ¿Cuál es el objetivo? (visibilidad local, cerrar más obras grandes, facturar mantenimientos)
- ¿Con qué frecuencia podés sacar fotos de obra?
- ¿Qué redes usan hoy tus clientes? (Instagram vs Facebook vs solo WhatsApp)
- ¿Preferís delegar todo o solo la redacción?
- ¿Qué rango de abono mensual te resulta razonable?

That ongoing management is **outside this proposal** and quoted at that point. This
avoids inventing prices for an undefined scope while keeping the ambiguity as a natural
future touchpoint with the client.

---

## 4. Infrastructure & Domain Licensing Options

### Domain (URL) Options
1. **Free Subdomain (`.github.io` / `.vercel.app`)**:
   - **Setup:** `0h` (`$0 ARS`) | **Annual Fee:** `$0 ARS`
   - Best if the client wants absolute minimum spend and only needs a link for Instagram/WhatsApp bio and QR codes.
2. **National Domain (`.com.ar` via NIC Argentina)**:
   - **Setup:** `2h` (`$45,000 ARS`) | **Annual Fee:** `~$8,500 ARS / year` (paid directly to NIC.ar).
   - **Workflow:** Registered under the client's CUIT via *ARCA (ex-AFIP) → Administrador de Relaciones → NIC Argentina / Trámites a Distancia (TAD)*, then delegated to Cloudflare/GitHub Pages DNS.
3. **International Domain (`.com`)**:
   - **Setup:** `1.5h` (`$33,750 ARS`) | **Annual Fee:** `~$22,000 ARS / year` (`~$14–15 USD/yr` via Namecheap/Cloudflare/Porkbun).
   - Best if the client does not want to deal with AFIP Clave Fiscal Level 2/3.

### Bot Hosting & Technical Management Options
- **Option A — Self-Managed (`$0 / month`)**:
  - Static site runs free on GitHub Pages/Cloudflare.
  - If the client only buys the Static Web, there is genuinely zero monthly cost.
  - If they buy the Bot and want `$0/mo`, they can use WhatsApp Business native auto-replies + a web-hosted interactive pre-chat wizard (Typebot free tier) that formats the message before opening WhatsApp.
- **Option B — Web Maintenance & Support (`$35,000 ARS / month` — ~1.5h/mo)**:
  - Covers up to 2 monthly content updates (adding new job photos, updating visit prices for inflation) and Google Maps photo updates.
- **Option C — 24/7 Bot Cloud Server + Web Maintenance (`$55,000 ARS / month` — ~2.5h/mo)**:
  - **Requires the Bot module** — the option is shown locked otherwise.
  - Covers the VPS/Cloud instance hosting the WhatsApp bot + n8n/Evolution API uptime monitoring + monthly adjustments to bot pricing/zones + web gallery updates.

---

## 5. Selection Gating Rules (Implementation Reference)

| Target | Condition | Behavior when unmet |
| :--- | :--- | :--- |
| `mgmt-bot-cloud` plan | `whatsapp-bot` module selected | Card dimmed, price replaced by the requirement hint |
| Deselect `whatsapp-bot` | — | Management selection falls back to `mgmt-self` |

Declared in `js/config.js` (`requiresModule`, `requiresHint`) and enforced by
`isModuleLocked()` / `isManagementLocked()` in `js/app.js`. The former
`requiresSocialActive` gate (social kit) no longer exists — the kit itself was removed.

---

## 6. Future Upsell Roadmap (Phase 2 — Unpriced in Current Proposal)

Instead of overwhelming the client with a high-ticket Tier 3 today, the proposal showcases these modular upgrades they can request once the initial system pays for itself. The list was **de-duplicated** so nothing repeats what another area already covers:

1. **Public Web Pre-Quote for End Customers** (`~8h` future upsell — web evolution of the desktop Quote Builder; the earlier "Interactive Web Pre-Quote Calculator" was the same idea and was merged into this one).
2. **Mini CRM with Client History & Follow-Ups** (`~7h` future upsell).
3. **B2B / Consortium Periodic Maintenance Reminder System** (`~8h` future upsell).

**Removed as duplicates (not part of the roadmap anymore):**
- *Photo + Audio to Caption Automation* — already shown as the "Automatización de publicaciones" idea card in the social panel and as demo case 3.
- *Automated 5-Star Google Maps Review Booster* — the Google Maps extra already sets up the review shortlink and collection flow.

> The former *"60-Second PDF Quote Generator"* upsell was **promoted to Module C**
> (the desktop Presupuestador), and *"Google Calendar Inspection Booking"* was
> **promoted to a standalone extra** — neither belongs to this roadmap anymore.
