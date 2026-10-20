/**
 * Main Application Logic for the Electrician Interactive Proposal
 * Renders UI sections from PROPOSAL_CONFIG and manages live budget calculations in ARS.
 */

// Application state initialized from PROPOSAL_CONFIG defaults
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
 * Formats a numeric value as Argentine Pesos (e.g., "$ 315.000")
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
 * Returns an SVG icon string by name
 * @param {string} name
 * @returns {string}
 */
function getIconSVG(name) {
  const icons = {
    globe: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    "message-circle": `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    instagram: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    calculator: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/></svg>`,
    "file-text": `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    calendar: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    star: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    bell: `<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    check: `<svg class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
  };
  return icons[name] || icons.globe;
}

/**
 * Applies a preset configuration when the user clicks a quick preset card
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
}

/**
 * Checks if current selection matches any preset and updates state.activePresetId
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
 * Toggles a development module on/off
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
}

/**
 * Selects a domain option
 * @param {string} domainId
 */
function selectDomain(domainId) {
  state.selectedDomainId = domainId;
  syncActivePresetState();
  renderAll();
}

/**
 * Selects a technical management option
 * @param {string} mgmtId
 */
function selectManagement(mgmtId) {
  state.selectedManagementId = mgmtId;
  syncActivePresetState();
  renderAll();
}

/**
 * Selects a monthly social media retainer option
 * @param {string} socialId
 */
function selectSocialMonthly(socialId) {
  state.selectedSocialMonthlyId = socialId;
  syncActivePresetState();
  renderAll();
}

/**
 * Renders the Preset Selector buttons
 */
function renderPresets() {
  const container = document.getElementById("presets-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.presets
    .map((preset) => {
      const isActive = state.activePresetId === preset.id;
      // Calculate preset one-time total for preview
      const moduleHours = preset.modules.reduce((acc, modId) => {
        const mod = PROPOSAL_CONFIG.developmentModules.find((m) => m.id === modId);
        return acc + (mod ? mod.hours : 0);
      }, 0);
      const rawModulesCost = calculateHoursCostARS(moduleHours);
      const discount =
        preset.modules.length >= 2
          ? rawModulesCost * (PROPOSAL_CONFIG.pricing.bundleDiscountPercent / 100)
          : 0;
      const domainObj = PROPOSAL_CONFIG.domainOptions.find(
        (d) => d.id === preset.domain
      );
      const domainSetupCost = domainObj
        ? calculateHoursCostARS(domainObj.setupHours)
        : 0;
      const totalInitial = rawModulesCost - discount + domainSetupCost;

      return `
        <button
          type="button"
          onclick="applyPreset('${preset.id}')"
          class="preset-btn text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
            isActive
              ? "is-active border-amber-500 bg-slate-900 text-white"
              : "border-slate-200 bg-white hover:border-amber-400 text-slate-900"
          }"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isActive
                  ? "bg-amber-500 text-slate-950"
                  : "bg-amber-100 text-amber-800"
              }">
                ${preset.badge}
              </span>
              <span class="text-xs font-medium ${
                isActive ? "text-amber-300" : "text-slate-500"
              }">
                ${isActive ? "✓ Seleccionado" : "Click para cargar"}
              </span>
            </div>
            <h3 class="text-lg font-bold mb-1.5">${preset.name}</h3>
            <p class="text-sm leading-relaxed ${
              isActive ? "text-slate-300" : "text-slate-600"
            }">
              ${preset.description}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t ${
            isActive ? "border-slate-700" : "border-slate-100"
          } flex items-baseline justify-between">
            <span class="text-xs ${
              isActive ? "text-slate-400" : "text-slate-500"
            }">Inversión inicial est.:</span>
            <span class="text-lg font-extrabold ${
              isActive ? "text-amber-400" : "text-slate-900"
            }">${formatARS(totalInitial)} <small class="font-normal text-xs">ARS</small></span>
          </div>
        </button>
      `;
    })
    .join("");
}

/**
 * Renders Step 1: Development Modules
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
          class="selectable-card cursor-pointer rounded-2xl border-2 p-6 bg-white ${
            isSelected ? "is-selected" : "border-slate-200"
          }"
        >
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div class="flex items-start gap-3.5">
              <div class="p-3 rounded-xl ${
                isSelected
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-100 text-slate-700"
              } transition-colors">
                ${getIconSVG(mod.icon)}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h4 class="text-lg font-bold text-slate-900">${mod.title}</h4>
                  ${
                    mod.recommended
                      ? `<span class="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Recomendado</span>`
                      : ""
                  }
                </div>
                <p class="text-sm text-slate-600 mt-0.5">${mod.subtitle}</p>
              </div>
            </div>

            <div class="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
              <div class="text-right">
                <span class="text-2xl font-extrabold text-slate-900">${formatARS(
                  costARS
                )}</span>
                <span class="text-xs font-semibold text-slate-500 block">Pago único (${
                  mod.hours
                } hs de desarrollo)</span>
              </div>
              <div class="mt-2">
                <span class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
                  isSelected
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-100 text-slate-700"
                }">
                  ${isSelected ? "✓ Incluido en propuesta" : "+ Agregar módulo"}
                </span>
              </div>
            </div>
          </div>

          <p class="text-sm text-slate-700 mb-4 leading-relaxed">
            ${mod.summary}
          </p>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              ¿Qué incluye este desarrollo? (Entrega estimada: ${mod.deliveryTime})
            </p>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              ${mod.features
                .map(
                  (feat) => `
                <li class="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  ${getIconSVG("check")}
                  <span>${feat}</span>
                </li>
              `
                )
                .join("")}
            </ul>
            <p class="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-slate-500">
              💡 <strong>Detalle técnico:</strong> ${mod.techNote}
            </p>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders Step 2: Domain / URL Licensing Options
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
          class="selectable-card cursor-pointer rounded-2xl border-2 p-5 bg-white flex flex-col justify-between ${
            isSelected ? "is-selected" : "border-slate-200"
          }"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
                isSelected
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-100 text-slate-700"
              }">
                ${dom.badge}
              </span>
              <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${
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
                <div class="flex items-start gap-1.5 text-xs text-emerald-800">
                  <span class="font-bold text-emerald-600">✓</span>
                  <span>${pro}</span>
                </div>
              `
                )
                .join("")}
              ${dom.cons
                .map(
                  (con) => `
                <div class="flex items-start gap-1.5 text-xs text-slate-500">
                  <span class="font-bold text-amber-600">•</span>
                  <span>${con}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-200/80 space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-500">Configuración e instalación:</span>
              <span class="font-bold text-slate-900">${
                setupCostARS === 0 ? "Bonificado ($ 0)" : formatARS(setupCostARS)
              }</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Licencia anual (renovación 1 vez al año):</span>
              <span class="font-bold text-amber-700">${
                dom.annualLicenseARS === 0
                  ? "$ 0 / año"
                  : `~${formatARS(dom.annualLicenseARS)} / año`
              }</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders Step 3: Technical Management & Monthly Maintenance Options
 */
function renderManagementOptions() {
  const container = document.getElementById("management-container");
  if (!container) return;

  const hasBotSelected = state.selectedModules.has("whatsapp-bot");

  container.innerHTML = PROPOSAL_CONFIG.managementOptions
    .map((mgmt) => {
      const isSelected = state.selectedManagementId === mgmt.id;
      const showBotWarning =
        hasBotSelected && mgmt.id === "mgmt-self";

      return `
        <div
          onclick="selectManagement('${mgmt.id}')"
          class="selectable-card cursor-pointer rounded-2xl border-2 p-5 bg-white flex flex-col justify-between ${
            isSelected ? "is-selected" : "border-slate-200"
          }"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
                isSelected
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-100 text-slate-700"
              }">
                ${mgmt.badge}
              </span>
              <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${
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
                  <span class="font-bold text-amber-600">✓</span>
                  <span>${inc}</span>
                </li>
              `
                )
                .join("")}
            </ul>

            ${
              showBotWarning
                ? `<div class="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 mb-3">
                    ⚠️ <strong>Nota sobre el Bot:</strong> En modo autogestión se configura con herramientas gratuitas o en tu propia PC, pero si buscás que funcione 24/7 sin depender de tu equipo, recomendamos el plan con Servidor Bot.
                  </div>`
                : ""
            }
          </div>

          <div class="pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
            <span class="text-xs text-slate-500">Abono mensual:</span>
            <span class="text-lg font-extrabold text-slate-900">
              ${
                mgmt.monthlyARS === 0
                  ? "$ 0 / mes"
                  : `${formatARS(mgmt.monthlyARS)} <small class="text-xs font-normal text-slate-500">/ mes</small>`
              }
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders Step 4: Ongoing Social Media Management Plans
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
          class="selectable-card cursor-pointer rounded-2xl border-2 p-5 bg-white flex flex-col justify-between ${
            isSelected ? "is-selected" : "border-slate-200"
          }"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
                isSelected
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-100 text-slate-700"
              }">
                ${soc.badge}
              </span>
              <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center ${
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
                  <span class="font-bold text-amber-600">✓</span>
                  <span>${inc}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>

          <div class="pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
            <span class="text-xs text-slate-500">Inversión mensual:</span>
            <span class="text-lg font-extrabold text-slate-900">
              ${
                soc.monthlyARS === 0
                  ? "$ 0 / mes"
                  : `${formatARS(soc.monthlyARS)} <small class="text-xs font-normal text-slate-500">/ mes</small>`
              }
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders the Live Budget Summary Sticky Panel
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

  // Calculate one-time development hours & ARS cost
  const devHours = selectedMods.reduce((sum, m) => sum + m.hours, 0);
  const rawDevCostARS = calculateHoursCostARS(devHours);

  // Apply bundle discount if 2+ development modules are selected
  const hasBundleDiscount = selectedMods.length >= 2;
  const discountARS = hasBundleDiscount
    ? rawDevCostARS * (PROPOSAL_CONFIG.pricing.bundleDiscountPercent / 100)
    : 0;

  // Domain setup hours
  const domainHours = domainObj ? domainObj.setupHours : 0;
  const domainSetupARS = calculateHoursCostARS(domainHours);

  const totalHours = devHours + domainHours;
  const totalOneTimeARS = rawDevCostARS - discountARS + domainSetupARS;
  const totalAnnualDomainARS = domainObj ? domainObj.annualLicenseARS : 0;
  const totalMonthlyARS =
    (mgmtObj ? mgmtObj.monthlyARS : 0) + (socialObj ? socialObj.monthlyARS : 0);

  // Populate summary list
  const itemsListEl = document.getElementById("summary-items-list");
  if (itemsListEl) {
    const itemsHTML = [];

    if (selectedMods.length === 0) {
      itemsHTML.push(`
        <div class="text-xs text-amber-300 bg-amber-950/50 border border-amber-700/50 rounded-lg p-3">
          Seleccioná al menos un módulo de desarrollo en el Paso 1 para armar tu presupuesto.
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

    if (hasBundleDiscount) {
      itemsHTML.push(`
        <div class="flex justify-between items-center text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-800/40">
          <span>🎁 Descuento Pack (${PROPOSAL_CONFIG.pricing.bundleDiscountPercent}% por combinar módulos)</span>
          <span class="font-bold">- ${formatARS(discountARS)}</span>
        </div>
      `);
    }

    if (domainObj) {
      itemsHTML.push(`
        <div class="flex justify-between items-start text-sm gap-2 pt-2 border-t border-slate-800">
          <div>
            <span class="text-slate-300">${domainObj.title}</span>
            <span class="block text-xs text-slate-400">Configuración inicial (${
              domainObj.setupHours
            } hs)</span>
          </div>
          <span class="font-semibold text-slate-200 shrink-0">${
            domainSetupARS === 0 ? "$ 0" : formatARS(domainSetupARS)
          }</span>
        </div>
      `);
    }

    itemsListEl.innerHTML = itemsHTML.join("");
  }

  // Update totals in DOM
  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setElText("summary-total-hours", `${totalHours} horas de trabajo`);
  setElText("summary-onetime-total", `${formatARS(totalOneTimeARS)} ARS`);
  setElText(
    "summary-deposit",
    `${formatARS(totalOneTimeARS * 0.5)} ARS (50% al iniciar)`
  );
  setElText(
    "summary-annual-domain",
    totalAnnualDomainARS === 0
      ? "$ 0 (Gratis)"
      : `~${formatARS(totalAnnualDomainARS)} ARS / año`
  );
  setElText(
    "summary-monthly-total",
    totalMonthlyARS === 0
      ? "$ 0 / mes (Sin abono fijo)"
      : `${formatARS(totalMonthlyARS)} ARS / mes`
  );

  // Breakdown of monthly items
  const monthlyDescEl = document.getElementById("summary-monthly-breakdown");
  if (monthlyDescEl) {
    const parts = [];
    if (mgmtObj && mgmtObj.monthlyARS > 0) parts.push(mgmtObj.title);
    if (socialObj && socialObj.monthlyARS > 0) parts.push(socialObj.title);
    monthlyDescEl.textContent =
      parts.length > 0
        ? `Incluye: ${parts.join(" + ")}`
        : "Modalidad autogestionada sin costos fijos mensuales.";
  }
}

/**
 * Renders the Future Roadmap (Unpriced Phase 2 Ideas)
 */
function renderFutureRoadmap() {
  const container = document.getElementById("roadmap-container");
  if (!container) return;

  container.innerHTML = PROPOSAL_CONFIG.futureRoadmap
    .map(
      (item) => `
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            ${getIconSVG(item.icon)}
          </div>
          <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
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
 * Renders the Interactive WhatsApp Bot Simulator in the Demo section
 * @param {string} scenarioKey
 */
function switchDemoScenario(scenarioKey) {
  state.activeDemoScenario = scenarioKey;

  // Update tab buttons
  document.querySelectorAll(".demo-tab-btn").forEach((btn) => {
    const isCurrent = btn.getAttribute("data-scenario") === scenarioKey;
    btn.className = `demo-tab-btn text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
      isCurrent
        ? "bg-slate-900 text-white border-amber-500 shadow"
        : "bg-white text-slate-700 border-slate-200 hover:border-amber-400"
    }`;
  });

  const scenarios = {
    emergency: {
      title: "Caso 1: Cliente con una Urgencia Eléctrica",
      explanation:
        "Vos estás trabajando en una obra y no podés atender. El bot identifica que es una urgencia real en tu zona, pide foto del tablero y te avisa con prioridad.",
      messages: [
        {
          from: "user",
          text: "Hola! Saltó el disyuntor de mi casa y no vuelve a subir, estoy sin luz.",
          time: "14:22",
        },
        {
          from: "bot",
          text: "⚡ ¡Hola! Soy el asistente virtual de *Servicios Eléctricos*. En este momento el técnico se encuentra en una instalación.\n\nPor favor elegí una opción:\n*1.* 🚨 Es una URGENCIA ahora\n*2.* 📋 Quiero pedir un presupuesto\n*3.* 📍 Ver zonas y costos de visita",
          time: "14:22",
        },
        {
          from: "user",
          text: "1",
          time: "14:23",
        },
        {
          from: "bot",
          text: "🚨 Entendido. Para darte prioridad inmediata, decime:\n1️⃣ ¿En qué *barrio/calles* estás?\n2️⃣ Si podés, enviá una *foto de tu tablero eléctrico* así el técnico ya lleva el repuesto adecuado.",
          time: "14:23",
        },
        {
          from: "user",
          text: "Estoy en Caballito, Av. Rivadavia al 5200. Ahí te mando foto del tablero 📷",
          time: "14:24",
        },
        {
          from: "bot",
          text: "✅ *¡Listo!* Ya le envié una alerta de urgencia al electricista con tus datos y ubicación. En menos de 10 minutos se comunica con vos.",
          time: "14:24",
        },
      ],
    },
    quote: {
      title: "Caso 2: Solicitud de Presupuesto Programado",
      explanation:
        "Para trabajos que no son urgentes, el bot reúne toda la información técnica y la guarda en tu planilla para que presupuestos tranquilo al final del día.",
      messages: [
        {
          from: "user",
          text: "Hola buenas tardes, quería averiguar para colocar 4 tomas nuevos y revisar la térmica del aire.",
          time: "18:10",
        },
        {
          from: "bot",
          text: "⚡ ¡Hola! Gracias por comunicarte. Para que el técnico te arme un presupuesto aproximado hoy mismo, contame:\n\n📍 ¿En qué *barrio o localidad* es el trabajo?\n📸 ¿Tenés una *foto de la pared o del tablero* actual?",
          time: "18:10",
        },
        {
          from: "user",
          text: "Es en Ramos Mejía. Los tomas son sobre pared de ladrillo a la vista, te paso foto.",
          time: "18:12",
        },
        {
          from: "bot",
          text: "📋 ¡Excelente! Ya quedó registrada tu consulta en la agenda del día. Hoy a partir de las 19:30 hs el técnico revisa las fotos y te envía el presupuesto estimado por acá.",
          time: "18:12",
        },
      ],
    },
    social: {
      title: "Caso 3: De la Obra a Instagram en 30 Segundos",
      explanation:
        "Con el Kit de Redes, le mandás una foto del trabajo terminado a tu propio asistente y te redacta el posteo listo para subir.",
      messages: [
        {
          from: "user",
          text: "📷 [Foto de tablero nuevo prolijo] + 🎤 Audio: 'Recambio completo de tablero en local de Flores, pusimos llaves Schneider y protector de tensión'",
          time: "17:45",
        },
        {
          from: "bot",
          text: "✨ *¡Texto listo para tu Instagram!* Copiá y pegá:\n\n⚡ *Renovación de Tablero Eléctrico en Flores* 🛠️\nHoy dejamos 100% seguro este local comercial:\n✅ Recambio de térmicas y disyuntor Schneider.\n✅ Instalación de protector de alta y baja tensión para cuidar los equipos.\n✅ Peinado de cables y rotulado completo.\n\n📲 ¿Necesitás actualizar la instalación de tu casa o comercio? Escribinos por WhatsApp desde el link de nuestro perfil.",
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
            } ${m.from === "user" ? "✓✓" : ""}</span>
          </div>
        </div>
      `
      )
      .join("");
  }
}

/**
 * Generates a formatted Spanish summary of the selected configuration
 * for sharing via WhatsApp or copying to clipboard.
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
  const discountARS =
    selectedMods.length >= 2
      ? rawDevCostARS * (PROPOSAL_CONFIG.pricing.bundleDiscountPercent / 100)
      : 0;
  const domainSetupARS = domainObj
    ? calculateHoursCostARS(domainObj.setupHours)
    : 0;
  const totalOneTimeARS = rawDevCostARS - discountARS + domainSetupARS;
  const totalMonthlyARS =
    (mgmtObj ? mgmtObj.monthlyARS : 0) + (socialObj ? socialObj.monthlyARS : 0);

  const modLines =
    selectedMods.length > 0
      ? selectedMods.map((m) => `• ${m.title}`).join("\n")
      : "• Sin módulos seleccionados";

  return [
    `¡Hola! Estuve revisando la propuesta interactiva y me interesa esta configuración:`,
    ``,
    `*1. Desarrollo Inicial:*`,
    modLines,
    ``,
    `*2. Dominio Web (URL):*`,
    `• ${domainObj ? domainObj.title : "No especificado"}`,
    ``,
    `*3. Mantenimiento y Redes:*`,
    `• Soporte Técnico: ${mgmtObj ? mgmtObj.title : "-"}`,
    `• Gestión de Redes: ${socialObj ? socialObj.title : "-"}`,
    ``,
    `💰 *Inversión Inicial Estimada:* ${formatARS(totalOneTimeARS)} ARS`,
    `📅 *Abono Mensual:* ${
      totalMonthlyARS === 0
        ? "$ 0 (Autogestión)"
        : `${formatARS(totalMonthlyARS)} ARS/mes`
    }`,
    ``,
    `¿Coordinamos una breve llamada para avanzar?`,
  ].join("\n");
}

/**
 * Handles clicking "Enviar selección por WhatsApp" or copying summary
 */
function handleSendProposalSelection() {
  const summaryText = buildProposalSummaryText();
  const phone = PROPOSAL_CONFIG.meta.freelancerWhatsApp.replace(/\D/g, "");

  if (phone) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(summaryText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    // Copy to clipboard and show feedback modal/toast
    navigator.clipboard.writeText(summaryText).then(() => {
      const toast = document.getElementById("copy-toast");
      if (toast) {
        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 4500);
      }
    });
  }
}

/**
 * Renders all interactive sections
 */
function renderAll() {
  renderPresets();
  renderDevelopmentModules();
  renderDomainOptions();
  renderManagementOptions();
  renderSocialMonthlyOptions();
  renderSummary();
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  renderFutureRoadmap();
  switchDemoScenario("emergency");
});
