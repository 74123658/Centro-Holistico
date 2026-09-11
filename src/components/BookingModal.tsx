import React, { useState } from 'react';
import { X, Check, Calendar as CalendarIcon, Clock, User, Phone, Sparkles, MapPin, Video, AlertCircle, ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import { Service, Therapist, Appointment } from '../types';
import { SERVICES, THERAPISTS, AVAILABLE_TIME_SLOTS } from '../data/mockData';
import { createWhatsAppBookingUrl } from '../utils/whatsapp';
import { getTherapistPhoto } from '../utils/therapistPhotos';
import { TherapistAvatar } from './TherapistAvatar';
import { formatFullDate, getUpcomingDays } from '../utils/dateFormat';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAppointment: (appointment: Appointment) => void;
  preselectedServiceId?: string | null;
  preselectedTherapistId?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSaveAppointment,
  preselectedServiceId,
  preselectedTherapistId
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || SERVICES[0].id);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>(preselectedTherapistId || '');
  const [selectedModality, setSelectedModality] = useState<'Presencial' | 'En línea'>('Presencial');
  
  // Date & Time
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Confirmed Appointment Result
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  // Selected Service info
  const selectedService = SERVICES.find(s => s.id === selectedServiceId) || SERVICES[0];

  // Therapists available for this service
  const matchingTherapists = THERAPISTS.filter(t => 
    selectedService.therapistIds.includes(t.id)
  );

  // Next 7 days for quick date selector with full day, month, year
  const nextDates = getUpcomingDays(7);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    // Reset or auto-select therapist
    const srv = SERVICES.find(s => s.id === serviceId);
    if (srv && srv.therapistIds.length === 1) {
      setSelectedTherapistId(srv.therapistIds[0]);
    } else {
      setSelectedTherapistId('');
    }
    setStep(2);
  };

  const handleTherapistSelect = (therapistId: string) => {
    setSelectedTherapistId(therapistId);
    setStep(3);
  };

  const handleDateTimeConfirm = () => {
    if (!selectedDate || !selectedTime) {
      setValidationError('Por favor selecciona una fecha y un horario.');
      return;
    }
    setValidationError('');
    setStep(4);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      setValidationError('Por favor ingresa tu nombre y número de teléfono.');
      return;
    }

    // Determine therapist
    let therapist = THERAPISTS.find(t => t.id === selectedTherapistId);
    if (!therapist) {
      therapist = matchingTherapists[0] || THERAPISTS[0];
    }

    const uniqueCode = `EQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      code: uniqueCode,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      therapistId: therapist.id,
      therapistName: therapist.name,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      notes: clientNotes.trim() || undefined,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      durationMinutes: selectedService.durationMinutes,
      price: selectedService.price,
      modality: selectedModality
    };

    onSaveAppointment(newAppointment);
    setCreatedAppointment(newAppointment);
    setStep(5);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setCreatedAppointment(null);
    setValidationError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-[#FAF5EB] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col border border-[#DECBAF] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-[#E8DFC9] bg-[#FDFBF7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && step < 5 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="p-1 rounded-full text-[#7E694D] hover:bg-[#F3EBDD] transition mr-1"
                aria-label="Volver al paso anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A07028]">
                {step === 5 ? '¡Listo!' : `Paso ${step} de 4`}
              </span>
              <h2 className="font-serif-title text-base font-bold text-[#3B2D19] leading-tight">
                {step === 1 && 'Selecciona tu Terapia'}
                {step === 2 && 'Elige a tu Terapeuta'}
                {step === 3 && 'Fecha y Horario en Vivo'}
                {step === 4 && 'Tus Datos de Contacto'}
                {step === 5 && 'Cita Confirmada con Éxito'}
              </h2>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-[#7E694D] hover:text-[#3C2E1B] hover:bg-[#EADBCA] transition"
            aria-label="Cerrar ventana de agendamiento"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* PASO 1: SELECCIONAR SERVICIO */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-[#736048]">
                Elige el servicio holístico que deseas agendar. Todos incluyen acompañamiento consciente y aromaterapia.
              </p>

              <div className="space-y-2.5">
                {SERVICES.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => handleServiceSelect(srv.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      selectedServiceId === srv.id
                        ? 'bg-white border-[#B88746] shadow-xs ring-1 ring-[#B88746]'
                        : 'bg-[#FDFBF7] border-[#EADBCA] hover:bg-white hover:border-[#D0BD9F]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#F3E6D0] text-[#7E571E]">
                          {srv.category}
                        </span>
                        {srv.popular && (
                          <span className="text-[10px] font-semibold text-[#2E6B47] flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" /> Popular
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-[#382B18] mt-1">{srv.name}</h4>
                      <p className="text-[11px] text-[#73634F] line-clamp-1 mt-0.5">{srv.desc}</p>
                      
                      <div className="flex items-center gap-3 text-[11px] text-[#8C765C] mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#B88746]" />
                          {srv.durationMinutes} min
                        </span>
                        {srv.price ? (
                          <span className="font-bold text-[#3B2D19]">
                            ${srv.price} MXN
                          </span>
                        ) : null}
                        <span className="text-[10px] text-[#2E6B47] font-medium bg-[#EAF5ED] px-1.5 py-0.5 rounded">
                          Turno prox: {srv.nextSlotTime}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#A89379] flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: SELECCIONAR TERAPEUTA */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl border border-[#EADBCA] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#9A7030] font-bold uppercase">Servicio seleccionado:</span>
                  <h4 className="text-xs font-bold text-[#3B2D19]">{selectedService.name}</h4>
                </div>
                {selectedService.price ? (
                  <span className="text-xs font-bold text-[#4A3B22] bg-[#F4E9D6] px-2.5 py-1 rounded-lg">
                    ${selectedService.price} MXN
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-[#8C6424] bg-[#FAF3E6] border border-[#EADBCA] px-2 py-0.5 rounded-md">
                    Costo por confirmar
                  </span>
                )}
              </div>

              <p className="text-xs text-[#736048]">
                Selecciona la especialista con quien deseas tomar tu sesión:
              </p>

              {/* Opción primera disponible */}
              <div
                onClick={() => handleTherapistSelect('')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  selectedTherapistId === ''
                    ? 'bg-white border-[#B88746] ring-1 ring-[#B88746]'
                    : 'bg-[#FDFBF7] border-[#EADBCA] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6E5433] to-[#4A3B22] text-white flex items-center justify-center font-bold text-xs">
                    ★
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#382B18]">Cualquier terapeuta disponible</h4>
                    <p className="text-[11px] text-[#7A6953]">Te asignaremos el horario más próximo sin demoras</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A89379]" />
              </div>

              {/* Lista de terapeutas que ofrecen este servicio */}
              <div className="space-y-2 pt-1">
                {matchingTherapists.map((therapist) => (
                  <div
                    key={therapist.id}
                    onClick={() => handleTherapistSelect(therapist.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      selectedTherapistId === therapist.id
                        ? 'bg-white border-[#B88746] shadow-xs ring-1 ring-[#B88746]'
                        : 'bg-[#FDFBF7] border-[#EADBCA] hover:bg-white hover:border-[#D0BD9F]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <TherapistAvatar
                        therapistId={therapist.id}
                        name={therapist.name}
                        size="md"
                        className="border border-[#DFCEB3] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-[#382B18]">{therapist.name}</h4>
                        </div>
                        <p className="text-[11px] text-[#8C6F3D] font-medium">{therapist.title}</p>
                        <p className="text-[10px] text-[#73624D] line-clamp-1 mt-0.5 italic">"{therapist.lema}"</p>
                        <span className="inline-block text-[10px] text-[#2E6B47] bg-[#EAF5ED] px-1.5 py-0.5 rounded font-semibold mt-1">
                          {therapist.availableToday ? '● Disponible hoy' : 'Agenda abierta'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A89379] flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: FECHA, HORARIO Y MODALIDAD */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Modalidad */}
              <div>
                <label className="block text-[11px] font-bold text-[#57442B] uppercase tracking-wider mb-2">
                  Modalidad de atención:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedModality('Presencial')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      selectedModality === 'Presencial'
                        ? 'bg-[#4A3B22] text-white border-[#4A3B22]'
                        : 'bg-[#FDFBF7] text-[#695742] border-[#E5D7C2] hover:bg-white'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Presencial (Pachuca)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedModality('En línea')}
                    disabled={selectedService.modality === 'Presencial'}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      selectedModality === 'En línea'
                        ? 'bg-[#4A3B22] text-white border-[#4A3B22]'
                        : selectedService.modality === 'Presencial'
                        ? 'bg-[#EFE9DF] text-[#A69784] border-[#E0D7C9] cursor-not-allowed opacity-60'
                        : 'bg-[#FDFBF7] text-[#695742] border-[#E5D7C2] hover:bg-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>En Línea (Zoom)</span>
                  </button>
                </div>
                {selectedService.modality === 'Presencial' && (
                  <p className="text-[10px] text-[#8C765C] mt-1">
                    * {selectedService.name} se realiza exclusivamente en las instalaciones de Pachuca.
                  </p>
                )}
              </div>

              {/* Selector de Fechas Rápido */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-[#57442B] uppercase tracking-wider">
                    Selecciona la fecha (Día, Mes y Año):
                  </label>
                  <span className="text-[10px] text-[#8C6D37] font-semibold">
                    Año {new Date().getFullYear()}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {nextDates.map((item) => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setSelectedDate(item.dateStr)}
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

                {/* Selección personalizada de fecha en calendario */}
                <div className="mt-2.5 p-2 bg-[#F8F1E4] rounded-xl border border-[#DECBAF] flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#8C6424] shrink-0" />
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-[#6B512C]">
                      O elige cualquier otra fecha en el calendario:
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => {
                        if (e.target.value) setSelectedDate(e.target.value);
                      }}
                      className="mt-0.5 w-full bg-white px-2 py-1 text-xs border border-[#DECBAF] rounded-lg text-[#3B2D19] focus:outline-none focus:ring-1 focus:ring-[#5B472A]"
                    />
                  </div>
                </div>
              </div>

              {/* Selector de Horarios en Tiempo Real */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-[#57442B] uppercase tracking-wider">
                    Turnos disponibles para el {formatFullDate(selectedDate)}:
                  </label>
                  <span className="text-[10px] text-[#2E6B47] font-semibold flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B47] animate-ping"></span>
                    En tiempo real
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-[#5B472A] text-white border-[#5B472A] shadow-xs'
                            : 'bg-white border-[#E5D7C2] text-[#4A3B22] hover:bg-[#FAF4E8]'
                        }`}
                      >
                        <span>{slot.time}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : slot.status === 'limited'
                            ? 'bg-[#FDEED9] text-[#A65B17]'
                            : 'bg-[#EAF5ED] text-[#2E6B47]'
                        }`}>
                          {slot.status === 'limited' ? 'Último cupo' : 'Libre'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {validationError && (
                <div className="p-2.5 rounded-lg bg-[#FDEEEB] text-[#A63422] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleDateTimeConfirm}
                className="w-full py-3 bg-[#4A3B22] hover:bg-[#382C18] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition"
              >
                Continuar con mis datos →
              </button>
            </div>
          )}

          {/* PASO 4: DATOS DEL PACIENTE */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              {/* Resumen del agendamiento */}
              <div className="bg-white p-3.5 rounded-xl border border-[#DECBAF] space-y-1.5 text-xs text-[#52412B]">
                <div className="flex justify-between font-bold text-[#3B2D19]">
                  <span>{selectedService.name}</span>
                  {selectedService.price ? (
                    <span>${selectedService.price} MXN</span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#8C6424] bg-[#FAF3E6] border border-[#EADBCA] px-2 py-0.5 rounded-md">
                      Costo por confirmar
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#7A664E]">
                  <span>📅 {formatFullDate(selectedDate)} a las {selectedTime}</span>
                  <span>•</span>
                  <span>📍 {selectedModality}</span>
                </div>
                <div className="text-[11px] text-[#8C7043] font-medium">
                  Terapeuta: {THERAPISTS.find(t => t.id === selectedTherapistId)?.name || 'Asignación automática'}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#57442B] mb-1">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#998369]" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. María Fernanda Morales"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DAC9AF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B472A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57442B] mb-1">
                    Teléfono celular (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-[#998369]" />
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 771 123 4567"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DAC9AF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B472A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57442B] mb-1">
                    Correo electrónico (opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DAC9AF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B472A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#57442B] mb-1">
                    Motivo de consulta o intención personal (opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Dolores lumbares recurrentes, estrés por trabajo..."
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DAC9AF] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B472A]"
                  />
                </div>
              </div>

              {validationError && (
                <div className="p-2.5 rounded-lg bg-[#FDEEEB] text-[#A63422] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#4A3B22] to-[#695333] hover:from-[#3B2D19] hover:to-[#564228] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                Confirmar y Registrar Mi Cita ✨
              </button>
            </form>
          )}
          {/* PASO 5: SOLICITUD PARA CONFIRMAR POR WHATSAPP */}
          {step === 5 && createdAppointment && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-[#EAF5ED] text-[#2E6B47] flex items-center justify-center mx-auto border border-[#C6E6CE]">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#2E6B47] uppercase">
                  Solicitud preparada
                </span>

                <h3 className="font-serif-title text-xl font-bold text-[#3B2D19] mt-1">
                  Confirma tu solicitud por WhatsApp
                </h3>

                <p className="text-xs text-[#705E47] mt-2">
                  Equilibria confirmará directamente la disponibilidad, fecha y horario.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border-2 border-[#D9C199] text-left space-y-2 text-xs text-[#52412B]">
                <div>
                  <span className="text-[10px] text-[#9A7030] font-bold">
                    Servicio solicitado:
                  </span>
                  <p className="font-bold text-[#382B18] text-sm">
                    {createdAppointment.serviceName}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-[#9A7030] font-bold">
                    Terapeuta solicitada:
                  </span>
                  <p className="font-bold text-[#3B2D19]">
                    {createdAppointment.therapistName}
                  </p>
                </div>

                {createdAppointment.price ? (
                  <div className="pt-2 border-t border-[#F0E4D0] flex justify-between items-center">
                    <span className="text-[#856D50]">Inversión:</span>
                    <span className="font-extrabold text-[#3B2D19]">
                      ${createdAppointment.price} MXN
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={createWhatsAppBookingUrl(createdAppointment)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Enviar solicitud por WhatsApp
                </a>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 bg-[#ECE0CD] hover:bg-[#E2D2B8] text-[#4A3B22] font-semibold rounded-xl text-xs transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
          

        </div>
      </div>
    </div>
  );
};
