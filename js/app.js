/**
 * Main Application Logic for the Electrician Proposal
 * Clean, emoji-free, first-person singular perspective, with selection micro-animations.
 */

// Application state initialized from PROPOSAL_CONFIG
const state = {
  activePresetId: "preset-basic",
  selectedModules: new Set(
    PROPOSAL_CONFIG.developmentModules
      .filter((m) => m.defaultSelected)
      .map((m) => m.id)
  ),
  selectedDomainId:
    PROPOSAL_CONFIG.domainOptions.find((d) => d.defaultSelected)?.id ||
    "domain-com-ar",
  selectedManagementId:
    PROPOSAL_CONFIG.managementOptions.find((m) => m.defaultSelected)?.id ||
    "mgmt-self",
  selectedSocialMonthlyId:
    PROPOSAL_CONFIG.socialMonthlyOptions.find((s) => s.defaultSelected)?.id ||
    "social-none",
  activeDemoScenario: "emergency",
};

/**
 * Formats a numeric value as Argentine Pesos (e.g., "$ 315.000 ARS")
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
 * Calculates the ARS development price for a given number of hours
 * @param {number} hours
 * @returns {number}
 */
function calculateHoursCostARS(hours) {
  return hours * PROPOSAL_CONFIG.pricing.hourlyRateARS;
}

/**
 * Returns a clean SVG icon (Lucide style) by name
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
    calculator: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/></svg>`,
    "file-text": `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    calendar: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    star: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    bell: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    check: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    "map-pin": `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    "shield-check": `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
    wrench: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    clock: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    send: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    printer: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
    copy: `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    "arrow-right": `<svg class="${customClass}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
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
    document.getElementById("summary-total-hours"),
  ];

  elements.forEach((el) => {
    if (!el) return;
    el.classList.remove("value-updated");
    void el.offsetWidth; // Trigger reflow
    el.classList.add("value-updated");
  });
}

/**
 * Applies a preset configuration when the user clicks a preset card
 * @param {string} presetId
 */
function applyPreset(presetId) {
  const preset = PROPOSAL_CONFIG.presets.find((p) => p.id === presetId);
  if (!preset) return;

  state.activePresetId = presetId;
  state.selectedModules = new Set(preset.modules);
  state.selectedDomainId = preset.domain;
  state.selectedManagementId = preset.management;
  state.selectedSocialMonthlyId = preset.socialMonthly;

  renderAll();
  animateValueUpdates();
}

/**
 * Syncs the active preset button state
 */
function syncActivePresetState() {
  const matched = PROPOSAL_CONFIG.presets.find((p) => {
    const sameModules =
      p.modules.length === state.selectedModules.size &&
      p.modules.every((m) => state.selectedModules.has(m));
    return (
      sameModules &&
      p.domain === state.selectedDomainId &&
      p.management === state.selectedManagementId &&
      p.socialMonthly === state.selectedSocialMonthlyId
    );
  });
  state.activePresetId = matched ? matched.id : null;
}

/**
 * Toggles a development module
 * @param {string} moduleId
 */
function toggleModule(moduleId) {
  if (state.selectedModules.has(moduleId)) {
    state.selectedModules.delete(moduleId);
  } else {
    state.selectedModules.add(moduleId);
  }
  syncActivePresetState();
  renderAll();
  animateValueUpdates();
}

/**
 * Selects a domain option
 * @param {string} domainId
 */
function selectDomain(domainId) {
  state.selectedDomainId = domainId;
  syncActivePresetState();
  renderAll();
  animateValueUpdates();
}

/**
 * Selects a technical management option
 * @param {string} mgmtId
 */
function selectManagement(mgmtId) {
  state.selectedManagementId = mgmtId;
  syncActivePresetState();
  renderAll();
  animateValueUpdates();
}

/**
 * Selects a monthly social media option
 * @param {string} socialId
 */
function selectSocialMonthly(socialId) {
  state.selectedSocialMonthlyId = socialId;
  syncActivePresetState();
  renderAll();
  animateValueUpdates();
}

/**
 * Renders the Presets
 */
function renderPresets() {
  const container = document.getElementById("presets-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.presets
    .map((preset) => {
      const isActive = state.activePresetId === preset.id;
      const moduleHours = preset.modules.reduce((acc, modId) => {
        const mod = PROPOSAL_CONFIG.developmentModules.find((m) => m.id === modId);
        return acc + (mod ? mod.hours : 0);
      }, 0);
      const rawModulesCost = calculateHoursCostARS(moduleHours);
      const domainObj = PROPOSAL_CONFIG.domainOptions.find(
        (d) => d.id === preset.domain
      );
      const domainSetupCost = domainObj
        ? calculateHoursCostARS(domainObj.setupHours)
        : 0;
      const totalInitial = rawModulesCost + domainSetupCost;

      return `
        <button
          type="button"
          onclick="applyPreset('${preset.id}')"
          class="preset-btn text-left p-5 rounded-2xl border transition-all flex flex-col justify-between ${
            isActive
              ? "is-active border-amber-600 bg-slate-900 text-white"
              : "border-slate-200 bg-white hover:border-slate-400 text-slate-900"
          }"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isActive
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-slate-100 text-slate-700"
              }">
                ${preset.badge}
              </span>
              <span class="text-xs ${
                isActive ? "text-amber-400 font-medium" : "text-slate-400"
              }">
                ${isActive ? "Seleccionado" : "Click para aplicar"}
              </span>
            </div>
            <h3 class="text-base font-bold mb-1.5">${preset.name}</h3>
            <p class="text-xs sm:text-sm leading-relaxed ${
              isActive ? "text-slate-300" : "text-slate-600"
            }">
              ${preset.description}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t ${
            isActive ? "border-slate-800" : "border-slate-100"
          } flex items-baseline justify-between">
            <span class="text-xs ${
              isActive ? "text-slate-400" : "text-slate-500"
            }">Inversión inicial:</span>
            <span class="text-base font-bold ${
              isActive ? "text-amber-400" : "text-slate-900"
            }">${formatARS(totalInitial)} <span class="font-normal text-xs text-slate-400">ARS</span></span>
          </div>
        </button>
      `;
    })
    .join("");
}

/**
 * Renders Development Modules
 */
function renderDevelopmentModules() {
  const container = document.getElementById("modules-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.developmentModules
    .map((mod) => {
      const isSelected = state.selectedModules.has(mod.id);
      const costARS = calculateHoursCostARS(mod.hours);

      return `
        <div
          onclick="toggleModule('${mod.id}')"
          class="selectable-card cursor-pointer rounded-2xl border p-6 bg-white ${
            isSelected ? "is-selected" : "border-slate-200"
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
                  costARS
                )}</span>
                <span class="text-xs text-slate-500 block">Pago único (${
                  mod.hours
                } hs estimadas)</span>
              </div>
              <div class="mt-2">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  isSelected
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-100 text-slate-700"
                }">
                  ${isSelected ? "Incluido en propuesta" : "Agregar módulo"}
                </span>
              </div>
            </div>
          </div>

          <p class="text-sm text-slate-700 mb-4 leading-relaxed">
            ${mod.summary}
          </p>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
            <div class="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2.5">
              <span>ALCANCE DEL DESARROLLO</span>
              <span>Entrega estimada: ${mod.deliveryTime}</span>
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
 * Renders Domain Options
 */
function renderDomainOptions() {
  const container = document.getElementById("domains-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.domainOptions
    .map((dom) => {
      const isSelected = state.selectedDomainId === dom.id;
      const setupCostARS = calculateHoursCostARS(dom.setupHours);

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
                setupCostARS === 0 ? "Sin cargo ($ 0)" : formatARS(setupCostARS)
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
      const showBotNotice = hasBotSelected && mgmt.id === "mgmt-self";

      return `
        <div
          onclick="selectManagement('${mgmt.id}')"
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

          <div class="pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
            <span class="text-xs text-slate-500">Abono mensual:</span>
            <span class="text-base font-bold text-slate-900">
              ${
                mgmt.monthlyARS === 0
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
 * Renders Social Media Monthly Retainers
 */
function renderSocialMonthlyOptions() {
  const container = document.getElementById("social-monthly-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.socialMonthlyOptions
    .map((soc) => {
      const isSelected = state.selectedSocialMonthlyId === soc.id;

      return `
        <div
          onclick="selectSocialMonthly('${soc.id}')"
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
                ${soc.badge}
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

            <h4 class="text-base font-bold text-slate-900 mb-2">${soc.title}</h4>
            <p class="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              ${soc.description}
            </p>

            <ul class="space-y-1.5 mb-4">
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

          <div class="pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
            <span class="text-xs text-slate-500">Inversión mensual:</span>
            <span class="text-base font-bold text-slate-900">
              ${
                soc.monthlyARS === 0
                  ? "$ 0 / mes"
                  : `${formatARS(soc.monthlyARS)} <span class="text-xs font-normal text-slate-500">/ mes</span>`
              }
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders the Live Budget Summary Panel
 */
function renderSummary() {
  const selectedMods = PROPOSAL_CONFIG.developmentModules.filter((m) =>
    state.selectedModules.has(m.id)
  );
  const domainObj = PROPOSAL_CONFIG.domainOptions.find(
    (d) => d.id === state.selectedDomainId
  );
  const mgmtObj = PROPOSAL_CONFIG.managementOptions.find(
    (m) => m.id === state.selectedManagementId
  );
  const socialObj = PROPOSAL_CONFIG.socialMonthlyOptions.find(
    (s) => s.id === state.selectedSocialMonthlyId
  );

  const devHours = selectedMods.reduce((sum, m) => sum + m.hours, 0);
  const rawDevCostARS = calculateHoursCostARS(devHours);

  const domainHours = domainObj ? domainObj.setupHours : 0;
  const domainSetupARS = calculateHoursCostARS(domainHours);

  const totalHours = devHours + domainHours;
  const totalOneTimeARS = rawDevCostARS + domainSetupARS;
  const totalAnnualDomainARS = domainObj ? domainObj.annualLicenseARS : 0;
  const totalMonthlyARS =
    (mgmtObj ? mgmtObj.monthlyARS : 0) + (socialObj ? socialObj.monthlyARS : 0);

  const itemsListEl = document.getElementById("summary-items-list");
  if (itemsListEl) {
    const itemsHTML = [];

    if (selectedMods.length === 0) {
      itemsHTML.push(`
        <div class="text-xs text-slate-400 bg-slate-900 rounded-lg p-3 border border-slate-800">
          Seleccioná al menos un módulo de desarrollo para visualizar el presupuesto.
        </div>
      `);
    } else {
      selectedMods.forEach((m) => {
        itemsHTML.push(`
          <div class="flex justify-between items-start text-sm gap-2">
            <div>
              <span class="text-white font-medium">${m.title}</span>
              <span class="block text-xs text-slate-400">${m.hours} hs estimadas</span>
            </div>
            <span class="font-semibold text-slate-200 shrink-0">${formatARS(
              calculateHoursCostARS(m.hours)
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
            <span class="block text-xs text-slate-400">Configuración (${domainObj.setupHours} hs)</span>
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

  setElText("summary-total-hours", `${totalHours} horas estimadas`);
  setElText("summary-onetime-total", `${formatARS(totalOneTimeARS)} ARS`);
  setElText(
    "summary-deposit",
    `${formatARS(totalOneTimeARS * 0.5)} ARS (50% de anticipo)`
  );
  setElText(
    "summary-annual-domain",
    totalAnnualDomainARS === 0
      ? "$ 0"
      : `${formatARS(totalAnnualDomainARS)} ARS / año`
  );
  setElText(
    "summary-monthly-total",
    totalMonthlyARS === 0
      ? "$ 0 / mes"
      : `${formatARS(totalMonthlyARS)} ARS / mes`
  );

  const monthlyDescEl = document.getElementById("summary-monthly-breakdown");
  if (monthlyDescEl) {
    const parts = [];
    if (mgmtObj && mgmtObj.monthlyARS > 0) parts.push(mgmtObj.title);
    if (socialObj && socialObj.monthlyARS > 0) parts.push(socialObj.title);
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
 * Switches the Demo Scenario in the Simulator (No Emojis)
 * @param {string} scenarioKey
 */
function switchDemoScenario(scenarioKey) {
  state.activeDemoScenario = scenarioKey;

  document.querySelectorAll(".demo-tab-btn").forEach((btn) => {
    const isCurrent = btn.getAttribute("data-scenario") === scenarioKey;
    btn.className = `demo-tab-btn text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
      isCurrent
        ? "bg-slate-900 text-white border-amber-600 shadow-sm"
        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
    }`;
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
          text: "Caballito, Av. Rivadavia al 5200. Te adjunto foto del tablero.",
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
          text: "Es en Ramos Mejía. Los tomas van sobre pared de ladrillo. Ya te envío la foto.",
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
        "Con el kit inicial, enviás una foto del trabajo terminado con un breve audio descriptivo y el sistema te devuelve el texto técnico redactado de forma profesional.",
      messages: [
        {
          from: "user",
          text: "[Fotografía de tablero nuevo] + Audio: 'Recambio completo de tablero general en local de Flores, se reemplazaron térmicas viejas y se colocó protector de tensión'",
          time: "17:45",
        },
        {
          from: "bot",
          text: "Texto preparado para publicación:\n\nRenovación de Tablero General en Local Comercial\n\nTrabajo realizado hoy:\n• Reemplazo de protecciones termomagnéticas bajo norma IRAM.\n• Instalación de protector automático de sobretensión y subtensión.\n• Rotulado técnico y ordenamiento de circuitos.\n\nPor consultas de instalaciones o mantenimiento técnico, escribime directamente por WhatsApp.",
          time: "17:45",
        },
      ],
    },
  };

  const current = scenarios[scenarioKey] || scenarios.emergency;
  const titleEl = document.getElementById("demo-scenario-title");
  const descEl = document.getElementById("demo-scenario-desc");
  const chatEl = document.getElementById("demo-chat-messages");

  if (titleEl) titleEl.textContent = current.title;
  if (descEl) descEl.textContent = current.explanation;

  if (chatEl) {
    chatEl.innerHTML = current.messages
      .map(
        (m) => `
        <div class="flex ${
          m.from === "user" ? "justify-end" : "justify-start"
        } animate-fade-in">
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
  const domainObj = PROPOSAL_CONFIG.domainOptions.find(
    (d) => d.id === state.selectedDomainId
  );
  const mgmtObj = PROPOSAL_CONFIG.managementOptions.find(
    (m) => m.id === state.selectedManagementId
  );
  const socialObj = PROPOSAL_CONFIG.socialMonthlyOptions.find(
    (s) => s.id === state.selectedSocialMonthlyId
  );

  const devHours = selectedMods.reduce((sum, m) => sum + m.hours, 0);
  const rawDevCostARS = calculateHoursCostARS(devHours);
  const domainSetupARS = domainObj
    ? calculateHoursCostARS(domainObj.setupHours)
    : 0;
  const totalOneTimeARS = rawDevCostARS + domainSetupARS;
  const totalMonthlyARS =
    (mgmtObj ? mgmtObj.monthlyARS : 0) + (socialObj ? socialObj.monthlyARS : 0);

  const modLines =
    selectedMods.length > 0
      ? selectedMods.map((m) => `- ${m.title}`).join("\n")
      : "- Sin módulos seleccionados";

  return [
    `Hola, estuve revisando la propuesta de desarrollo digital y seleccioné esta configuración:`,
    ``,
    `1. Desarrollo Inicial:`,
    modLines,
    ``,
    `2. Dirección Web (Dominio):`,
    `- ${domainObj ? domainObj.title : "No definido"}`,
    ``,
    `3. Modalidad de Mantenimiento y Redes:`,
    `- Mantenimiento técnico: ${mgmtObj ? mgmtObj.title : "-"}`,
    `- Redes sociales: ${socialObj ? socialObj.title : "-"}`,
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
  renderPresets();
  renderDevelopmentModules();
  renderDomainOptions();
  renderManagementOptions();
  renderSocialMonthlyOptions();
  renderSummary();
}

// Initialization on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  renderFutureRoadmap();
  switchDemoScenario("emergency");
});
