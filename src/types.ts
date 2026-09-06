export type ServiceCategory = 
  | 'Todos'
  | 'Experiencias'
  | 'Cuerpo'
  | 'Mente'
  | 'Energía'
  | 'Espíritu'
  | 'Sistémica'
  | 'Emocional';

export type LiveStatus = 
  | 'disponible_hoy' 
  | 'pocos_cupos' 
  | 'en_sesion' 
  | 'proximo_turno';

export interface Service {
  id: string;
  name: string;
  category: Exclude<ServiceCategory, 'Todos'>;
  desc: string;
  longDesc?: string;
  durationMinutes: number;
  price?: number;
  therapistIds: string[];
  benefits: string[];
  suitableFor: string;
  liveStatus: LiveStatus;
  nextSlotTime: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  modality: 'Presencial' | 'En línea' | 'Ambas';
  popular?: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  shortName: string;
  title: string;
  lema: string;
  exp: string;
  focus: string;
  specialties: string[];
  gender: string;
  photoUrl: string;
  availableToday: boolean;
  activeSlotsCount: number;
  badge: string;
  phoneMsgCode: string;
  localPhotoPath?: string;
  accreditations?: string[];
  secondarySpecialties?: { category: string; items: string[] }[];
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  code: string;
  serviceId: string;
  serviceName: string;
  therapistId: string;
  therapistName: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "11:00 AM"
  status: AppointmentStatus;
  createdAt: string;
  durationMinutes: number;
  price?: number;
  modality: 'Presencial' | 'En línea';
  cancelReason?: string;
}

export interface ScheduleClass {
  id: string;
  title: string;
  time: string;
  day: string; // 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado'
  instructor: string;
  spotsRemaining: number;
  maxCapacity: number;
  category: string;
  room: string;
}

export interface DiagnosticResult {
  therapist: Therapist;
  services: Service[];
  stressScore: number;
  tensionScore: number;
  date: string;
  selectedSymptoms: string[];
}
