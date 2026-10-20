/**
 * Main Application Logic for the Electrician Proposal
 * Clean, emoji-free, first-person singular perspective, with selection micro-animations.
 * No presets, no hours/timelines displayed. Independent modules and extras selection.
 */

// Application state initialized from PROPOSAL_CONFIG
const state = {
  selectedModules: new Set(
    PROPOSAL_CONFIG.developmentModules
      .filter((m) => m.defaultSelected)
      .map((m) => m.id)
  ),
  selectedExtras: new Set(
    PROPOSAL_CONFIG.extraModules
      .filter((e) => e.defaultSelected)
      .map((e) => e.id)
  ),
  selectedDomainId:
    PROPOSAL_CONFIG.domainOptions.find((d) => d.defaultSelected)?.id ||
    "domain-com-ar",
  selectedManagementId:
    PROPOSAL_CONFIG.managementOptions.find((m) => m.defaultSelected)?.id ||
    "mgmt-self",
  selectedSocialId:
    PROPOSAL_CONFIG.socialOptions.find((s) => s.defaultSelected)?.id ||
    "social-none",
  activeDemoScenario: "emergency",
  demoTimers: [],
};

// Display order of the demo scenarios in the carousel
const DEMO_SCENARIO_ORDER = [
  "emergency",
  "quote",
  "social",
  "presupuestador",
];

/**
 * Returns true when a development module is locked behind another selection.
 * @param {object} mod
 * @returns {boolean}
 */
function isModuleLocked(mod) {
  if (mod.requiresModule && !state.selectedModules.has(mod.requiresModule))
    return true;
  return false;
}

/**
 * Formats a numeric value as Argentine Pesos (e.g., "$ 270.000")
 * @param {number} amount
 * @returns {string}
 */
function formatARS(amount) {
  if (amount === 0) return "$ 0";
  return (
    "$ " +
    Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

/**
 * Returns a clean SVG icon by name
 * @param {string} name
 * @param {string} customClass
 * @returns {string}
 */
function getIconSVG(name, customClass = "w-5 h-5") {
  const icons = {
    zap: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    globe: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    "message-square": `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    instagram: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    "map-pin": `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calculator: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/></svg>`,
    "file-text": `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    calendar: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    users: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    star: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    bell: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    check: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    plus: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    layout: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
  };
  return icons[name] || icons.globe;
}

/**
 * Triggers a subtle value update animation on target elements
 */
function animateValueUpdates() {
  const elements = [
    document.getElementById("summary-onetime-total"),
    document.getElementById("summary-deposit"),
    document.getElementById("summary-annual-domain"),
    document.getElementById("summary-monthly-total"),
    document.getElementById("summary-items-count"),
  ];

  elements.forEach((el) => {
    if (!el) return;
    el.classList.remove("value-updated");
    void el.offsetWidth; // Reflow
    el.classList.add("value-updated");
  });
}

/**
 * Toggles a development module
 * @param {string} moduleId
 */
function toggleModule(moduleId) {
  const mod = PROPOSAL_CONFIG.developmentModules.find(
    (m) => m.id === moduleId
  );
  if (mod && isModuleLocked(mod)) return;

  if (state.selectedModules.has(moduleId)) {
    state.selectedModules.delete(moduleId);
    // Keep management selection consistent when the bot is removed
    if (moduleId === "whatsapp-bot") {
      const cloudMgmt = PROPOSAL_CONFIG.managementOptions.find(
        (m) => m.requiresModule === "whatsapp-bot"
      );
      if (
        cloudMgmt &&
        state.selectedManagementId === cloudMgmt.id
      ) {
        state.selectedManagementId =
          PROPOSAL_CONFIG.managementOptions.find((m) => m.defaultSelected)
            ?.id || "mgmt-self";
      }
    }
  } else {
    state.selectedModules.add(moduleId);
  }
  renderAll();
  animateValueUpdates();
}

/**
 * Toggles an extra module
 * @param {string} extraId
 */
function toggleExtra(extraId) {
  if (state.selectedExtras.has(extraId)) {
    state.selectedExtras.delete(extraId);
  } else {
    state.selectedExtras.add(extraId);
  }
  renderAll();
  animateValueUpdates();
}

/**
 * Selects a domain option
 * @param {string} domainId
 */
function selectDomain(domainId) {
  state.selectedDomainId = domainId;
  renderAll();
  animateValueUpdates();
}

/**
 * Selects a technical management option
 * @param {string} mgmtId
 */
function selectManagement(mgmtId) {
  const mgmt = PROPOSAL_CONFIG.managementOptions.find((m) => m.id === mgmtId);
  if (mgmt && isManagementLocked(mgmt)) return;
  state.selectedManagementId = mgmtId;
  renderAll();
  animateValueUpdates();
}

/**
 * Returns true when a management option depends on a module that is not selected
 * @param {object} mgmt
 * @returns {boolean}
 */
function isManagementLocked(mgmt) {
  return Boolean(
    mgmt.requiresModule && !state.selectedModules.has(mgmt.requiresModule)
  );
}

/**
 * Selects the social media state (sin redes / redes)
 * @param {string} socialId
 */
function selectSocial(socialId) {
  state.selectedSocialId = socialId;
  renderAll();
  animateValueUpdates();
}

/**
 * Renders Development Modules (No hours displayed)
 */
function renderDevelopmentModules() {
  const container = document.getElementById("modules-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.developmentModules
    .map((mod) => {
      const isSelected = state.selectedModules.has(mod.id);
      const isLocked = isModuleLocked(mod);
      const lockedLabel = "Requiere otro módulo";

      return `
        <div
          onclick="toggleModule('${mod.id}')"
          class="selectable-card rounded-2xl border p-6 bg-white ${
            isLocked ? "cursor-not-allowed is-locked" : "cursor-pointer"
          } ${isSelected ? "is-selected" : "border-slate-200"} ${
        isLocked && !isSelected ? "opacity-70" : ""
      }"
        >
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div class="flex items-start gap-3.5">
              <div class="p-3 rounded-xl ${
                isSelected
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-100 text-slate-700"
              } transition-colors shrink-0">
                ${getIconSVG(mod.icon, "w-6 h-6")}
              </div>
              <div>
                <h4 class="text-lg font-bold text-slate-900">${mod.title}</h4>
                <p class="text-sm text-slate-600 mt-0.5">${mod.subtitle}</p>
              </div>
            </div>

            <div class="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
              <div class="text-right">
                <span class="text-2xl font-bold text-slate-900">${formatARS(
                  mod.costARS
                )}</span>
                <span class="text-xs text-slate-500 block">Pago único</span>
              </div>
              <div class="mt-2">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  isSelected
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-100 text-slate-700"
                }">
                  ${
                    isSelected
                      ? "Incluido en propuesta"
                      : isLocked
                      ? lockedLabel
                      : "Agregar módulo"
                  }
                </span>
              </div>
            </div>
          </div>

          <p class="text-sm text-slate-700 mb-4 leading-relaxed">
            ${mod.summary}
          </p>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Características incluidas:
            </div>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              ${mod.features
                .map(
                  (feat) => `
                <li class="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span class="text-amber-600 shrink-0 mt-0.5">${getIconSVG(
                    "check",
                    "w-4 h-4"
                  )}</span>
                  <span>${feat}</span>
                </li>
              `
                )
                .join("")}
            </ul>
            <p class="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-slate-500">
              <strong>Nota técnica:</strong> ${mod.techNote}
            </p>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders Standalone Extras (e.g. Google Maps)
 */
function renderExtraModules() {
  const container = document.getElementById("extras-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.extraModules
    .map((extra) => {
      const isSelected = state.selectedExtras.has(extra.id);

      return `
        <div
          onclick="toggleExtra('${extra.id}')"
          class="selectable-card cursor-pointer rounded-2xl border p-5 bg-white flex flex-col justify-between ${
            isSelected ? "is-selected" : "border-slate-200"
          }"
        >
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-2.5">
                <div class="p-2.5 rounded-xl ${
                  isSelected
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-100 text-slate-700"
                } transition-colors shrink-0">
                  ${getIconSVG(extra.icon, "w-5 h-5")}
                </div>
                <div>
                  <h4 class="text-base font-bold text-slate-900">${extra.title}</h4>
                  <p class="text-xs text-slate-500">${extra.subtitle}</p>
                </div>
              </div>

              <div class="text-right shrink-0">
                <span class="text-lg font-bold text-slate-900">${formatARS(
                  extra.costARS
                )}</span>
                <span class="text-[11px] text-slate-500 block">Pago único</span>
              </div>
            </div>

            <p class="text-xs sm:text-sm text-slate-600 mb-3.5 leading-relaxed">
              ${extra.summary}
            </p>

            <ul class="space-y-1.5 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              ${extra.features
                .map(
                  (f) => `
                <li class="flex items-start gap-1.5 text-xs text-slate-700">
                  <span class="text-amber-600 font-bold">•</span>
                  <span>${f}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>

          <div class="pt-3 border-t border-slate-200/80 flex items-center justify-between">
            <span class="text-xs text-slate-500">Servicio extra opcional</span>
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg ${
              isSelected
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-100 text-slate-700"
            }">
              ${isSelected ? "Incluido" : "Sumar extra"}
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders Domain Options (No hours displayed)
 */
function renderDomainOptions() {
  const container = document.getElementById("domains-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.domainOptions
    .map((dom) => {
      const isSelected = state.selectedDomainId === dom.id;

      return `
        <div
          onclick="selectDomain('${dom.id}')"
          class="selectable-card cursor-pointer rounded-2xl border p-5 bg-white flex flex-col justify-between ${
            isSelected ? "is-selected" : "border-slate-200"
          }"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isSelected
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-700"
              }">
                ${dom.badge}
              </span>
              <span class="w-5 h-5 rounded-full border flex items-center justify-center check-circle ${
                isSelected ? "border-amber-600 bg-amber-500" : "border-slate-300"
              }">
                ${
                  isSelected
                    ? `<span class="w-2 h-2 rounded-full bg-slate-950"></span>`
                    : ""
                }
              </span>
            </div>

            <h4 class="text-base font-bold text-slate-900 mb-2">${dom.title}</h4>
            <p class="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              ${dom.description}
            </p>

            <div class="space-y-1.5 mb-4">
              ${dom.pros
                .map(
                  (pro) => `
                <div class="flex items-start gap-1.5 text-xs text-slate-700">
                  <span class="text-emerald-600 font-bold">•</span>
                  <span>${pro}</span>
                </div>
              `
                )
                .join("")}
              ${dom.cons
                .map(
                  (con) => `
                <div class="flex items-start gap-1.5 text-xs text-slate-500">
                  <span class="text-slate-400 font-bold">•</span>
                  <span>${con}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-200/80 space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-500">Configuración e integración:</span>
              <span class="font-semibold text-slate-900">${
                dom.setupCostARS === 0
                  ? "Sin cargo ($ 0)"
                  : formatARS(dom.setupCostARS)
              }</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Licencia anual oficial:</span>
              <span class="font-semibold text-amber-800">${
                dom.annualLicenseARS === 0
                  ? "$ 0 / año"
                  : `${formatARS(dom.annualLicenseARS)} / año`
              }</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders Management Options
 */
function renderManagementOptions() {
  const container = document.getElementById("management-container");
  if (!container) return;

  const hasBotSelected = state.selectedModules.has("whatsapp-bot");

  container.innerHTML = PROPOSAL_CONFIG.managementOptions
    .map((mgmt) => {
      const isSelected = state.selectedManagementId === mgmt.id;
      const isLocked = isManagementLocked(mgmt);
      const showBotNotice = hasBotSelected && mgmt.id === "mgmt-self";

      return `
        <div
          onclick="selectManagement('${mgmt.id}')"
          class="selectable-card rounded-2xl border p-5 bg-white flex flex-col justify-between ${
            isLocked ? "cursor-not-allowed" : "cursor-pointer"
          } ${isSelected ? "is-selected" : "border-slate-200"} ${
        isLocked && !isSelected ? "opacity-70" : ""
      }"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isSelected
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-700"
              }">
                ${mgmt.badge}
              </span>
              <span class="w-5 h-5 rounded-full border flex items-center justify-center check-circle ${
                isSelected ? "border-amber-600 bg-amber-500" : "border-slate-300"
              }">
                ${
                  isSelected
                    ? `<span class="w-2 h-2 rounded-full bg-slate-950"></span>`
                    : ""
                }
              </span>
            </div>

            <h4 class="text-base font-bold text-slate-900 mb-2">${mgmt.title}</h4>
            <p class="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              ${mgmt.description}
            </p>

            <ul class="space-y-1.5 mb-4">
              ${mgmt.includes
                .map(
                  (inc) => `
                <li class="flex items-start gap-1.5 text-xs text-slate-700">
                  <span class="text-amber-600 font-bold">•</span>
                  <span>${inc}</span>
                </li>
              `
                )
                .join("")}
            </ul>

            ${
              showBotNotice
                ? `<div class="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 mb-3">
                    <strong>Aclaración:</strong> Para que el asistente de WhatsApp funcione las 24 horas sin depender de tu propia computadora encendida, se requiere el abono con Servidor Cloud.
                  </div>`
                : ""
            }
          </div>

          <div class="pt-3 border-t border-slate-200/80 flex items-baseline justify-between gap-3">
            <span class="text-xs text-slate-500">${
              isLocked ? "Requisito:" : "Abono mensual:"
            }</span>
            <span class="text-base font-bold text-slate-900 text-right">
              ${
                isLocked
                  ? `<span class="text-xs font-medium text-slate-500">${
                      mgmt.requiresHint || "Requiere contratar otro módulo"
                    }</span>`
                  : mgmt.monthlyARS === 0
                  ? "$ 0 / mes"
                  : `${formatARS(mgmt.monthlyARS)} <span class="text-xs font-normal text-slate-500">/ mes</span>`
              }
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}
/**
 * Renders the Social Media binary state (sin redes / redes).
 * When "redes" is active, a full-width panel lists demonstrative idea cards.
 */
function renderSocialOptions() {
  const container = document.getElementById("social-container");
  if (!container) return;

  const stateCards = PROPOSAL_CONFIG.socialOptions
    .map((soc) => {
      const isSelected = state.selectedSocialId === soc.id;

      return `
        <div
          onclick="selectSocial('${soc.id}')"
          class="selectable-card cursor-pointer rounded-2xl border p-5 bg-white flex flex-col ${
            isSelected ? "is-selected" : "border-slate-200"
          }"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isSelected
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-700"
              }">
                ${soc.badge}
              </span>
              <span class="w-5 h-5 rounded-full border flex items-center justify-center check-circle ${
                isSelected
                  ? "border-amber-600 bg-amber-500"
                  : "border-slate-300"
              }">
                ${
                  isSelected
                    ? `<span class="w-2 h-2 rounded-full bg-slate-950"></span>`
                    : ""
                }
              </span>
            </div>

            <h4 class="text-base font-bold text-slate-900 mb-2">${soc.title}</h4>
            <p class="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              ${soc.description}
            </p>

            <ul class="space-y-1.5">
              ${soc.includes
                .map(
                  (inc) => `
                <li class="flex items-start gap-1.5 text-xs text-slate-700">
                  <span class="text-amber-600 font-bold">•</span>
                  <span>${inc}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `;
    })
    .join("");

  const activeSoc = PROPOSAL_CONFIG.socialOptions.find(
    (s) => s.id === state.selectedSocialId && s.ideas
  );

  const ideasPanel = activeSoc
    ? `
      <div class="md:col-span-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-5 animate-fade-in">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div class="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Ejemplos de lo que se podría hacer en la gestión
          </div>
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
            Demostrativo — sin costo
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${activeSoc.ideas
            .map(
              (idea) => `
            <div class="bg-white rounded-xl border border-slate-200 p-4">
              <div class="p-2 rounded-lg bg-amber-100 text-amber-800 w-fit mb-2.5">
                ${getIconSVG(idea.icon, "w-4 h-4")}
              </div>
              <div class="font-bold text-slate-900 text-sm mb-1.5">${idea.title}</div>
              <p class="text-xs text-slate-600 leading-relaxed">${idea.description}</p>
            </div>
          `
            )
            .join("")}
        </div>
        <p class="text-xs text-slate-500 mt-4 pt-3 border-t border-amber-200 leading-relaxed">
          Estos ejemplos se muestran a modo de demostración y no tienen costo
          dentro de esta propuesta. Si más adelante querés que me ocupe de la
          gestión de tus redes de forma continua, lo charlamos y lo cotizo por
          separado.
        </p>
      </div>
    `
    : "";

  container.innerHTML = stateCards + ideasPanel;
}
/**
 * Renders the Live Budget Summary Panel (No hours)
 */
function renderSummary() {
  const selectedMods = PROPOSAL_CONFIG.developmentModules.filter((m) =>
    state.selectedModules.has(m.id)
  );
  const selectedExts = PROPOSAL_CONFIG.extraModules.filter((e) =>
    state.selectedExtras.has(e.id)
  );
  const domainObj = PROPOSAL_CONFIG.domainOptions.find(
    (d) => d.id === state.selectedDomainId
  );
  const mgmtObj = PROPOSAL_CONFIG.managementOptions.find(
    (m) => m.id === state.selectedManagementId
  );
  const socialObj = PROPOSAL_CONFIG.socialOptions.find(
    (s) => s.id === state.selectedSocialId
  );

  const modulesCostARS = selectedMods.reduce((sum, m) => sum + m.costARS, 0);
  const extrasCostARS = selectedExts.reduce((sum, e) => sum + e.costARS, 0);
  const domainSetupARS = domainObj ? domainObj.setupCostARS : 0;

  const totalOneTimeARS = modulesCostARS + extrasCostARS + domainSetupARS;
  const totalAnnualDomainARS = domainObj ? domainObj.annualLicenseARS : 0;
  const totalMonthlyARS =
    (mgmtObj ? mgmtObj.monthlyARS : 0) +
    (socialObj ? socialObj.monthlyARS : 0);

  const totalSelectedItems = selectedMods.length + selectedExts.length;

  const itemsListEl = document.getElementById("summary-items-list");
  if (itemsListEl) {
    const itemsHTML = [];

    if (totalSelectedItems === 0) {
      itemsHTML.push(`
        <div class="text-xs text-slate-400 bg-slate-900 rounded-lg p-3 border border-slate-800">
          Seleccioná al menos un servicio para visualizar el presupuesto.
        </div>
      `);
    } else {
      selectedMods.forEach((m) => {
        itemsHTML.push(`
          <div class="flex justify-between items-start text-sm gap-2">
            <span class="text-white font-medium">${m.title}</span>
            <span class="font-semibold text-slate-200 shrink-0">${formatARS(
              m.costARS
            )}</span>
          </div>
        `);
      });

      selectedExts.forEach((e) => {
        itemsHTML.push(`
          <div class="flex justify-between items-start text-sm gap-2">
            <span class="text-amber-300 font-medium">+ ${e.title}</span>
            <span class="font-semibold text-slate-200 shrink-0">${formatARS(
              e.costARS
            )}</span>
          </div>
        `);
      });
    }

    if (domainObj) {
      itemsHTML.push(`
        <div class="flex justify-between items-start text-sm gap-2 pt-2 border-t border-slate-800">
          <div>
            <span class="text-slate-300">${domainObj.title}</span>
            <span class="block text-xs text-slate-400">Configuración e integración</span>
          </div>
          <span class="font-semibold text-slate-200 shrink-0">${
            domainSetupARS === 0 ? "$ 0" : formatARS(domainSetupARS)
          }</span>
        </div>
      `);
    }

    itemsListEl.innerHTML = itemsHTML.join("");
  }

  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setElText(
    "summary-items-count",
    totalSelectedItems === 1
      ? "1 servicio seleccionado"
      : `${totalSelectedItems} servicios seleccionados`
  );
  setElText("summary-onetime-total", `${formatARS(totalOneTimeARS)} ARS`);
  setElText(
    "summary-deposit",
    `${formatARS(totalOneTimeARS * 0.5)} ARS (50% anticipo)`
  );
  setElText(
    "summary-annual-domain",
    totalAnnualDomainARS === 0
      ? "$ 0"
      : `${formatARS(totalAnnualDomainARS)} ARS / año`
  );
  setElText(
    "summary-monthly-total",
    `${
      totalMonthlyARS === 0
        ? "$ 0"
        : `${formatARS(totalMonthlyARS)} ARS`
    } / mes`
  );

  const monthlyDescEl = document.getElementById("summary-monthly-breakdown");
  if (monthlyDescEl) {
    const parts = [];
    if (mgmtObj && mgmtObj.monthlyARS > 0) parts.push(mgmtObj.title);
    monthlyDescEl.textContent =
      parts.length > 0
        ? `Abonos seleccionados: ${parts.join(" + ")}`
        : "Sin costos mensuales fijos.";
  }
}

/**
 * Renders the Future Roadmap
 */
function renderFutureRoadmap() {
  const container = document.getElementById("roadmap-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.futureRoadmap
    .map(
      (item) => `
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow transition-shadow">
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="p-2 rounded-lg bg-amber-100 text-amber-900">
            ${getIconSVG(item.icon, "w-5 h-5")}
          </div>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            ${item.tag}
          </span>
        </div>
        <h4 class="text-base font-bold text-slate-900 mb-2">${item.title}</h4>
        <p class="text-sm text-slate-600 leading-relaxed">${item.description}</p>
      </div>
    `
    )
    .join("");
}

/**
 * Cancels any pending progressive-load steps from a previous scenario.
 */
function clearDemoTimers() {
  (state.demoTimers || []).forEach(clearTimeout);
  state.demoTimers = [];
}

/**
 * Schedules a progressive-load step, tracked so it can be cancelled.
 * @param {Function} fn
 * @param {number} delay
 */
function scheduleDemoStep(fn, delay) {
  state.demoTimers.push(setTimeout(fn, delay));
}

/**
 * Animates the progress bar inside the selected scenario chip while the
 * content loads progressively. Resets the other chips to zero.
 * @param {string} scenarioKey
 * @param {number} durationMs
 */
function startChipProgress(scenarioKey, durationMs) {
  document.querySelectorAll(".demo-tab-btn").forEach((btn) => {
    const fill = btn.querySelector
      ? btn.querySelector(".demo-tab-progress-fill")
      : null;
    if (!fill || !fill.style) return;

    fill.style.transition = "none";
    fill.style.width = "0%";

    if (btn.getAttribute("data-scenario") === scenarioKey) {
      void fill.offsetWidth; // Force reflow so the reset applies
      fill.style.transition = `width ${durationMs}ms linear`;
      fill.style.width = "100%";
    }
  });
}

/**
 * Moves the demo scenario carousel one position (wraps around).
 * @param {number} dir - 1 for next, -1 for previous
 */
function moveDemoCarousel(dir) {
  const idx = Math.max(
    0,
    DEMO_SCENARIO_ORDER.indexOf(state.activeDemoScenario)
  );
  const next =
    DEMO_SCENARIO_ORDER[
      (idx + dir + DEMO_SCENARIO_ORDER.length) % DEMO_SCENARIO_ORDER.length
    ];
  switchDemoScenario(next);
}

/**
 * Switches the Demo Scenario in the simulator as a carousel: the selected
 * chip shows a progressive load bar while content appears step by step.
 * @param {string} scenarioKey
 */
function switchDemoScenario(scenarioKey) {
  state.activeDemoScenario = scenarioKey;
  clearDemoTimers();

  document.querySelectorAll(".demo-tab-btn").forEach((btn) => {
    const isCurrent = btn.getAttribute("data-scenario") === scenarioKey;
    btn.className = `demo-tab-btn text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
      isCurrent
        ? "bg-slate-900 text-white border-amber-600 shadow-sm"
        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
    }`;

    const fill = btn.querySelector
      ? btn.querySelector(".demo-tab-progress-fill")
      : null;
    if (fill && fill.style) {
      fill.style.transition = "none";
      fill.style.width = "0%";
    }

    if (isCurrent && btn.scrollIntoView) {
      btn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  });

  const scenarios = {
    emergency: {
      title: "Caso 1: Urgencia Eléctrica",
      explanation:
        "Mientras estás trabajando en una instalación, el asistente detecta la urgencia, solicita ubicación y foto del tablero técnico para que evalúes la situación de inmediato.",
      messages: [
        {
          from: "user",
          text: "Hola, se cortó la luz en casa y saltó el disyuntor general, no sube.",
          time: "14:22",
        },
        {
          from: "bot",
          text: "Hola. Te comunicás con el asistente técnico de Servicios Eléctricos. El instalador se encuentra en obra en este momento.\n\nPor favor seleccioná una opción:\n1. Urgencia eléctrica\n2. Solicitud de presupuesto\n3. Zonas y tarifas de visita",
          time: "14:22",
        },
        {
          from: "user",
          text: "1",
          time: "14:23",
        },
        {
          from: "bot",
          text: "Para evaluar la urgencia de inmediato:\n1. Indicá barrio o dirección aproximada.\n2. Enviá una fotografía del tablero principal para verificar el tipo de protección.",
          time: "14:23",
        },
        {
          from: "user",
          text: "Luján, Av. Nuestra Señora de Luján al 5200. Te adjunto foto del tablero.",
          time: "14:24",
        },
        {
          from: "bot",
          text: "Datos recibidos. Se envió un aviso prioritario al técnico con la información y fotografía. Te responderá a la brevedad.",
          time: "14:24",
        },
      ],
    },
    quote: {
      title: "Caso 2: Solicitud de Presupuesto",
      explanation:
        "Para trabajos no urgentes, el asistente recopila los detalles técnicos del trabajo y los guarda ordenados para que los presupuestes al finalizar tu jornada.",
      messages: [
        {
          from: "user",
          text: "Buenas tardes, necesito presupuesto para colocar 4 tomas nuevos y revisar una térmica.",
          time: "18:10",
        },
        {
          from: "bot",
          text: "Hola. Para preparar el presupuesto estimado hoy mismo:\n\n• ¿En qué localidad o barrio se encuentra el inmueble?\n• Si es posible, adjuntá una fotografía del sector a intervenir o del tablero actual.",
          time: "18:10",
        },
        {
          from: "user",
          text: "Es en Luján. Los tomas van sobre pared de ladrillo. Ya te envío la foto.",
          time: "18:12",
        },
        {
          from: "bot",
          text: "Consulta registrada. Al finalizar las obras del día, el técnico revisará el material técnico y te enviará la estimación correspondiente por este medio.",
          time: "18:12",
        },
      ],
    },
    social: {
      title: "Caso 3: Redacción Asistida para Redes",
      explanation:
        "A modo de demostración: enviás una foto del trabajo terminado con un breve audio descriptivo y el sistema te devuelve el texto técnico redactado de forma profesional.",
      messages: [
        {
          from: "user",
          text: "[Fotografía de tablero nuevo] + Audio: 'Recambio completo de tablero general en local de Luján, se reemplazaron térmicas viejas y se colocó protector de tensión'",
          time: "17:45",
        },
        {
          from: "bot",
          text: "Texto preparado para publicación:\n\nRenovación de Tablero General en Local Comercial\n\nTrabajo realizado hoy:\n• Reemplazo de protecciones termomagnéticas bajo norma IRAM.\n• Instalación de protector automático de sobretensión y subtensión.\n• Rotulado técnico y ordenamiento de circuitos.\n\nPor consultas de instalaciones o mantenimiento técnico, escribime directamente por WhatsApp.",
          time: "17:45",
        },
      ],
    },
    presupuestador: {
      type: "document",
      title: "Caso 4: Presupuesto en PDF desde la PC",
      explanation:
        "Al terminar la visita, cargás los conceptos en el presupuestador, verificás los precios del material con la búsqueda asistida y el programa genera un PDF con tu membrete listo para enviar por WhatsApp.",
      documentHtml: `
        <div class="animate-fade-in bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-slate-800">
          <div class="flex justify-between items-start gap-3 pb-3 mb-3 border-b border-slate-200">
            <div>
              <div class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Presupuesto N° 0042</div>
              <div class="font-bold text-sm">Servicios Eléctricos — Instalaciones y Tableros</div>
              <div class="text-[11px] text-slate-500">Electricista matriculado · +54 9 11 XXXX-XXXX</div>
            </div>
            <div class="text-right text-[11px] text-slate-500 shrink-0">
              15/10/2026<br />Válido por 15 días
            </div>
          </div>

          <div class="text-[11px] text-slate-500 mb-2">Cliente: Roberto Gómez — Luján, Buenos Aires</div>

          <table class="w-full text-xs">
            <thead>
              <tr class="text-[10px] uppercase text-slate-400 border-b border-slate-200">
                <th class="text-left py-1.5 font-semibold">Concepto</th>
                <th class="text-right py-1.5 font-semibold">Cant.</th>
                <th class="text-right py-1.5 font-semibold">Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100">
                <td class="py-1.5">Recambio de térmica 25A</td>
                <td class="py-1.5 text-right text-slate-500">1 und</td>
                <td class="py-1.5 text-right font-medium">$ 9.800</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="py-1.5">Cable unipolar 2,5 mm²</td>
                <td class="py-1.5 text-right text-slate-500">18 m</td>
                <td class="py-1.5 text-right font-medium">$ 21.600</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="py-1.5">Canalización PVC 20 mm</td>
                <td class="py-1.5 text-right text-slate-500">6 m</td>
                <td class="py-1.5 text-right font-medium">$ 7.200</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="py-1.5">Mano de obra</td>
                <td class="py-1.5 text-right text-slate-500">3 h</td>
                <td class="py-1.5 text-right font-medium">$ 45.000</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-slate-300">
                <td class="pt-2 font-bold" colspan="2">Total</td>
                <td class="pt-2 text-right font-bold">$ 83.600</td>
              </tr>
            </tfoot>
          </table>

          <div class="mt-3 flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <span class="text-[11px] text-slate-600">Precios del material verificados hoy en la web</span>
            <span class="text-[11px] font-semibold text-emerald-700">PDF listo para enviar</span>
          </div>
        </div>
      `,
    },
  };

  const current = scenarios[scenarioKey] || scenarios.emergency;
  const titleEl = document.getElementById("demo-scenario-title");
  const descEl = document.getElementById("demo-scenario-desc");
  const chatEl = document.getElementById("demo-chat-messages");

  if (titleEl) titleEl.textContent = current.title;
  if (descEl) descEl.textContent = current.explanation;

  const subtitleEl = document.getElementById("demo-scenario-subtitle");
  if (subtitleEl) {
    subtitleEl.textContent =
      current.type === "document"
        ? "Programa de escritorio"
        : "Respuesta automática 24/7";
  }

  if (chatEl) {
    if (current.type === "document") {
      chatEl.innerHTML = current.documentHtml;

      // Progressive reveal: the document sections appear one after another
      const doc = chatEl.firstElementChild || null;
      const stages = doc && doc.children ? Array.from(doc.children) : [];
      stages.forEach((stage) => {
        stage.style.opacity = "0";
        stage.style.transition = "opacity 0.3s ease";
      });
      const perStageMs = 400;
      stages.forEach((stage, i) => {
        scheduleDemoStep(() => {
          stage.style.opacity = "1";
          chatEl.scrollTop = chatEl.scrollHeight;
        }, 150 + i * perStageMs);
      });
      startChipProgress(
        scenarioKey,
        150 + stages.length * perStageMs + 300
      );
      return;
    }

    // Progressive reveal: all bubbles are rendered hidden, then shown one by one
    chatEl.innerHTML = current.messages
      .map(
        (m) => `
        <div class="flex ${
          m.from === "user" ? "justify-end" : "justify-start"
        } demo-msg opacity-0 transition-opacity duration-300">
          <div class="max-w-[85%] px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 ${
            m.from === "user" ? "wa-bubble-user" : "wa-bubble-bot"
          }">
            <p class="whitespace-pre-line leading-relaxed">${m.text}</p>
            <span class="block text-[10px] text-slate-400 text-right mt-1">${
              m.time
            }</span>
          </div>
        </div>
      `
      )
      .join("");

    const bubbles =
      chatEl.querySelectorAll && chatEl.querySelectorAll(".demo-msg");
    const perMsgMs = 450;

    current.messages.forEach((m, i) => {
      scheduleDemoStep(() => {
        const bubble = bubbles ? bubbles[i] : null;
        if (bubble) bubble.classList.remove("opacity-0");
        chatEl.scrollTop = chatEl.scrollHeight;
      }, 200 + i * perMsgMs);
    });

    startChipProgress(
      scenarioKey,
      200 + (current.messages.length - 1) * perMsgMs + 400
    );
  }
}

/**
 * Generates a clean markdown summary of the proposal for sharing
 * @returns {string}
 */
function buildProposalSummaryText() {
  const selectedMods = PROPOSAL_CONFIG.developmentModules.filter((m) =>
    state.selectedModules.has(m.id)
  );
  const selectedExts = PROPOSAL_CONFIG.extraModules.filter((e) =>
    state.selectedExtras.has(e.id)
  );
  const domainObj = PROPOSAL_CONFIG.domainOptions.find(
    (d) => d.id === state.selectedDomainId
  );
  const mgmtObj = PROPOSAL_CONFIG.managementOptions.find(
    (m) => m.id === state.selectedManagementId
  );
  const socialObj = PROPOSAL_CONFIG.socialOptions.find(
    (s) => s.id === state.selectedSocialId
  );

  const modulesCostARS = selectedMods.reduce((sum, m) => sum + m.costARS, 0);
  const extrasCostARS = selectedExts.reduce((sum, e) => sum + e.costARS, 0);
  const domainSetupARS = domainObj ? domainObj.setupCostARS : 0;
  const totalOneTimeARS = modulesCostARS + extrasCostARS + domainSetupARS;
  const totalMonthlyARS =
    (mgmtObj ? mgmtObj.monthlyARS : 0) +
    (socialObj ? socialObj.monthlyARS : 0);

  const modLines = [
    ...selectedMods.map((m) => `- ${m.title}`),
    ...selectedExts.map((e) => `- Extra: ${e.title}`),
  ];

  return [
    `Hola, estuve revisando la propuesta de desarrollo digital y seleccioné esta configuración:`,
    ``,
    `1. Desarrollo Inicial:`,
    modLines.length > 0 ? modLines.join("\n") : "- Sin módulos seleccionados",
    ``,
    `2. Dirección Web (Dominio):`,
    `- ${domainObj ? domainObj.title : "No definido"}`,
    ``,
    `3. Modalidad de Mantenimiento y Redes:`,
    `- Mantenimiento técnico: ${mgmtObj ? mgmtObj.title : "-"}`,
    `- Redes sociales: ${
      state.selectedSocialId === "social-active"
        ? `${socialObj ? socialObj.title : "-"} (demostrativo, sin costo)`
        : socialObj
        ? socialObj.title
        : "-"
    }`,
    ``,
    `Inversión Inicial Estimada: ${formatARS(totalOneTimeARS)} ARS`,
    `Abono Mensual: ${
      totalMonthlyARS === 0
        ? "$ 0 (Autogestión)"
        : `${formatARS(totalMonthlyARS)} ARS/mes`
    }`,
    ``,
    `¿Cuándo podemos coordinar para comenzar?`,
  ].join("\n");
}

/**
 * Handles sending selection to WhatsApp or copying to clipboard
 */
function handleSendProposalSelection() {
  const summaryText = buildProposalSummaryText();
  const phone = PROPOSAL_CONFIG.meta.freelancerWhatsApp.replace(/\D/g, "");

  if (phone) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(summaryText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    navigator.clipboard.writeText(summaryText).then(() => {
      const toast = document.getElementById("copy-toast");
      if (toast) {
        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 4000);
      }
    });
  }
}

/**
 * Renders all sections
 */
function renderAll() {
  renderDevelopmentModules();
  renderExtraModules();
  renderDomainOptions();
  renderManagementOptions();
  renderSocialOptions();
  renderSummary();
}

// Initialization on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  renderFutureRoadmap();
  switchDemoScenario("emergency");

  // Footer values wired from meta config
  const dateEl = document.getElementById("footer-date");
  if (dateEl) dateEl.textContent = PROPOSAL_CONFIG.meta.proposalDate;

  const validityEl = document.getElementById("footer-validity");
  if (validityEl)
    validityEl.textContent = `Validez de la propuesta: ${PROPOSAL_CONFIG.meta.validityDays} días corridos`;
});
