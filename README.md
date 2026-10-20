# Interactive Freelance Proposal — Electrical Services Client

A zero-build, interactive web proposal designed for a small electrical services business in Argentina. Built with clean HTML5, Tailwind CSS, and Vanilla JavaScript for instant deployment on **GitHub Pages**.

- **Code & Documentation Language:** English
- **Client-Facing UI Language:** Spanish (`es-AR`)
- **Client-Facing Currency:** Argentine Pesos (`ARS` only)

---

## Project Structure

```text
.
├── index.html                  # Main interactive proposal page (Spanish UI)
├── css/
│   └── styles.css              # Custom styles, WhatsApp simulator & print rules
├── js/
│   ├── config.js               # Centralized pricing, content & selection-gating config
│   └── app.js                  # Interactive budget calculator, demo simulator & gating logic
├── docs/
│   └── PROPOSAL_STRATEGY.md    # Internal breakdown of hours, tech stack & sales strategy
└── README.md                   # Project documentation
```

---

## Pricing & Configuration (`js/config.js`)

All pricing is dynamically calculated from a single source of truth in [`js/config.js`](js/config.js):

- **Reference Hourly Rate:** `$15 USD / hour`
- **Default Exchange Rate:** `$1,500 ARS / USD`
- **Effective Hourly Rate:** `$22,500 ARS / hour`

### How to Update Prices or Client Details

Open [`js/config.js`](js/config.js) and edit:

```javascript
meta: {
  clientBusinessName: "Servicios Eléctricos",
  clientLocation: "Argentina",
  freelancerWhatsApp: "54911XXXXXXXX", // Optional: set your WhatsApp number
},
pricing: {
  hourlyRateUSD: 15,
  exchangeRateARS: 1500, // Change this single number to update all ARS prices
}
```

---

## Summary of Budgeted Options (at $15 USD/hr = $22,500 ARS/hr)

### 1. Main Development Modules (One-Time Investment)
| Module | Internal Hours | Total (ARS) |
| :--- | :---: | :---: |
| **Static Web Page** | `~9h` | **$ 200.000 ARS** |
| **24/7 WhatsApp Triage Bot + Lead Sheet** | `16h` | **$ 360.000 ARS** |
| **Desktop Quote Builder (Presupuestador)** | `12h` | **$ 270.000 ARS** |

Module selection is gated: the `mgmt-bot-cloud` management plan is only selectable when
the Bot module is selected (step 1).

### 2. Standalone Extras
| Extra | Internal Hours | Total (ARS) |
| :--- | :---: | :---: |
| **Google Maps Setup & Optimization (Google Business Profile)** | `~2.5h` | **$ 55.000 ARS** |
| **Calendar Integration (Google Calendar booking)** | `~3h` | **$ 67.500 ARS** |

### 3. Domain / URL Licensing Options
| Option | Setup Hours / Cost | Annual License (ARS) |
| :--- | :---: | :---: |
| **Free Subdomain (`.github.io` / `.vercel.app`)** | `0h` ($ 0) | **$ 0 / year** |
| **National Domain (`.com.ar` via NIC Argentina)** | `2h` ($ 45.000 ARS) | **~$ 8.500 ARS / year** |
| **International Domain (`.com`)** | `1.5h` ($ 33.750 ARS) | **~$ 22.000 ARS / year** |

### 4. Ongoing Technical Maintenance & Bot Hosting
| Plan | Monthly Equivalent | Monthly Cost (ARS) |
| :--- | :---: | :---: |
| **Self-Managed (Autogestión)** | `0h/mo` | **$ 0 / month** |
| **Web Maintenance & Support** | `~1.5h/mo` | **$ 35.000 ARS / month** |
| **24/7 Bot Cloud Server + Web Maintenance** *(requires the Bot module)* | `~2.5h/mo` | **$ 55.000 ARS / month** |

### 5. Social Media — Binary State (Demonstrative, No Cost)
| State | What it means | Monthly Cost (ARS) |
| :--- | :--- | :---: |
| **Sin redes** (default) | The client manages their own profiles, zero commitment | **$ 0 / month** |
| **Quiero trabajar las redes** | Shows a demonstrative panel of possible tasks (templates, post automation, full management) — free, no commitment | **$ 0 / month** |

There are deliberately **no priced retainer tiers** in this proposal. Choosing "redes"
reveals idea cards (template pack, photo+audio caption automation, full ongoing
management, profile optimization) at no cost, purely as a demonstration. If the client
later wants continuous management, it is quoted separately at that point.

---

## Selection Gating Rules

Implemented in `isModuleLocked()` / `isManagementLocked()` (`js/app.js`) and declared
via flags in `js/config.js`:

- `mgmt-bot-cloud` management plan → requires the `whatsapp-bot` module.
- Deselecting the bot automatically falls back to the default management plan.

---

## Deploying to GitHub Pages

1. Push the repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Go to **Repository Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** → Branch: `main` (`/(root)`).
4. Within 60 seconds, the interactive proposal will be live at:
   `https://marcosdima.github.io/electricista/`
