import { Service, Therapist, ScheduleClass } from '../types';

export const WHATSAPP_PHONE = "527714845326";
export const DISPLAY_PHONE = "771 484 5326";
export const ADDITIONAL_PHONES = ["771 910 0843", "771 118 4774"];
export const CENTER_ADDRESS = "Av. Miguel Hidalgo 230-296, Campestre Villas del Álamo, C.P. 42074 Pachuca, Hgo.";

export const THERAPISTS: Therapist[] = [
  {
    id: "virginia-altamirano",
    name: "Virginia Altamirano Licona",
    shortName: "Virginia Altamirano",
    title: "Masajista Holística",
    lema: "Bienestar que se siente, armonía que transforma.",
    exp: "Cuento con más de 12 años de experiencia. Mi enfoque es acompañar a cada individuo desde una visión amorosa, respetuosa y personalizada, utilizando terapias complementarias que promueven el equilibrio físico, emocional, mental y espiritual.",
    focus: "Masaje corporal terapéutico, aromaterapia, musicoterapia, terapia ocupacional enfocada en habilidades funcionales y atención integral al adulto mayor.",
    specialties: [
      "Masaje corporal terapéutico",
      "Aromaterapia",
      "Musicoterapia",
      "Terapia ocupacional enfocada en habilidades funcionales",
      "Atención al adulto mayor"
    ],
    gender: "Terapeuta",
    photoUrl: "/therapists/virginia.jpg",
    localPhotoPath: "/therapists/virginia.jpg",
   
    badge: "+12 Años Exp.",
    phoneMsgCode: "VirginiaAltamirano",
    accreditations: ["Masajista Holística Certificada", "+12 Años de Experiencia Clínica"]
  },
  {
    id: "nancy-chanel",
    name: "Nancy Chanel Reyes Altamirano",
    shortName: "Nancy Chanel Reyes",
    title: "Masajista Holística",
    lema: "Vocación, servicio y compromiso con el bienestar físico y emocional de los clientes.",
    exp: "Cuento con más de 5 años de experiencia. Me especializo en brindar una atención cálida, respetuosa y personalizada. Creando un ambiente de confianza para que cada persona disfrute de una experiencia de relajación y equilibrio.",
    focus: "Masajista profesional, acompañamiento en ceremonias de Temazcal, masaje terapéutico y atención personalizada.",
    specialties: [
      "Masajista profesional",
      "Acompañamiento en ceremonias de Temazcal",
      "Masaje terapéutico",
      "Atención personalizada"
    ],
    gender: "Terapeuta",
    photoUrl: "/therapists/nancy.jpg",
    localPhotoPath: "/therapists/nancy.jpg",
    
    badge: "Temazcal & Masajes",
    phoneMsgCode: "NancyChanel",
    accreditations: ["Masajista Profesional", "Acompañante de Temazcal Tradicional"]
  },
  {
    id: "rosa-angeles",
    name: "Dra. Rosa Ángeles Vázquez García",
    shortName: "Dra. Rosa Ángeles",
    title: "Terapeuta Holística & Doctora en Ciencias",
    lema: "Ciencia, energía y mente: el triángulo de la sanación integral",
    exp: "Licenciada en Química Farmacobiológica. Doctora en Ciencias Químicas. Cuenta con diversas certificaciones nacionales e internacionales en terapias holísticas, medicina alternativa y desarrollo integral.",
    focus: "Desbalances energéticos profundos, biodescodificación, constelaciones cuánticas y fluviales, dolor, patrones kármicos y armonización mente-cuerpo.",
    specialties: [
      "Reiki Karuna y Maestría en Reiki",
      "Medicina Angélica",
      "Péndulo Hebreo",
      "Códigos Sagrados",
      "Radiestesia y Radiónica",
      "Medicina Cuántica",
      "ThetaHealing",
      "Registros Akáshicos"
    ],
    secondarySpecialties: [
      {
        category: "Terapias complementarias y medicina alternativa",
        items: [
          "Biodescodificación con Hipnosis Cuántica",
          "Biomagnetismo Holístico y Descodificación",
          "Cosmetología Magnética",
          "Auriculoterapia",
          "Reflexología Podal",
          "Su Jok",
          "Microdosis de Herbolaria",
          "Flores de Bach"
        ]
      },
      {
        category: "Constelaciones y terapias sistémicas",
        items: [
          "Consteladora Cuántica",
          "Tarot de Marsella",
          "Constelaciones Fluviales",
          "Vincores",
          "Cristales",
          "Técnicas Proyectivas"
        ]
      }
    ],
    gender: "Dra.",
    photoUrl: "/therapists/rosa.jpg",
    localPhotoPath: "/therapists/rosa.jpg",
   
    
    badge: "SEP-CONOCER & Dr. Cs.",
    phoneMsgCode: "DraRosa",
    accreditations: [
      "Doctora en Ciencias Químicas",
      "Licenciada en Química Farmacobiológica",
      "Facilitadora con Certificación Internacional en Barras de Access",
      "Coach Certificada con registro SEP-CONOCER, ECO 204 y 234"
    ]
  },
  {
    id: "alma-erika",
    name: "Lic. Alma Erika Palafox Juárez",
    shortName: "Lic. Alma Erika",
    title: "Terapeuta Holística",
    lema: "Que tu luz se expanda para que reconozcas tu perfección y se propague en el mundo que te rodea",
    exp: "Terapeuta holística con 7 años de experiencia, dedicada a acompañar procesos de bienestar y equilibrio integral a través de diferentes técnicas terapéuticas.",
    focus: "Procesos de bienestar y equilibrio integral, liberación somática, estrés mental, expresión corporal consciente y reconexión interior.",
    specialties: [
      "Reiki",
      "Barras de Access",
      "Danzaterapia"
    ],
    gender: "Lic.",
    photoUrl: "/therapists/alma.jpg",
    localPhotoPath: "/therapists/alma.jpg",
  
    badge: "7 Años Exp.",
    phoneMsgCode: "AlmaPalafox",
    accreditations: ["Terapeuta Holística (7 Años)", "Facilitadora de Barras de Access y Danzaterapia"]
  },
  {
    id: "mara-alejandra",
    name: "Mara Alejandra Gómez Arce",
    shortName: "Mara Gómez Arce",
    title: "Terapeuta Holística",
    lema: "Cuando sanas tus emociones, tu mente encuentra paz, tu cuerpo recupera el equilibrio y tu alma vuelve a florecer.",
    exp: "Mi misión es acompañarte con amor, respeto y compromiso en tu proceso de bienestar integral. A través de terapias holísticas y complementarias, busco ayudarte a recuperar el equilibrio entre tus emociones, tu mente, tu cuerpo y tu energía, para que vivas con mayor armonía y plenitud.",
    focus: "Sanación emocional, drenado de energías densas, cirugías energéticas, flores de bach, microdosis de plantas medicinales y medicina cuántica.",
    specialties: [
      "Flores de Bach",
      "Herbolaria, microdosis",
      "Barras Access",
      "Auriculoterapia",
      "Reiki, cirugía energéticas",
      "Drenado de energias densas, cuántica"
    ],
    secondarySpecialties: [
      {
        category: "Terapias complementarias y medicina alternativa",
        items: [
          "Auriculoterapia",
          "Biomagnetismo",
          "Reiki",
          "Cirugía energética",
          "Péndulo hebreo",
          "Biodescodificación e hipnosis cuántica",
          "Medicina Cuántica",
          "Flores de Bach",
          "ThetaHealing",
          "Microdosis de plantas medicinales",
          "Limpiezas energéticas",
          "Barras Access"
        ]
      }
    ],
    gender: "Terapeuta",
    photoUrl: "/therapists/mara.jpg",
    localPhotoPath: "/therapists/mara.jpg",
   
    badge: "Medicina Cuántica",
    phoneMsgCode: "MaraGomez",
    accreditations: ["Especialista en Medicina Cuántica y Cirugía Energética", "Terapeuta en Biodescodificación"]
  }
];

export const SERVICES: Service[] = [
  {
    id: "temazcal",
    name: "Temazcal Tradicional",
    category: "Experiencias",
    desc: "Renovación y conexión interior en baño de vapor ancestral con hierbas medicinales.",
    longDesc: "Espacio ceremonial de purificación donde el calor de las abuelitas piedras volcánicas y la infusión de plantas curativas limpian las vías respiratorias, desintoxican los órganos y abren el portal de renacimiento espiritual.",
    durationMinutes: 120,
    therapistIds: ["nancy-chanel"],
    benefits: [
      "Desintoxicación celular profunda",
      "Alivio de vías respiratorias y tensión muscular",
      "Renacimiento emocional y conexión con la Madre Tierra",
      "Estimulación del sistema linfático e inmune"
    ],
    suitableFor: "Desintoxicación física, renacimiento espiritual, liberación de cargas emocionales y fatiga acumulada.",
  liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 4.9,
    reviewCount: 48,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    modality: "Presencial",
    popular: true
  },
  {
    id: "barras-access",
    name: "Barras de Access Consciousness",
    category: "Energía",
    desc: "Toque suave en 32 puntos de la cabeza que disuelven pensamientos limitantes y estrés.",
    longDesc: "Terapia bio-magnética y electromagnética que descarga la sobrecarga del disco duro mental. Al activar estos 32 puntos, se liberan juicios, traumas, estrés financiero y patrones limitantes acumulados por años.",
    durationMinutes: 60,
    therapistIds: ["rosa-angeles", "alma-erika", "mara-alejandra"],
    benefits: [
      "Sensación inmediata de ligereza y paz mental",
      "Reducción notable de ansiedad y rumiación",
      "Mejora profunda en la calidad del sueño",
      "Desbloqueo en áreas de creatividad y abundancia"
    ],
    suitableFor: "Insomnio, ansiedad profunda, sobrecarga mental, bloqueo de proyectos y estrés cotidiano.",
  estado en vivo: "consultar",
siguienteRanura: "Consultar",
    rating: 5.0,
    reviewCount: 62,
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
    modality: "Presencial",
    popular: true
  },
  {
    id: "reiki",
    name: "Reiki & Armonización de Chakras",
    category: "Espíritu",
    desc: "Canalización de energía vital universal para restablecer el flujo y alinear tu aura.",
    longDesc: "Terapia vibracional milenaria que restaura el flujo energético vital (Ki/Chi) a través de la imposición suave de manos y símbolos sagrados. Ideal para reconectar con tu centro y reponer energía debilitada.",
    durationMinutes: 60,
    therapistIds: ["rosa-angeles", "mara-alejandra", "alma-erika"],
    benefits: [
      "Alineación completa de los 7 centros energéticos",
      "Calma profunda del sistema nervioso",
      "Aceleración de procesos de recuperación física",
      "Apertura del chakra del corazón y paz interior"
    ],
    suitableFor: "Angustia, desánimo, convalecencia, debilidad energética y necesidad de equilibrio espiritual.",
   liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 4.9,
    reviewCount: 39,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    modality: "Presencial"
  },
  {
    id: "biomagnetismo",
    name: "Estudio Biomagnético & Descodificación",
    category: "Cuerpo",
    desc: "Equilibrio del pH celular mediante imanes de polaridad norte y sur para regular patógenos.",
    longDesc: "Evaluación bioenergética clínica que rastrea y neutraliza polos biomagnéticos alterados con pares de imanes terapéuticos (polo positivo rojo / polo negativo negro). Al restablecer el pH neutro en órganos y tejidos, el cuerpo elimina virus, bacterias, hongos y parásitos de manera natural.",
    durationMinutes: 75,
    therapistIds: ["rosa-angeles", "mara-alejandra"],
    benefits: [
      "Restauración del equilibrio del pH biológico con par biomagnético",
      "Fortalecimiento del sistema inmunitario y drenaje celular",
      "Disminución de inflamación crónica en columna y espalda",
      "Descodificación biológica del origen emocional del síntoma"
    ],
    suitableFor: "Malestares físicos recurrentes, inflamación, bajas defensas y desequilibrios del organismo.",
   liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 4.9,
    reviewCount: 51,
    imageUrl: "/assets/biomagnetismo.svg",
    modality: "Presencial"
  },
  {
    id: "constelaciones",
    name: "Constelaciones Fluviales & Cuánticas",
    category: "Sistémica",
    desc: "Sanación del árbol genealógico, orden familiar y desbloqueos con hidrosistémica cuántica.",
    longDesc: "Método terapéutico innovador que utiliza el campo mórfico del agua y la resonancia cuántica para revelar dinámicas ocultas en el sistema familiar, honrar a los ancestros y cortar lealtades inconscientes.",
    durationMinutes: 90,
    therapistIds: ["rosa-angeles"],
    benefits: [
      "Comprensión y sanación de patrones familiares repetitivos",
      "Liberación de culpas y lealtades invisibles",
      "Alineación con la prosperidad y éxito laboral",
      "Armonización de relaciones de pareja y entre padres e hijos"
    ],
    suitableFor: "Conflictos de pareja o familia, duelos no resueltos, trabas económicas y lealtades invisibles.",
    liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 5.0,
    reviewCount: 44,
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
    modality: "Presencial",
    popular: true
  },
  {
    id: "masaje-terapeutico",
    name: "Masaje Corporal Terapéutico & Aromaterapia",
    category: "Cuerpo",
    desc: "Técnicas manuales profundas con aceites esenciales puros para contracturas y estrés muscular.",
    longDesc: "Sesión integradora que combina maniobras descontracturantes, drenaje suave, puntos gatillo y aromaterapia de grado terapéutico. Ideal para desconectar el cuerpo del ritmo acelerado y restaurar movilidad.",
    durationMinutes: 60,
    therapistIds: ["virginia-altamirano", "nancy-chanel"],
    benefits: [
      "Alivio de contracturas en cuello, hombros y espalda baja",
      "Mejora de la circulación sanguínea y oxigenación",
      "Reducción de cortisol y liberación de endorfinas",
      "Alineación postural y sensación de renacimiento"
    ],
    suitableFor: "Dolores de espalda, cuello rígido, estrés muscular acumulado y fatiga física.",
    liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 4.8,
    reviewCount: 57,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    modality: "Presencial"
  },
  {
    id: "neuroespacio",
    name: "Neuroespacio & Estimulación de la Memoria",
    category: "Mente",
    desc: "Gimnasia cerebral, armonización neurológica y estimulación cognitiva integral.",
    longDesc: "Programa especialmente diseñado para activar conexiones sinápticas, coordinación neuro-motriz y memoria mediante ejercicios multisensoriales, frecuencias binaurales y retos lúdicos conscientes.",
    durationMinutes: 60,
    therapistIds: ["virginia-altamirano", "rosa-angeles"],
    benefits: [
      "Agilidad mental y retención de memoria",
      "Coordinación interhemisférica cerebral",
      "Prevención del deterioro cognitivo",
      "Aumento del estado de ánimo y sociabilización"
    ],
    suitableFor: "Adultos mayores, personas con fatiga mental, falta de concentración o estrés cognitivo.",
liveStatus: "consultar",
nextSlotTime: "Consultar",
rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    modality: "Presencial"
  },
  {
    id: "flores-bach",
    name: "Flores de Bach & Microdosis Herbal",
    category: "Emocional",
    desc: "Preparado floral y fitoterapéutico personalizado para estabilizar emociones difíciles.",
    longDesc: Entrevista personalizada para formular un frasco personalizado con esencias florales de Edward Bach y tinturas madre. Ayuda a superar duelos, miedos paralizantes, impaciencia y tristeza.",
    durationMinutes: 20,
    therapistIds: ["rosa-angeles", "mara-alejandra"],
    benefits: [
      "Estabilización de emociones sin efectos secundarios",
      "Alivio natural de estados de angustia o desánimo",
      "Apoyo en transiciones vitales, pérdidas o cambios",
      "Incluye frasco de tratamiento para 3 semanas"
    ],
    suitableFor: "Inestabilidad emocional, cambios de vida, hipersensibilidad, angustia o duelo.",
    liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 4.8,
reviewCount: 35,
price: 300,
imageUrl: "/assets/flores-bach.svg",
modality: "Presencial"
  },
  {
    id: "pendulo-hebreo",
    name: "Péndulo Hebreo & Cirugía Energética",
    category: "Espíritu",
    desc: "Evaluación bioenergética, limpieza de miasmas y desparasitación energética profunda.",
    longDesc: "Terapia de alta frecuencia que utiliza las letras del alfabeto hebreo en resonancia para detectar bloqueos en los 7 cuerpos sutiles, limpiar energías densas y cerrar fisuras en el campo electromagnético.",
    durationMinutes: 60,
    therapistIds: ["mara-alejandra", "rosa-angeles"],
    benefits: [
      "Drenado y desintegración de energías pesadas acumuladas",
      "Sellado y protección del campo áurico",
      "Restauración de la vitalidad y claridad mental",
      "Corte de lazos energéticos nocivos"
    ],
    suitableFor: "Sensación de pesadez corporal, mala racha prolongada, agotamiento sin causa médica y densidad energética.",
    liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 5.0,
    reviewCount: 28,
    imageUrl: "/assets/pendulo-hebreo.svg",
   
  },
  {
    id: "registros-akashicos",
    name: "Registros Akáshicos & Medicina Angélica",
    category: "Espíritu",
    desc: "Lectura del libro del alma, respuestas espirituales y canalización de sanación.",
    longDesc: "Apertura sagrada del archivo Akáshico con permiso del consultante para comprender el origen álmico de desafíos actuales, lecciones de vida, dones y recibir mensajes de los guías de luz.",
    durationMinutes: 60,
    therapistIds: ["rosa-angeles"],
    benefits: [
      "Claridad sobre tu misión de vida y propósito álmico",
      "Comprensión de contratos kármicos y relaciones espejo",
      "Sensación de profunda paz y guía angelical",
      "Canalización de mensajes personalizados"
    ],
    suitableFor: "Dudas existenciales, encrucijadas de vida, búsqueda de propósito y conexión espiritual elevada.",
    liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 4.9,
    reviewCount: 33,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    price: 1000,
  },
  {
    id: "biodescodificacion",
    name: "Biodescodificación & Hipnosis Cuántica",
    category: "Sistémica",
    desc: "Identificación de la emoción biológica que originó el síntoma para desactivarlo.",
    longDesc: "Acompañamiento clínico-holístico que encuentra el momento biológico exacto en que un bioshock o trauma no resuelto se somatizó en el cuerpo, reprogramando la memoria celular con hipnosis consciente.",
    durationMinutes: 80,
    therapistIds: ["rosa-angeles", "mara-alejandra"],
    benefits: [
      "Comprensión del mensaje que tu cuerpo expresa mediante el síntoma",
      "Liberación de emociones reprimidas de la infancia",
      "Reprogramación del subconsciente",
      "Alivio progresivo de molestias psicosomáticas"
    ],
    suitableFor: "Síntomas físicos repetitivos, alergias, dolor crónico de origen emocional y patrones de conducta.",
   liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 5.0,
    reviewCount: 42,
    imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80",
    modality: "Presencial"
  },
  {
    id: "danzaterapia",
    name: "Danzaterapia & Liberación Somática",
    category: "Emocional",
    desc: "Expresión corporal consciente, soltar rigidez emocional y reconexión con el cuerpo.",
    longDesc: "Espacio de movimiento guiado y escucha somática donde la música, la respiración y el ritmo permiten desarticular armaduras corporales y descargar tensiones emocionales acumuladas sin juicio.",
    durationMinutes: 60,
    therapistIds: ["alma-erika"],
    benefits: [
      "Liberación de corazas y rigidez muscular",
      "Reconexión con el gozo, la vitalidad y la autoestima",
      "Desbloqueo de emociones estancadas",
      "Mayor consciencia de la postura y respiración"
    ],
    suitableFor: "Estrés acumulado, inhibición, desconexión corporal, duelo somático o necesidad de ligereza.",
    liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 4.9,
    reviewCount: 26,
    imageUrl: "/assets/danzaterapia.svg",
    modality: "Presencial"
  },
  {
    id: "musicoterapia",
    name: "Musicoterapia & Armonización Sonora",
    category: "Experiencias",
    desc: "Inmersión acústica con cuencos, frecuencias sonoras y relajación neuro-acústica.",
    longDesc: "Terapia guiada por vibraciones acústicas armónicas que sincronizan las ondas cerebrales en frecuencias Alfa y Theta, reduciendo la presión sanguínea y generando un estado de bienestar profundo.",
    durationMinutes: 60,
    therapistIds: ["virginia-altamirano"],
    benefits: [
      "Inducción rápida a estados de calma y meditación",
      "Alivio de sobrecarga acústica y tensión cervical",
      "Armonización del sistema nervioso simpático",
      "Sensación de ligereza y descanso reparador"
    ],
    suitableFor: "Sobrecarga sensorial, tensión nerviosa, insomnio y personas con alta carga de trabajo mental.",
    liveStatus: "consultar",
nextSlotTime: "Consultar",
    rating: 4.8,
    reviewCount: 30,
    imageUrl: "/assets/musicoterapia.svg",
    modality: "Presencial"
  }
];



export const WEEKLY_CLASSES: ScheduleClass[] = [
  {
    id: "cls-1",
    title: "Yoga Matutino Restaurativo",
    time: "10:00 - 11:00",
    day: "Lunes a Viernes",
    instructor: "Lic. Alma Erika Palafox",
    spotsRemaining: 4,
    maxCapacity: 12,
    category: "Cuerpo & Mente",
    room: "Salón Jardín Zen"
  },
  {
    id: "cls-2",
    title: "Tai Chi & Flujo de Qi",
    time: "11:00 - 12:00",
    day: "Miércoles",
    instructor: "Facilitador Invitado",
    spotsRemaining: 2,
    maxCapacity: 10,
    category: "Energía",
    room: "Pérgola Exterior"
  },
  {
    id: "cls-3",
    title: "Fortalecimiento de la Memoria",
    time: "11:00 - 12:00",
    day: "Jueves y Viernes",
    instructor: "Virginia Altamirano",
    spotsRemaining: 5,
    maxCapacity: 8,
    category: "Neuroespacio",
    room: "Sala Multidisciplinaria"
  },
  {
    id: "cls-4",
    title: "Nutrición Consciente & Bienestar",
    time: "12:00 - 13:00",
    day: "Martes",
    instructor: "Especialista en Nutrición",
    spotsRemaining: 6,
    maxCapacity: 15,
    category: "Salud Integral",
    room: "Terraza Holística"
  },
  {
    id: "cls-5",
    title: "Mindfulness & Meditación Guiada",
    time: "13:00 - 14:00",
    day: "Miércoles y Viernes",
    instructor: "Mara Gómez",
    spotsRemaining: 3,
    maxCapacity: 12,
    category: "Espíritu",
    room: "Salón Cuántico"
  },
  {
    id: "cls-6",
    title: "Danza Consciente & Expresión",
    time: "16:00 - 17:00",
    day: "Lunes y Miércoles",
    instructor: "Lic. Alma Erika Palafox",
    spotsRemaining: 4,
    maxCapacity: 14,
    category: "Cuerpo",
    room: "Salón Principal"
  }
];

export const AVAILABLE_TIME_SLOTS = [
  { time: "09:30 AM", status: "available" },
  { time: "11:00 AM", status: "available" },
  { time: "12:30 PM", status: "limited" }, // Último cupo
  { time: "02:00 PM", status: "available" },
  { time: "03:30 PM", status: "available" },
  { time: "05:00 PM", status: "limited" },
  { time: "06:30 PM", status: "available" }
];
