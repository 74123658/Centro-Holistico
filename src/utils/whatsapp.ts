import { WHATSAPP_PHONE } from '../data/mockData';
import { Appointment } from '../types';
import { formatFullDate } from './dateFormat';

export function createWhatsAppBookingUrl(apt: Appointment): string {
  const text = `🌿 *Solicitud de cita - Equilibria Zen & Garden*

Servicio: *${apt.serviceName}*
Terapeuta solicitada: *${apt.therapistName}*
Paciente: *${apt.clientName}*
Teléfono: *${apt.clientPhone}*
${apt.notes ? `Motivo / Intención: _"${apt.notes}"_\n` : ''}

Solicito confirmar disponibilidad, fecha, horario y costo directamente por WhatsApp.

Muchas gracias.`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function createWhatsAppInquiryUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function createWhatsAppRescheduleUrl(apt: Appointment, newDate: string, newTime: string): string {
  const text = `🔄 *Solicitud de Reprogramación - Equilibria Zen & Garden*
Código de cita: *${apt.code}*
Servicio: *${apt.serviceName}*
Terapeuta: *${apt.therapistName}*
Paciente: *${apt.clientName}*

Fecha actual: ${formatFullDate(apt.date)} a las ${apt.time}
➡️ *Nueva fecha solicitada: ${formatFullDate(newDate)} a las ${newTime}*

Agradezco confirmar si este nuevo horario está libre.`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
