# Internal Proposal Strategy & Technical Breakdown

This document provides the internal engineering justification, hour breakdowns, infrastructure options, and sales talking points for the electrician proposal.

---

## 1. Base Pricing Formula

- **Hourly Rate Reference:** `$15 USD / hr`
- **Exchange Rate Reference:** `$1,500 ARS / USD`
- **ARS Hourly Rate:** `$22,500 ARS / hr`
- **Bundle Incentive:** `10% discount` on development modules when combining 2 or more modules (encourages upselling from Web-only to Web + WhatsApp Bot).

---

## 2. Detailed Breakdown of Development Hours

### Module A: Static Web Page + Google Maps (`14 Hours` = `$315,000 ARS`)
| Task | Hours | Details |
| :--- | :---: | :--- |
| **UI Layout & Mobile-First Design** | `3.5h` | Hero with dual CTAs (24h Emergency vs Scheduled Quote), services grid, trust badges. |
| **Content & Copywriting (Spanish)** | `2.5h` | Persuasive local copy tailored to residential/commercial electrical needs, FAQs, coverage map. |
| **Before/After Gallery & WhatsApp Links** | `2.5h` | Optimized WebP image gallery + pre-filled WhatsApp deep links per service category. |
| **Google Business Profile (Google Maps)** | `3.0h` | Creating/claiming the listing, configuring service areas, categories, photos, and review shortlink. |
| **Deployment, SEO Meta & Revisions** | `2.5h` | Schema.org `Electrician` local business markup, hosting setup on GitHub Pages/Cloudflare, 1 revision round. |

### Module B: 24/7 WhatsApp Triage Bot + Lead Sheet (`16 Hours` = `$360,000 ARS`)
| Task | Hours | Details |
| :--- | :---: | :--- |
| **Conversation Flow Design** | `3.0h` | Decision tree for *1) Emergency 24h*, *2) Quote Request*, *3) Zones & Visit Rates*. |
| **Bot Engine Setup & Integration** | `6.0h` | Configuring n8n / Typebot / Evolution API or Meta Cloud API webhook with media handling (photos of electrical panels). |
| **Google Sheets CRM Logging** | `3.0h` | Appending qualified leads (Timestamp, Name, Phone, Neighborhood, Issue Type, Photo URL) into a clean Google Sheet. |
| **Urgent Alert Routing & Testing** | `4.0h` | Priority notification routing for emergencies + end-to-end testing with the client. |

### Module C: Social Media Initial Kit + "Photo-to-Post" Automation (`10 Hours` = `$225,000 ARS`)
| Task | Hours | Details |
| :--- | :---: | :--- |
| **Profile Optimization (IG & FB)** | `2.0h` | Bio copy, link-in-bio setup, Story Highlight covers (*Urgencias, Trabajos, Reseñas, Zonas*). |
| **Editable Brand Templates (Canva)** | `3.5h` | 6 reusable templates (Before/After, Safety Tips, Service Promo, Client Review). |
| **"Photo + Audio to Caption" Bot** | `3.5h` | Simple Telegram/WhatsApp workflow (via Make/n8n + LLM API) where the electrician sends a job photo + short voice note and gets back a ready-to-post Instagram caption. |
| **Handover & Content Guide** | `1.0h` | 1-page checklist on how to take good before/after photos of electrical panels and installations. |

---

## 3. Infrastructure & Domain Licensing Options

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
  - Covers the VPS/Cloud instance hosting the WhatsApp bot + n8n/Evolution API uptime monitoring + monthly adjustments to bot pricing/zones + web gallery updates.

---

## 4. Future Upsell Roadmap (Phase 2 — Unpriced in Current Proposal)

Instead of overwhelming the client with a high-ticket Tier 3 today, the proposal showcases 5 modular upgrades they can request once the initial system pays for itself:
1. **Interactive Web Pre-Quote Calculator** (`~10h` future upsell)
2. **60-Second Branded PDF Quote Generator** (`~12h` future upsell)
3. **Google Calendar Inspection Booking** (`~8h` future upsell)
4. **Automated 5-Star Google Maps Review Booster** (`~6h` future upsell)
5. **B2B / Consortium Periodic Maintenance Reminder System** (`~8h` future upsell)
