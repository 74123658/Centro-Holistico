import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, AlertCircle, Check, Send } from 'lucide-react';
import { Appointment } from '../types';
import { AVAILABLE_TIME_SLOTS } from '../data/mockData';
import { createWhatsAppRescheduleUrl } from '../utils/whatsapp';
import { formatFullDate, getUpcomingDays } from '../utils/dateFormat';

interface RescheduleModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onConfirmReschedule
}) => {
  if (!isOpen || !appointment) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const [newDate, setNewDate] = useState<string>(appointment.date);
  const [newTime, setNewTime] = useState<string>(appointment.time);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Next 7 days with full day, month, year data
  const nextDates = getUpcomingDays(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReschedule(appointment.id, newDate, newTime);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-[#FAF5EB] w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col border border-[#DECBAF] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8DFC9] bg-[#FDFBF7] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#A07028]">
              Gestión de Cita • {appointment.code}
            </span>
            <h2 className="font-serif-title text-base font-bold text-[#3B2D19]">
              Reprogramar Turno
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-[#7E694D] hover:text-[#3C2E1B] hover:bg-[#EADBCA] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#52412B]">
          
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white p-3.5 rounded-xl border border-[#DECBAF] space-y-1.5">
                <span className="text-[10px] font-bold text-[#9A7030] uppercase">Cita actual en sistema:</span>
                <p className="font-bold text-[#382B18] text-sm">{appointment.serviceName}</p>
                <p className="text-[11px] text-[#7A664E]">
                  Terapeuta: {appointment.therapistName}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#A8452A] font-semibold pt-1 border-t border-[#F0E4D3]">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#A8452A] shrink-0" />
                  <span>Horario actual: {formatFullDate(appointment.date)} a las {appointment.time}</span>
                </div>
              </div>

              {/* Selector de Nueva Fecha */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-[#57442B] uppercase tracking-wider">
                    1. Elige la nueva fecha (Día, Mes y Año):
                  </label>
                  <span className="text-[10px] text-[#8C6D37] font-semibold">
                    Año {new Date().getFullYear()}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {nextDates.map((item) => {
                    const isSelected = newDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setNewDate(item.dateStr)}
                        className={`p-1.5 rounded-xl text-center border transition flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#4A3B22] text-white border-[#4A3B22] shadow-xs ring-2 ring-[#4A3B22]/30'
                            : 'bg-[#FDFBF7] border-[#E5D7C2] text-[#5A4731] hover:bg-white'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-bold tracking-tight">{item.dayName}</span>
                        <span className="text-sm font-extrabold my-0.5">{String(item.dayNumber).padStart(2, '0')}</span>
                        <span className="text-[9px] font-medium opacity-90">{item.monthName}</span>
                        <span className="text-[8px] opacity-70">{item.year}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selección personalizada de fecha */}
                <div className="mt-2.5 p-2 bg-[#F8F1E4] rounded-xl border border-[#DECBAF] flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#8C6424] shrink-0" />
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-[#6B512C]">
                      O elige cualquier otra fecha en el calendario:
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={newDate}
                      onChange={(e) => {
                        if (e.target.value) setNewDate(e.target.value);
                      }}
                      className="mt-0.5 w-full bg-white px-2 py-1 text-xs border border-[#DECBAF] rounded-lg text-[#3B2D19] focus:outline-none focus:ring-1 focus:ring-[#5B472A]"
                    />
                  </div>
                </div>

                {/* Banner de fecha seleccionada */}
                <div className="mt-2 p-2 rounded-xl bg-white border border-[#DECBAF] flex items-center gap-2 text-xs">
                  <CalendarIcon className="w-4 h-4 text-[#2E6B47] shrink-0" />
                  <span className="text-[#695843]">
                    Nueva fecha elegida: <strong className="text-[#2E6B47]">{formatFullDate(newDate)}</strong>
                  </span>
                </div>
              </div>

              {/* Selector de Nuevo Horario */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-[#57442B] uppercase tracking-wider">
                    2. Elige el nuevo horario disponible:
                  </label>
                  <span className="text-[10px] text-[#2E6B47] font-semibold">● En vivo</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isSelected = newTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setNewTime(slot.time)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-[#5B472A] text-white border-[#5B472A] shadow-xs'
                            : 'bg-white border-[#E5D7C2] text-[#4A3B22] hover:bg-[#FAF4E8]'
                        }`}
                      >
                        <span>{slot.time}</span>
                        <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#EAF5ED] text-[#2E6B47]'
                        }`}>
                          Libre
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#4A3B22] hover:bg-[#382C18] text-white font-bold rounded-xl shadow-xs transition"
                >
                  Guardar Nuevo Horario
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-[#EAF5ED] text-[#2E6B47] flex items-center justify-center mx-auto border border-[#C6E6CE]">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-serif-title text-base font-bold text-[#3B2D19]">
                  ¡Cita Reprogramada con Éxito!
                </h3>
                <p className="text-xs text-[#705E47] mt-1">
                  Tu nuevo turno es el <strong>{formatFullDate(newDate)}</strong> a las <strong>{newTime}</strong>.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href={createWhatsAppRescheduleUrl(appointment, formatFullDate(newDate), newTime)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 px-4 rounded-xl font-bold shadow-xs transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Notificar al Centro por WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2 bg-[#ECE0CD] hover:bg-[#E2D2B8] text-[#4A3B22] font-semibold rounded-xl text-xs transition"
                >
                  Aceptar
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
