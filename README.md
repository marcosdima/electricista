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
│   ├── config.js               # Centralized pricing, hours, exchange rate & content config
│   └── app.js                  # Interactive budget calculator & simulator logic
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

### 1. Development Modules (One-Time Investment)
| Module | Projected Hours | Total (ARS) |
| :--- | :---: | :---: |
| **Static Web Page + Google Maps Setup** | `14h` | **$ 315.000 ARS** |
| **24/7 WhatsApp Triage Bot + Lead Sheet** | `16h` | **$ 360.000 ARS** |
| **Social Media Initial Kit + "Photo-to-Post" Automation** | `10h` | **$ 225.000 ARS** |

### 2. Domain / URL Licensing Options
| Option | Setup Hours / Cost | Annual License (ARS) |
| :--- | :---: | :---: |
| **Free Subdomain (`.github.io` / `.vercel.app`)** | `0h` ($ 0) | **$ 0 / year** |
| **National Domain (`.com.ar` via NIC Argentina)** | `2h` ($ 45.000 ARS) | **~$ 8.500 ARS / year** |
| **International Domain (`.com`)** | `1.5h` ($ 33.750 ARS) | **~$ 22.000 ARS / year** |

### 3. Ongoing Technical Maintenance & Bot Hosting
| Plan | Monthly Equivalent | Monthly Cost (ARS) |
| :--- | :---: | :---: |
| **Self-Managed (Autogestión)** | `0h/mo` | **$ 0 / month** |
| **Web Maintenance & Support** | `~1.5h/mo` | **$ 35.000 ARS / month** |
| **24/7 Bot Cloud Server + Web Maintenance** | `~2.5h/mo` | **$ 55.000 ARS / month** |

### 4. Ongoing Social Media Management (Optional Retainers)
| Plan | Monthly Hours | Monthly Cost (ARS) |
| :--- | :---: | :---: |
| **Self-Managed (No Monthly Retainer)** | `0h/mo` | **$ 0 / month** |
| **Active Presence (4 Posts + 8 Stories / mo)** | `4h/mo` | **$ 90.000 ARS / month** |
| **Local Growth (8 Posts + 16 Stories + Google Maps / mo)** | `7h/mo` | **$ 157.500 ARS / month** |

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
