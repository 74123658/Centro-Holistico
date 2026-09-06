import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, MessageCircle, MoreVertical, AlertTriangle, CheckCircle2, XCircle, RotateCcw, Plus, ExternalLink } from 'lucide-react';
import { Appointment } from '../types';
import { createWhatsAppBookingUrl } from '../utils/whatsapp';
import { formatFullDate, getDateBreakdown } from '../utils/dateFormat';

interface AppointmentsManagerProps {
  appointments: Appointment[];
  onOpenBooking: () => void;
  onOpenReschedule: (apt: Appointment) => void;
  onCancelAppointment: (appointmentId: string, reason?: string) => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  appointments,
  onOpenBooking,
  onOpenReschedule,
  onCancelAppointment
}) => {
  const [filter, setFilter] = useState<'upcoming' | 'completed' | 'cancelled' | 'all'>('upcoming');
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Imprevisto personal');

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'upcoming') return apt.status === 'confirmed' || apt.status === 'pending';
    if (filter === 'completed') return apt.status === 'completed';
    if (filter === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  // Next appointment for banner
  const upcomingApt = appointments.find(a => a.status === 'confirmed');

  const handleConfirmCancel = () => {
    if (cancelModalApt) {
      onCancelAppointment(cancelModalApt.id, cancelReason);
      setCancelModalApt(null);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Banner de próxima cita en tiempo real */}
      {upcomingApt && (
        <div className="bg-gradient-to-br from-[#4A3B22] to-[#2F2415] text-[#FAF5EB] p-4 rounded-2xl shadow-sm border border-[#6B5534] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6C994] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
              Próxima Sesión Programada
            </span>
            <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-[#F5EAD4]">
              {upcomingApt.code}
            </span>
          </div>

          <h3 className="font-serif-title text-base font-bold text-white mt-2">
            {upcomingApt.serviceName}
          </h3>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#F5EAD4] bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="font-semibold text-white">
                {formatFullDate(upcomingApt.date)}
              </span>
              <span className="text-[#D4AF37]">•</span>
              <span>{upcomingApt.time} ({upcomingApt.durationMinutes} min)</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#E2D2B8] px-1">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="truncate">{upcomingApt.therapistName}</span>
              </div>
              <span>•</span>
              <span className="text-[11px] text-[#CBB494]">
                Modalidad {upcomingApt.modality}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              onClick={() => onOpenReschedule(upcomingApt)}
              className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition"
            >
              Reprogramar
            </button>
            <a
              href={createWhatsAppBookingUrl(upcomingApt)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Título y Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div>
          <h2 className="font-serif-title text-lg font-bold text-[#3B2D19]">
            Gestión de Citas
          </h2>
          <p className="text-xs text-[#7A664E]">
            Consulta tus citas agendadas, reprograma horarios o cancela en tiempo real.
          </p>
        </div>

        <button
          onClick={onOpenBooking}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5B472A] hover:bg-[#43331C] text-white text-xs font-semibold rounded-xl transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* Tabs de Filtro */}
      <div className="flex bg-[#EFE7D8] p-1 rounded-xl gap-1 text-xs">
        {[
          { id: 'upcoming', label: `Próximas (${appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length})` },
          { id: 'completed', label: 'Completadas' },
          { id: 'cancelled', label: 'Canceladas' },
          { id: 'all', label: 'Todas' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`flex-1 py-1.5 text-center font-semibold rounded-lg transition ${
              filter === t.id
                ? 'bg-white text-[#3B2D19] shadow-xs'
                : 'text-[#7D6B53] hover:text-[#3B2D19]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lista de Citas */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#EADBCA] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF4E8] text-[#9A7030] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif-title font-bold text-sm text-[#382B18]">
              No tienes citas en esta sección
            </h4>
            <p className="text-xs text-[#82715B] mt-1 max-w-xs mx-auto">
              Regálate un momento de pausa y sanación reservando una terapia en vivo.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-5 py-2 bg-[#4A3B22] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#382C18] transition"
          >
            Agendar una Cita Ahora
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((apt) => {
            const isConfirmed = apt.status === 'confirmed';
            const isCancelled = apt.status === 'cancelled';
            const isCompleted = apt.status === 'completed';

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-4 border border-[#EADBCA] shadow-xs hover:border-[#D5C2A5] transition space-y-3"
              >
                {/* Header de la tarjeta */}
                <div className="flex items-start justify-between gap-2 border-b border-[#F2E7D5] pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-[#7E571E] bg-[#F9EED9] px-2 py-0.5 rounded">
                        {apt.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isConfirmed
                          ? 'bg-[#EAF5ED] text-[#2E6B47] border border-[#CEEAD6]'
                          : isCancelled
                          ? 'bg-[#FDEEEB] text-[#B8321E] border border-[#F5CAC3]'
                          : 'bg-[#EBF2F9] text-[#245D8F] border border-[#C6DEEE]'
                      }`}>
                        {isConfirmed && '● Confirmada'}
                        {isCancelled && '✕ Cancelada'}
                        {isCompleted && '✓ Completada'}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#382B18] mt-1">
                      {apt.serviceName}
                    </h3>
                  </div>

                  {apt.price ? (
                    <span className="font-bold text-xs text-[#4A3B22]">
                      ${apt.price} MXN
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#8C6424] bg-[#FAF3E6] border border-[#EADBCA] px-2 py-0.5 rounded-md">
                      Costo por confirmar
                    </span>
                  )}
                </div>

                {/* Bloque destacado de Fecha: Día, Mes y Año */}
                {(() => {
                  const dateInfo = getDateBreakdown(apt.date);
                  return (
                    <div className="bg-[#FAF5EB] p-2.5 rounded-xl border border-[#EADBCA] flex items-center gap-3">
                      {/* Calendario visual con Día, Mes y Año */}
                      <div className="bg-white px-2.5 py-1.5 rounded-lg border border-[#DAC6A8] text-center shadow-2xs min-w-[58px] shrink-0">
                        <span className="text-[10px] font-bold text-[#9A7030] uppercase block leading-tight">
                          {dateInfo.monthShort}
                        </span>
                        <span className="text-lg font-extrabold text-[#382B18] block leading-none my-0.5">
                          {String(dateInfo.dayNumber).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-semibold text-[#8C765C] block leading-tight">
                          {dateInfo.year}
                        </span>
                      </div>

                      {/* Texto explícito con Día de la semana, Día, Mes y Año */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B2D19]">
                          <Calendar className="w-3.5 h-3.5 text-[#B88746] shrink-0" />
                          <span className="truncate">{dateInfo.weekday}, {dateInfo.dayNumber} de {dateInfo.monthName} de {dateInfo.year}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#695843] mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#B88746]" />
                            <strong>{apt.time}</strong> ({apt.durationMinutes} min)
                          </span>
                          <span>•</span>
                          <span>{apt.modality} {apt.modality === 'Presencial' ? '(Pachuca)' : '(Zoom)'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Detalles de terapeuta y paciente */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#63513C] pt-1">
                  <div>
                    <span className="text-[10px] text-[#9A7030] font-semibold block">Especialista:</span>
                    <span className="font-medium text-[#382B18]">{apt.therapistName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#9A7030] font-semibold block">Paciente:</span>
                    <span>{apt.clientName} ({apt.clientPhone})</span>
                  </div>
                </div>

                {apt.notes && (
                  <div className="bg-[#FAF5EB] p-2 rounded-lg text-[11px] text-[#695843] italic border-l-2 border-[#C9AE85]">
                    "{apt.notes}"
                  </div>
                )}

                {isCancelled && apt.cancelReason && (
                  <div className="bg-[#FDEEEB] p-2 rounded-lg text-[11px] text-[#9E2A18]">
                    <strong>Motivo de cancelación:</strong> {apt.cancelReason}
                  </div>
                )}

                {/* Botones de acción */}
                {!isCancelled && (
                  <div className="pt-2 border-t border-[#F2E7D5] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenReschedule(apt)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF4E8] hover:bg-[#F2E5CE] text-[#5B472A] text-xs font-semibold border border-[#EADBCA] transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reprogramar</span>
                      </button>

                      <button
                        onClick={() => setCancelModalApt(apt)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#FDEEEB] text-[#A63422] text-xs font-semibold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancelar</span>
                      </button>
                    </div>

                    <a
                      href={createWhatsAppBookingUrl(apt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold shadow-xs transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Notificar por WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cancelación */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EB] rounded-2xl max-w-sm w-full p-5 border border-[#DECBAF] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-[#FDEEEB] text-[#A63422] flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 className="font-serif-title text-base font-bold text-[#3B2D19]">
              ¿Deseas cancelar esta cita?
            </h3>
            <p className="text-xs text-[#7A664E] mt-1">
              Se liberará el cupo de <strong>{cancelModalApt.serviceName}</strong> programada para el <strong>{formatFullDate(cancelModalApt.date)}</strong> a las <strong>{cancelModalApt.time}</strong>.
            </p>

            <div className="mt-3">
              <label className="block text-[11px] font-bold text-[#57442B] mb-1">
                Motivo (opcional):
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-[#DAC9AF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B472A]"
              >
                <option value="Imprevisto personal">Imprevisto personal</option>
                <option value="Conflicto de horario laboral">Conflicto de horario laboral</option>
                <option value="Tema de salud o reposo">Tema de salud o reposo</option>
                <option value="Deseo cambiar de terapia">Deseo cambiar de terapia</option>
                <option value="Otro motivo">Otro motivo</option>
              </select>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="flex-1 py-2 rounded-xl bg-[#ECE0CD] hover:bg-[#E2D2B8] text-[#4A3B22] text-xs font-semibold transition"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2 rounded-xl bg-[#A63422] hover:bg-[#872718] text-white text-xs font-semibold transition"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
