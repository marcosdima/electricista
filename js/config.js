/**
 * Central Configuration for the Electrician Freelance Proposal
 * All code and documentation are in English.
 * All client-facing text strings are in Spanish (Argentina), written in first-person singular.
 */

const PROPOSAL_CONFIG = {
  // General metadata & customization placeholders
  meta: {
    clientBusinessName: "Servicios Eléctricos",
    clientLocation: "Argentina",
    proposalDate: "Octubre 2026",
    validityDays: 15,
    freelancerName: "Marcos Dima",
    freelancerWhatsApp: "",
  },

  // Base pricing parameters (Internal reference: $15 USD/hr @ $1,500 ARS/USD = $22,500 ARS/hr)
  // No hours or time estimates are displayed to the client; only direct ARS prices.
  pricing: {
    hourlyRateUSD: 15,
    exchangeRateARS: 1500,
    get hourlyRateARS() {
      return this.hourlyRateUSD * this.exchangeRateARS; // $22,500 ARS/hr
    },
  },

  // Main development modules (one-time fee)
  developmentModules: [
    {
      id: "web-static",
      title: "Página Web Estática",
      subtitle: "Vidriera profesional online y contacto directo adaptado a celulares",
      icon: "globe",
      costARS: 200000, // ~9h equivalent @ $22,500 (precio de lanzamiento redondeado)
      defaultSelected: true,
      summary:
        "Una página web moderna, rápida y adaptable a celulares para mostrar tus especialidades, fotos de trabajos realizados y habilitar contacto directo a tu WhatsApp con mensajes predefinidos.",
      features: [
        "Diseño adaptable para celulares y computadoras.",
        "Botones directos de WhatsApp diferenciados por tipo de servicio.",
        "Catálogo de especialidades (Instalaciones, Tableros, Certificaciones).",
        "Galería de imágenes de trabajos realizados y sellos de confianza.",
        "Sección de preguntas frecuentes y mapa informativo de cobertura.",
      ],
      techNote: "Alojada en servidores globales gratuitos (GitHub Pages / Cloudflare). No genera ningún costo fijo mensual de hosting.",
    },
    {
      id: "whatsapp-bot",
      title: "Asistente Automático de WhatsApp (24/7)",
      subtitle: "Filtro de consultas y recepción de datos mientras estás trabajando",
      icon: "message-square",
      costARS: 360000, // 16h equivalent @ $22,500
      defaultSelected: false,
      summary:
        "Responde de forma inmediata a los mensajes entrantes, clasifica si es una urgencia técnica o un presupuesto programado, y solicita barrio y fotografía del tablero o falla antes de que tomes contacto.",
      features: [
        "Menú de opciones: Urgencia eléctrica, Solicitud de presupuesto o Consulta de zonas y tarifas de visita.",
        "Solicitud automática de datos: barrio o dirección, descripción del problema y foto del tablero o instalación.",
        "Priorización de urgencias: notificación prioritaria o llamada directa cuando un cliente se queda sin suministro.",
        "Registro ordenado en planilla (Google Sheets) con el detalle de cada contacto para seguimiento.",
        "Respuestas predefinidas a preguntas frecuentes de clientes.",
      ],
      techNote: "Meta incluye 1.000 conversaciones de servicio gratuitas por mes en la API oficial de WhatsApp. Para funcionamiento continuo 24/7 sin depender de tu computadora personal, se asocia al abono con Servidor Cloud.",
    },
    {
      id: "presupuestador-desktop",
      title: "Presupuestador de Escritorio",
      subtitle: "Presupuestos formales en PDF desde tu computadora, sin costos de servidor",
      icon: "calculator",
      costARS: 270000, // 12h equivalent @ $22,500
      defaultSelected: false,
      summary:
        "Un programa instalado en tu computadora para armar presupuestos en minutos: cargás los trabajos y materiales, buscás precios actualizados en la web con asistencia y sale un PDF con tu membrete para mandar al cliente.",
      features: [
        "Catálogo editable de materiales y mano de obra que funciona sin conexión.",
        "Búsqueda asistida de precios en MercadoLibre y casas de materiales con confirmación antes de guardar.",
        "Plantilla de presupuesto con tu nombre, datos y vigencia generada en PDF.",
        "Historial de presupuestos enviados y datos de clientes frecuentes.",
        "Archivo .exe instalable en Windows, sin necesidad de instalar programas extra.",
      ],
      techNote:
        "Programa de escritorio: no consume hosting ni abono mensual. Requiere conexión solo para buscar precios en la web y para las actualizaciones del programa.",
    },
  ],

  // Standalone Extras / Add-ons (low-cost individual services)
  extraModules: [
    {
      id: "extra-google-maps",
      title: "Alta y Optimización en Google Maps",
      subtitle: "Ficha oficial en Google Business Profile para búsquedas de cercanía",
      icon: "map-pin",
      costARS: 55000, // ~2.5h equivalent @ $22,500
      defaultSelected: false,
      summary:
        "Configuración y verificación de tu negocio en Google Maps para que las personas que busquen 'electricista cerca de mí' o electricista en tu barrio encuentren tu teléfono, fotos y ubicación.",
      features: [
        "Alta o reclamo de ficha oficial en Google Business Profile.",
        "Configuración de categorías de servicio y zonas de cobertura barrial.",
        "Carga inicial de fotografías de trabajos reales y datos de contacto.",
        "Enlace directo para enviar a tus clientes y recopilar reseñas de 5 estrellas.",
      ],
      techNote: "Google Maps es una de las fuentes gratuitas con mayor intención de contratación local para oficios técnicos.",
    },
    {
      id: "extra-calendar",
      title: "Integración con Agenda / Calendario",
      subtitle: "Turnos programados coordinados desde tu web directo a tu calendario",
      icon: "calendar",
      costARS: 67500, // 3h equivalent @ $22,500
      defaultSelected: false,
      summary:
        "Conecto tu página con Google Calendar para que los clientes soliciten día y franja horaria para trabajos no urgentes, y cada pedido quede anotado en tu agenda con confirmación automática, evitando mensajes cruzados por horarios.",
      features: [
        "Botón de solicitud de visita en la web con los horarios que tengas libres.",
        "Sincronización con Google Calendar: tus bloques ocupados no se ofrecen.",
        "Confirmación automática por WhatsApp con fecha, hora y detalle del trabajo.",
        "Recordatorio previo a la visita para reducir ausencias.",
      ],
      techNote:
        "Se configura sobre tu propia cuenta de Google con integraciones gratuitas (Google Apps Script o herramienta de turnos con plan free). No requiere servidor propio ni genera costo mensual adicional.",
    },
  ],

  // Domain / URL Licensing Options
  domainOptions: [
    {
      id: "domain-free",
      title: "Subdominio Gratuito (.github.io / .vercel.app)",
      badge: "Sin costo",
      setupCostARS: 0,
      annualLicenseARS: 0,
      description:
        "Dirección del tipo 'tunombre-electricista.github.io'. No tiene costo inicial ni de mantenimiento. Es adecuada para compartir como enlace en perfiles de redes, estados de WhatsApp o códigos QR.",
      pros: ["Sin costo de renovación anual", "Habilitación inmediata", "Certificado de seguridad SSL incluido"],
      cons: ["Nombre más extenso para recordar verbalmente", "Menor presencia frente a un dominio .com.ar propio"],
    },
    {
      id: "domain-com-ar",
      title: "Dominio Propio Nacional (.com.ar - NIC Argentina)",
      badge: "Recomendado",
      setupCostARS: 45000, // 2h setup & DNS delegation
      annualLicenseARS: 8500, // Official annual fee paid to NIC.ar
      defaultSelected: true,
      description:
        "Dirección oficial en Argentina registrada a tu nombre (por ejemplo: 'www.electricistaperez.com.ar'). El registro se realiza directamente en NIC Argentina mediante Trámites a Distancia (TAD) con Clave Fiscal.",
      pros: [
        "Identidad profesional y mayor confianza en búsquedas locales",
        "Titularidad 100% a tu nombre",
        "Costo anual oficial en pesos abonado una sola vez por año",
      ],
      cons: ["Requiere validación de CUIT / Clave Fiscal (te asisto en el proceso de alta y delegación)"],
    },
    {
      id: "domain-com",
      title: "Dominio Internacional (.com)",
      badge: "Internacional",
      setupCostARS: 33750, // 1.5h setup
      annualLicenseARS: 22000, // Annual renewal reference
      description:
        "Dirección global (por ejemplo: 'www.electricistaperez.com'). La activación es inmediata sin requerir gestiones ante organismos fiscales locales.",
      pros: ["Activación directa en pocos minutos", "Reconocimiento estándar internacional"],
      cons: ["Costo de renovación anual superior al dominio nacional"],
    },
  ],

  // Technical Management & Maintenance
  managementOptions: [
    {
      id: "mgmt-self",
      title: "Autogestión (Sin Abono Mensual)",
      badge: "Sin abono",
      monthlyARS: 0,
      defaultSelected: true,
      description:
        "Entrego el sitio web publicado y funcionando en servidores gratuitos sin cargos mensuales. Si en el futuro necesitás actualizar fotos, precios o datos de contacto, me solicitás el ajuste puntual cotizado de forma particular.",
      includes: [
        "Hosting estático sin cargo mensual",
        "Entrega de accesos y manual básico de consulta",
        "Soporte y modificaciones futuras a demanda",
      ],
    },
    {
      id: "mgmt-web-care",
      title: "Mantenimiento Web y Soporte Activo",
      badge: "Mantenimiento",
      monthlyARS: 35000,
      description:
        "Me ocupo de mantener tu sitio web actualizado de forma continua: me enviás fotos de tus nuevos trabajos por WhatsApp y me encargo de subirlas a la galería, actualizar tarifas de visita y mantener activa tu ficha en Google Maps.",
      includes: [
        "Hasta 2 actualizaciones de contenido por mes (fotografías, tarifas, zonas)",
        "Control de vencimiento y renovación de dominio",
        "Carga periódica de imágenes en tu ficha de Google Maps",
        "Atención prioritaria ante dudas o modificaciones",
      ],
    },
    {
      id: "mgmt-bot-cloud",
      title: "Servidor Cloud para Bot 24/7 + Mantenimiento Web",
      badge: "Soporte Completo",
      monthlyARS: 55000,
      requiresModule: "whatsapp-bot",
      requiresHint:
        "Disponible solo si contratás el Asistente Automático de WhatsApp (paso 1).",
      description:
        "Mantengo en funcionamiento el servidor en la nube que gestiona el bot de WhatsApp las 24 horas, superviso la estabilidad de la conexión y me ocupo de los ajustes mensuales en respuestas, tarifas y contenido del sitio web.",
      includes: [
        "Disponibilidad 24/7 del asistente de WhatsApp y registro en planilla",
        "Ajustes periódicos en las respuestas del bot (precios de visita, horarios, zonas)",
        "Actualizaciones de fotos y textos en la página web",
        "Monitoreo técnico de conectividad y soporte directo",
      ],
    },
  ],

  // Social Media: binary state (sin redes / redes). Choosing "redes" shows a
  // free, demonstrative menu of possible tasks — no priced retainer tiers.
  socialOptions: [
    {
      id: "social-none",
      title: "Sin redes sociales por ahora",
      badge: "Sin redes",
      monthlyARS: 0,
      defaultSelected: true,
      description:
        "Te quedás con el manejo propio de tus perfiles según tu disponibilidad, sin abonos mensuales ni obligaciones de publicación.",
      includes: [
        "Manejo autónomo de tus perfiles",
        "Sin compromisos mensuales de pago",
        "Podés sumar la gestión más adelante cuando quieras",
      ],
    },
    {
      id: "social-active",
      title: "Quiero trabajar las redes sociales",
      badge: "Demostrativo",
      monthlyARS: 0,
      description:
        "A modo de demostración y sin costo, te muestro ejemplos de tareas que podrían incluirse en una gestión de redes. Así ves de qué se trata antes de decidir si querés que me ocupe de ellas.",
      includes: [
        "Ideas a modo de ejemplo, sin costo en esta propuesta",
        "Sin compromiso de publicación ni de abono mensual",
        "Si querés gestión continua, la cotizamos por separado",
      ],
      ideas: [
        {
          icon: "layout",
          title: "Presentación de plantillas",
          description:
            "Pack de plantillas reutilizables con tus colores y datos para que las publicaciones se vean consistentes sin diseñar nada.",
        },
        {
          icon: "zap",
          title: "Automatización de publicaciones",
          description:
            "Enviás la foto de un trabajo con un audio breve y el sistema redacta y deja listo el texto para publicar.",
        },
        {
          icon: "instagram",
          title: "Gestión completa de redes",
          description:
            "Planificación, redacción, edición y programación de publicaciones e historias de forma continua.",
        },
        {
          icon: "users",
          title: "Optimización de perfiles",
          description:
            "Biografía, portadas, historias destacadas y datos de contacto ordenados en Instagram y Facebook.",
        },
      ],
    },
  ],

  // Future Roadmap / Non-Budgeted Phase 2 Ideas
  // De-duplicated: caption automation lives in the social ideas panel, the
  // Google review link is part of the Google Maps extra, and the two web
  // pre-quote ideas were merged into a single item.
  futureRoadmap: [
    {
      title: "Pre-Cotizador Web Público para tus Clientes",
      tag: "Cotización",
      icon: "calculator",
      description:
        "Una versión web del presupuestador donde tus clientes seleccionan los trabajos habituales (cambio de térmicas, instalación de tomas, colocación de artefactos) y reciben un rango de referencia al instante, antes de escribirte por WhatsApp.",
    },
    {
      title: "Mini CRM con Historial de Clientes",
      tag: "Seguimiento",
      icon: "users",
      description:
        "Base de datos de clientes, trabajos realizados y presupuestos enviados, con recordatorios de seguimiento para que ninguna consulta quede dormida.",
    },
    {
      title: "Recordatorios de Mantenimiento Periódico",
      tag: "Fidelización",
      icon: "bell",
      description:
        "Avisos periódicos a comercios o administraciones de consorcios para revisiones de puesta a tierra, tableros o iluminación de emergencia.",
    },
  ],
};
