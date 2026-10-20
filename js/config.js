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
  // Only clean ARS values are presented to the client without artificial discounts.
  pricing: {
    hourlyRateUSD: 15,
    exchangeRateARS: 1500,
    get hourlyRateARS() {
      return this.hourlyRateUSD * this.exchangeRateARS; // $22,500 ARS/hr
    },
  },

  // Presets without marketing gimmicks or fake discounts
  presets: [
    {
      id: "preset-basic",
      name: "Opción 1: Presencia Web Esencial",
      badge: "Base Inicial",
      description: "Página web estática rápida + ficha en Google Maps + dominio propio .com.ar sin costos mensuales de mantenimiento.",
      modules: ["web-static"],
      domain: "domain-com-ar",
      management: "mgmt-self",
      socialMonthly: "social-none",
    },
    {
      id: "preset-recommended",
      name: "Opción 2: Web + Bot de WhatsApp",
      badge: "Recomendado",
      description: "Página web conectada a un asistente automático de WhatsApp que filtra urgencias y solicita fotos del problema técnico mientras estás en obra.",
      modules: ["web-static", "whatsapp-bot"],
      domain: "domain-com-ar",
      management: "mgmt-bot-cloud",
      socialMonthly: "social-none",
    },
    {
      id: "preset-full",
      name: "Opción 3: Web + Bot + Gestión de Redes",
      badge: "Completo",
      description: "Página web, asistente de WhatsApp 24/7 y gestión activa de publicaciones en redes sociales para mostrar tus trabajos de forma continua.",
      modules: ["web-static", "whatsapp-bot", "social-setup"],
      domain: "domain-com-ar",
      management: "mgmt-bot-cloud",
      socialMonthly: "social-basic",
    },
  ],

  // One-time development modules
  developmentModules: [
    {
      id: "web-static",
      title: "Página Web Estática + Google Maps",
      subtitle: "Presencia profesional y ubicación en búsquedas locales",
      icon: "globe",
      hours: 14,
      deliveryTime: "5 a 7 días hábiles",
      defaultSelected: true,
      summary:
        "Una página web rápida y optimizada para celulares para que los clientes de tu zona encuentren tus servicios en Google, vean fotos de tus trabajos y se contacten directamente por WhatsApp.",
      features: [
        "Diseño adaptable para celulares y computadoras.",
        "Botones directos de WhatsApp diferenciados por tipo de consulta.",
        "Detalle claro de servicios (Urgencias, Instalaciones, Tableros, Certificaciones).",
        "Galería de fotos de trabajos realizados y datos de matrícula profesional.",
        "Mapa con zonas de cobertura y preguntas frecuentes de clientes.",
        "Configuración y optimización de ficha en Google Maps (Google Business Profile).",
      ],
      techNote: "Alojada en infraestructura gratuita de alta velocidad (GitHub Pages / Cloudflare). No genera costo fijo de hosting.",
    },
    {
      id: "whatsapp-bot",
      title: "Asistente Automático de WhatsApp (24/7)",
      subtitle: "Filtro de consultas y recepción de datos mientras estás trabajando",
      icon: "message-square",
      hours: 16,
      deliveryTime: "7 a 10 días hábiles",
      defaultSelected: false,
      summary:
        "Responde de forma inmediata a los mensajes entrantes, clasifica el tipo de consulta y solicita la ubicación y fotos del tablero o desperfecto antes de que tomes contacto.",
      features: [
        "Menú de opciones: Urgencia eléctrica, Solicitud de presupuesto o Consulta de zonas y tarifas de visita.",
        "Solicitud automática de datos: barrio o dirección, descripción del problema y foto del tablero o instalación.",
        "Priorización de urgencias: notificación prioritaria o llamada directa cuando un cliente se queda sin suministro.",
        "Registro ordenado en planilla (Google Sheets) con el detalle de cada contacto para seguimiento.",
        "Respuestas predefinidas a preguntas frecuentes de clientes.",
      ],
      techNote: "Implementado con integración en la nube para funcionamiento continuo e independiente de tu teléfono personal.",
    },
    {
      id: "social-setup",
      title: "Kit Inicial de Redes Sociales + Automatización",
      subtitle: "Estructura profesional de perfiles y formato para publicar trabajos",
      icon: "instagram",
      hours: 10,
      deliveryTime: "5 a 7 días hábiles",
      defaultSelected: false,
      summary:
        "Configuración estética y funcional de tus perfiles comerciales en Instagram y Facebook, junto con un sistema ágil para redactar publicaciones a partir de las fotos que tomás en obra.",
      features: [
        "Optimización de biografías y portadas en Instagram y Facebook.",
        "Portadas para historias destacadas (Urgencias, Obras, Opiniones, Contacto).",
        "Pack de 6 plantillas de diseño reutilizables con tus colores y datos.",
        "Flujo asistido de publicación: enviás la foto de un trabajo con un breve audio descriptivo y recibís el texto formal listo para publicar.",
        "Guía de buenas prácticas para fotografiar instalaciones y tableros.",
      ],
      techNote: "Servicio de configuración inicial por única vez. Puede utilizarse de forma autónoma o con abono mensual de gestión.",
    },
  ],

  // Domain / URL Licensing Options
  domainOptions: [
    {
      id: "domain-free",
      title: "Subdominio Gratuito (.github.io / .vercel.app)",
      badge: "Sin costo",
      setupHours: 0,
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
      setupHours: 2,
      annualLicenseARS: 8500,
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
      setupHours: 1.5,
      annualLicenseARS: 22000,
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
        "Entrego el sitio web publicado y funcionando en servidores gratuitos sin cargos mensuales. Si en el futuro necesitás actualizar fotos, precios o datos de contacto, me solicitás el ajuste puntual por hora de trabajo.",
      includes: [
        "Hosting estático sin cargo mensual",
        "Entrega de accesos y manual básico de consulta",
        "Soporte y modificaciones futuras a demanda (cotizadas por hora)",
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

  // Social Media Ongoing Retainers
  socialMonthlyOptions: [
    {
      id: "social-none",
      title: "Sin Gestión Mensual (Administración Propia)",
      badge: "Sin abono",
      monthlyARS: 0,
      defaultSelected: true,
      description:
        "Gestionás las publicaciones por tu cuenta según tu disponibilidad, utilizando las plantillas y el sistema de redacción asistida sin costo mensual.",
      includes: ["Manejo autónomo de tus redes", "Sin compromisos mensuales de pago"],
    },
    {
      id: "social-basic",
      title: "Plan Publicación Semanal (4 posteos + 8 historias por mes)",
      badge: "Semanal",
      monthlyARS: 90000,
      description:
        "Solo me enviás fotos o videos breves de tus trabajos en la semana por WhatsApp. Me encargo de editarlos, redactar los textos técnicos en tono accesible y programar las publicaciones.",
      includes: [
        "1 publicación semanal en formato feed o video breve (4 por mes)",
        "2 historias semanales de seguimiento (8 por mes)",
        "Edición gráfica sobre imágenes reales de tus trabajos",
        "Redacción orientada a destacar profesionalismo y seguridad",
      ],
    },
    {
      id: "social-pro",
      title: "Plan Crecimiento Local (8 posteos + 16 historias + Google Maps)",
      badge: "Bisemanal",
      monthlyARS: 157500,
      description:
        "Dos publicaciones semanales en Instagram y Facebook, más actualización periódica de novedades en Google Maps para reforzar tu presencia en búsquedas de la zona.",
      includes: [
        "2 publicaciones semanales con trabajos realizados y recomendaciones técnicas",
        "Historias continuas con enlace directo a WhatsApp",
        "Publicación mensual de trabajos y avisos en Google Maps",
        "Configuración de anuncios locales si decidís invertir en publicidad",
      ],
    },
  ],

  // Future Roadmap / Non-Budgeted Phase 2 Ideas
  futureRoadmap: [
    {
      title: "Calculadora Web de Pre-Presupuesto",
      tag: "Cotización",
      icon: "calculator",
      description:
        "Un estimador en tu sitio donde el cliente selecciona los trabajos frecuentes (cambio de térmicas, instalación de tomas, colocación de artefactos) y obtiene un rango de referencia antes de contactarte.",
    },
    {
      title: "Generador Ágil de Presupuestos en PDF",
      tag: "Herramienta",
      icon: "file-text",
      description:
        "Un formulario ágil en el celular para cargar materiales y mano de obra al terminar una visita técnica, generando un presupuesto formal con membrete y validez en formato PDF.",
    },
    {
      title: "Agenda de Turnos para Trabajos Programados",
      tag: "Organización",
      icon: "calendar",
      description:
        "Integración con calendario para que visitas no urgentes puedan coordinar día y franja horaria disponible sin intercambios prolongados de mensajes.",
    },
    {
      title: "Solicitud Automática de Reseñas en Google",
      tag: "Reputación",
      icon: "star",
      description:
        "Envío programado de un mensaje de cortesía al día siguiente de finalizar un trabajo, facilitando el enlace directo para calificar tu servicio en Google Maps.",
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
