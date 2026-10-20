/**
 * Central Configuration for the Electrician Freelance Proposal
 * All code and documentation are in English.
 * All client-facing text strings are in Spanish (Argentina).
 */

const PROPOSAL_CONFIG = {
  // General metadata & customization placeholders
  meta: {
    clientBusinessName: "Servicios Eléctricos",
    clientLocation: "Argentina",
    proposalDate: "Octubre 2026",
    validityDays: 15,
    freelancerName: "Marcos Dima",
    // Leave empty or add your WhatsApp number (e.g., "5491112345678") for the CTA button
    freelancerWhatsApp: "",
  },

  // Base pricing parameters (Internal reference: $15 USD/hr @ $1,500 ARS/USD = $22,500 ARS/hr)
  // Note: Only ARS values are displayed to the client in the UI.
  pricing: {
    hourlyRateUSD: 15,
    exchangeRateARS: 1500,
    get hourlyRateARS() {
      return this.hourlyRateUSD * this.exchangeRateARS; // $22,500 ARS/hr
    },
    bundleDiscountPercent: 10, // Applied when selecting 2 or more development modules
  },

  // Quick preset combinations for the client to test with 1 click
  presets: [
    {
      id: "preset-basic",
      name: "Opción 1: Presencia Web Esencial",
      badge: "Ideal para empezar",
      description: "Página web estática rápida + perfil en Google Maps + dominio .com.ar propio y sin costos fijos mensuales.",
      modules: ["web-static"],
      domain: "domain-com-ar",
      management: "mgmt-self",
      socialMonthly: "social-none",
    },
    {
      id: "preset-recommended",
      name: "Opción 2: Web + Bot de WhatsApp",
      badge: "Más elegido",
      description: "Tu página web trabajando en equipo con un asistente automático de WhatsApp que filtra urgencias y pide fotos del problema mientras estás trabajando.",
      modules: ["web-static", "whatsapp-bot"],
      domain: "domain-com-ar",
      management: "mgmt-bot-cloud",
      socialMonthly: "social-none",
    },
    {
      id: "preset-full",
      name: "Opción 3: Crecimiento Digital + Redes",
      badge: "Todo incluido",
      description: "Web profesional + Bot de WhatsApp 24/7 + Kit de plantillas y automatización para publicar trabajos en Instagram sin perder tiempo.",
      modules: ["web-static", "whatsapp-bot", "social-setup"],
      domain: "domain-com-ar",
      management: "mgmt-bot-cloud",
      socialMonthly: "social-basic",
    },
  ],

  // One-time development modules (calculated dynamically from hours * hourlyRateARS)
  developmentModules: [
    {
      id: "web-static",
      title: "Página Web Estática + Google Maps",
      subtitle: "Tu vidriera profesional online las 24 hs",
      icon: "globe",
      hours: 14, // 14h * $22,500 = $315,000 ARS
      deliveryTime: "5 a 7 días hábiles",
      recommended: true,
      defaultSelected: true,
      summary:
        "Una página web rápida, moderna y adaptada a celulares para que los clientes de tu zona te encuentren en Google, vean tus trabajos reales y te contacten con un toque.",
      features: [
        "Diseño adaptable a celulares y computadoras (Mobile-First).",
        "Botones directos a WhatsApp diferenciados: 'Urgencia 24hs' vs 'Pedir Presupuesto'.",
        "Catálogo claro de servicios (Urgencias, Instalaciones, Tableros, Certificaciones/Mediciones).",
        "Galería de fotos 'Antes y Después' de trabajos realizados y sellos de confianza (Matrícula/Garantía).",
        "Mapa de zonas de cobertura y sección de preguntas frecuentes.",
        "Alta y optimización de Google Business Profile (para aparecer en Google Maps cuando busquen 'electricista cerca').",
      ],
      techNote: "Alojada en servidores globales gratuitos (GitHub Pages / Cloudflare). No paga alquiler de hosting web.",
    },
    {
      id: "whatsapp-bot",
      title: "Asistente Automático de WhatsApp (Bot 24/7)",
      subtitle: "Atendé consultas y filtrá urgencias mientras estás en obra",
      icon: "message-circle",
      hours: 16, // 16h * $22,500 = $360,000 ARS
      deliveryTime: "7 a 10 días hábiles",
      recommended: true,
      defaultSelected: false,
      summary:
        "Cuando estás arriba de una escalera o revisando un tablero no podés responder mensajes. El bot responde al instante, clasifica al cliente y te deja todo listo para presupuestar.",
      features: [
        "Menú interactivo automático: 1) Urgencia Eléctrica, 2) Solicitar Presupuesto, 3) Zonas y Horarios.",
        "Recolección inteligente de datos: pide barrio/ubicación, descripción de la falla y foto o video del tablero/enchufe.",
        "Filtro de Urgencias: si el cliente indica una emergencia en tu zona, te envía una alerta prioritaria o habilita llamada directa.",
        "Registro automático en planilla (Google Sheets): guarda nombre, teléfono, barrio, problema y fecha para que ningún cliente quede sin respuesta.",
        "Respuestas automáticas a consultas repetitivas (costo de visita técnica, medios de pago, zonas de trabajo).",
      ],
      techNote: "Se puede configurar con flujo guiado en la nube o conectado a tu número comercial.",
    },
    {
      id: "social-setup",
      title: "Kit Inicial de Redes + Automatización 'Foto a Post'",
      subtitle: "Identidad visual profesional y publicaciones sin esfuerzo",
      icon: "instagram",
      hours: 10, // 10h * $22,500 = $225,000 ARS
      deliveryTime: "5 a 7 días hábiles",
      recommended: false,
      defaultSelected: false,
      summary:
        "Ideal si querés mover Instagram y Facebook mostrando tus trabajos pero no tenés tiempo de diseñar ni redactar textos después de trabajar.",
      features: [
        "Optimización completa de biografía de Instagram y Facebook (botones de contacto, historias destacadas de 'Urgencias', 'Trabajos', 'Reseñas').",
        "Pack de 6 plantillas editables con tu marca (Antes/Después, Consejos de Seguridad Eléctrica, Testimonios).",
        "Automatización 'De la Obra a Instagram': enviás una foto del trabajo terminado + un audio corto por WhatsApp/Telegram contando qué hiciste, y el sistema te devuelve el texto redactado listo para publicar.",
        "Guía rápida de contenido: qué sacarle foto en cada trabajo para generar confianza y atraer mejores clientes.",
      ],
      techNote: "Pago único de configuración inicial. Podés manejarlo vos mismo o sumarle un plan de gestión mensual.",
    },
  ],

  // Domain / URL Licensing Options (Fixed ARS reference values)
  domainOptions: [
    {
      id: "domain-free",
      title: "Subdominio Gratuito (.github.io / .vercel.app)",
      badge: "Costo $0",
      setupHours: 0,
      annualLicenseARS: 0,
      description:
        "Tu página tendrá una dirección del estilo 'tunombre-electricista.github.io'. Es 100% gratuito de por vida y sirve perfecto para compartir en tu perfil de Instagram, estados de WhatsApp o código QR en tarjetas.",
      pros: ["Sin costo anual de renovación", "Activación inmediata", "Certificado de seguridad SSL (candadito) incluido"],
      cons: ["Dirección menos fácil de recordar de memoria", "Menor posicionamiento en buscadores frente a un .com.ar"],
    },
    {
      id: "domain-com-ar",
      title: "Dominio Propio Nacional (.com.ar - NIC Argentina)",
      badge: "Recomendado en Argentina",
      setupHours: 2, // 2h setup & DNS + NIC.ar Trámites a Distancia guidance = $45,000 ARS one-time setup
      annualLicenseARS: 8500, // Official NIC.ar annual fee reference (~$8.500 ARS/year)
      defaultSelected: true,
      description:
        "Tu propia dirección oficial en Argentina (ej: ' www.electricistaperez.com.ar '). Se registra en NIC Argentina (a través de ARCA/AFIP y Trámites a Distancia) a tu nombre para que seas el único dueño.",
      pros: [
        "Transmite máxima seriedad y confianza local",
        "Licencia anual oficial muy económica en pesos (se abona 1 vez al año a NIC.ar)",
        "Incluye configuración completa de DNS y redirección segura",
      ],
      cons: ["Requiere clave fiscal nivel 2 o superior para titularidad propia (te guiamos paso a paso o lo gestionamos por vos)"],
    },
    {
      id: "domain-com",
      title: "Dominio Internacional (.com)",
      badge: "Alternativa rápida",
      setupHours: 1.5, // 1.5h setup = $33,750 ARS one-time setup
      annualLicenseARS: 22000, // ~ $14-15 USD/year in ARS
      description:
        "Dirección internacional (ej: ' www.electricistaperez.com '). No requiere trámites en AFIP/NIC.ar y queda activo en 15 minutos, aunque su renovación anual es más cara que el .com.ar.",
      pros: ["Activación en minutos sin trámites en ARCA/AFIP", "Reconocimiento global"],
      cons: ["Renovación anual atada a proveedores internacionales (~$22.000 ARS/año)"],
    },
  ],

  // Technical Management & Infrastructure Options (How the site & bot are maintained)
  managementOptions: [
    {
      id: "mgmt-self",
      title: "Autogestión (Sin Abono Mensual)",
      badge: "$0 / mes",
      monthlyARS: 0,
      defaultSelected: true,
      forBotCompatible: false,
      description:
        "Entregamos la página web terminada y funcionando en servidores gratuitos. Si necesitás cambiar un teléfono, agregar fotos nuevas o modificar textos más adelante, nos pedís el cambio puntual por hora o lo editás con una guía simple.",
      includes: [
        "Hosting web estático 100% gratuito",
        "Manual breve de uso y entrega de accesos",
        "Cambios futuros a demanda (solo pagás cuando necesitás actualizar algo)",
      ],
    },
    {
      id: "mgmt-web-care",
      title: "Mantenimiento Web & Soporte Activo",
      badge: "Tranquilidad total",
      monthlyARS: 35000, // ~1.5h/month equivalent
      forBotCompatible: false,
      description:
        "Nos ocupamos de mantener tu web siempre actualizada: nos mandás por WhatsApp fotos de tus últimos trabajos cada mes y nosotros las subimos a la galería, actualizamos precios o zonas y cuidamos tu ficha de Google Maps.",
      includes: [
        "Hasta 2 actualizaciones mensuales de contenido (fotos de obras, precios, textos)",
        "Gestión de vencimiento de dominio (.com.ar / .com)",
        "Actualización de fotos en tu perfil de Google Maps",
        "Soporte prioritario por WhatsApp",
      ],
    },
    {
      id: "mgmt-bot-cloud",
      title: "Servidor Bot WhatsApp 24/7 + Mantenimiento Web",
      badge: "Ideal con Bot",
      monthlyARS: 55000, // ~2.5h/month equivalent (includes bot uptime/hosting & adjustments)
      forBotCompatible: true,
      description:
        "Mantiene activo el servidor del Bot de WhatsApp las 24 hs, supervisa la conexión, actualiza precios de visita/urgencia cuando haya inflación y suma actualizaciones mensuales en tu página web.",
      includes: [
        "Servidor activo 24/7 para el asistente de WhatsApp y planilla de clientes",
        "Ajustes mensuales en las respuestas del bot (tarifas de visita, zonas, horarios)",
        "Actualización mensual de fotos de trabajos en la página web",
        "Monitoreo técnico y soporte ante desconexiones",
      ],
    },
  ],

  // Social Media Ongoing Management Options (Monthly Retainers)
  socialMonthlyOptions: [
    {
      id: "social-none",
      title: "Sin Gestión Mensual de Redes (Lo manejo yo)",
      badge: "$0 / mes",
      monthlyARS: 0,
      defaultSelected: true,
      description:
        "Publicás a tu propio ritmo. Si elegiste el 'Kit Inicial de Redes', usás las plantillas y el asistente automático para armar tus posteos cuando quieras sin pagar abono mensual.",
      includes: ["Control 100% por tu cuenta", "Sin compromiso mensual"],
    },
    {
      id: "social-basic",
      title: "Plan Presencia Activa (4 Publicaciones + 8 Historias / mes)",
      badge: "1 vez por semana",
      monthlyARS: 90000, // 4h/month * $22,500 ARS
      description:
        "Vos solo nos mandás por WhatsApp fotos o videos cortos de los trabajos que vas haciendo en la semana. Nosotros los editamos, aplicamos tu marca, redactamos los textos y los publicamos por vos.",
      includes: [
        "1 publicación semanal en el Feed / Reel corto (4 al mes)",
        "2 secuencias de Historias por semana (8 al mes) para mantener la cuenta activa",
        "Diseño gráfico sobre tus fotos reales de obra",
        "Redacción persuasiva enfocada en conseguir clientes en tu zona",
      ],
    },
    {
      id: "social-pro",
      title: "Plan Crecimiento Local (8 Publicaciones + 16 Historias + Google Maps)",
      badge: "2 veces por semana",
      monthlyARS: 157500, // 7h/month * $22,500 ARS
      description:
        "Para posicionarte como el electricista referente de tu zona. Publicamos dos veces por semana en Instagram/Facebook y además subimos novedades a tu ficha de Google Maps para aparecer más arriba en las búsquedas.",
      includes: [
        "2 publicaciones semanales (Reels de trabajos, carruseles de consejos, antes/después)",
        "Historias constantes con botones de contacto rápido",
        "Publicación mensual de fotos y novedades en Google Business Profile (Google Maps)",
        "Asesoramiento para campañas publicitarias locales (Meta Ads / Google) si deseás invertir en anuncios",
      ],
    },
  ],

  // Future Roadmap / Unpriced Phase 2 Ideas (Tier 3 discarded from current budget, presented as future possibilities)
  futureRoadmap: [
    {
      title: "Pre-Presupuestador Interactivo en la Web",
      tag: "Ahorro de tiempo",
      icon: "calculator",
      description:
        "Una calculadora simple en tu página donde el cliente selecciona qué necesita (ej: colocar 3 tomas, cambiar disyuntor, instalar ventilador de techo) y ve un rango estimado antes de escribirte. Filtra curiosos y te llegan clientes listos para contratar.",
    },
    {
      title: "Generador de Presupuestos PDF en 60 Segundos",
      tag: "Imagen Profesional",
      icon: "file-text",
      description:
        "Una herramienta privada en tu celular donde cargás el nombre del cliente, los materiales y la mano de obra desde la obra, y te genera al instante un PDF membretado con validez de días y garantía, listo para reenviar por WhatsApp.",
    },
    {
      title: "Agenda Online de Visitas Técnicas",
      tag: "Organización",
      icon: "calendar",
      description:
        "Integración con el calendario de tu celular para que los trabajos que no son urgencias puedan elegir un día y franja horaria disponible sin idas y vueltas de mensajes.",
    },
    {
      title: "Recolector Automático de Reseñas 5 Estrellas",
      tag: "Más Clientes en Google",
      icon: "star",
      description:
        "Al día siguiente de terminar un trabajo, el sistema le envía un mensaje amable al cliente agradeciéndole y dejándole el link directo para calificar tu servicio en Google Maps. Cuantas más reseñas tenés, más arriba aparecés gratis.",
    },
    {
      title: "Recordatorios de Mantenimiento (Consorcios y Comercios)",
      tag: "Ingresos Recurrentes",
      icon: "bell",
      description:
        "Avisos automáticos cada 6 o 12 meses a locales comerciales, oficinas o consorcios que ya atendiste para recordarles el control de luces de emergencia, medición de puesta a tierra o revisión de tableros.",
    },
  ],
};
