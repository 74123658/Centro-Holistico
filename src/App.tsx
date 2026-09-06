import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { LiveServicesView } from './components/LiveServicesView';
import { AppointmentsManager } from './components/AppointmentsManager';
import { TherapistsView } from './components/TherapistsView';
import { HolisticDiagnostic } from './components/HolisticDiagnostic';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { BookingModal } from './components/BookingModal';
import { RescheduleModal } from './components/RescheduleModal';
import { Appointment } from './types';
import { INITIAL_APPOINTMENTS, DISPLAY_PHONE } from './data/mockData';
import { Smartphone, Monitor, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('servicios');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Appointments State with LocalStorage Persistence
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('equilibria_appointments_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('equilibria_appointments_v1', JSON.stringify(appointments));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [appointments]);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [preselectedTherapistId, setPreselectedTherapistId] = useState<string | null>(null);

  // Reschedule Modal State
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open booking with preselected service
  const handleSelectServiceForBooking = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setPreselectedTherapistId(null);
    setIsBookingModalOpen(true);
  };

  // Open booking with preselected therapist
  const handleSelectTherapistForBooking = (therapistId: string) => {
    setPreselectedTherapistId(therapistId);
    setPreselectedServiceId(null);
    setIsBookingModalOpen(true);
  };

  // Open clean booking modal
  const handleOpenGeneralBooking = () => {
    setPreselectedServiceId(null);
    setPreselectedTherapistId(null);
    setIsBookingModalOpen(true);
  };

  // Save new appointment
  const handleSaveAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    showToast(`¡Cita ${newAppointment.code} registrada con éxito!`);
  };

  // Confirm reschedule
  const handleConfirmReschedule = (appointmentId: string, newDate: string, newTime: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            date: newDate,
            time: newTime,
            status: 'confirmed'
          };
        }
        return apt;
      })
    );
    showToast(`Tu cita ha sido reprogramada para el ${newDate} a las ${newTime}.`);
  };

  // Cancel appointment
  const handleCancelAppointment = (appointmentId: string, reason?: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            status: 'cancelled',
            cancelReason: reason || 'Cancelada por el usuario'
          };
        }
        return apt;
      })
    );
    showToast('La cita ha sido cancelada y el horario liberado.');
  };

  const activeAppointmentsCount = appointments.filter(
    a => a.status === 'confirmed' || a.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-[#F4EDE0] text-[#2C241B] flex flex-col items-center justify-start sm:py-4 selection:bg-[#E2D2B8]">
      
      {/* Selector de modo Vista Amplia / Marco Móvil (Visible en desktop) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-5xl px-3 mb-2 text-xs text-[#7A664E]">
        <div className="flex items-center gap-2">
          <span className="font-serif-title font-bold text-sm text-[#4A3B22]">Equilibria Club Holístico</span>
          <span className="text-[10px] bg-[#E8DFC9] px-2 py-0.5 rounded-full text-[#5B472A] font-semibold">
            Portal & Agenda en Vivo
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFrame(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs transition cursor-pointer text-xs font-semibold ${
              !isMobileFrame
                ? 'bg-[#4A3B22] text-white border-[#382B18]'
                : 'bg-white/80 text-[#5B472A] border-[#DECBAF] hover:bg-white'
            }`}
            title="Vista Amplia Panorámica"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Portada Amplia</span>
          </button>
          <button
            onClick={() => setIsMobileFrame(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs transition cursor-pointer text-xs font-semibold ${
              isMobileFrame
                ? 'bg-[#4A3B22] text-white border-[#382B18]'
                : 'bg-white/80 text-[#5B472A] border-[#DECBAF] hover:bg-white'
            }`}
            title="Vista Móvil de Smartphone"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Marco Móvil</span>
          </button>
        </div>
      </div>

      {/* Contenedor Principal de la App (Portada Amplia por defecto, expandida para máxima visibilidad) */}
      <div className={`w-full bg-[#FAF5EB] flex flex-col relative transition-all duration-300 ${
        isMobileFrame
          ? 'max-w-[420px] rounded-[36px] shadow-2xl border-4 border-[#3B2D19] min-h-[840px] overflow-hidden my-2'
          : 'max-w-5xl min-h-screen sm:rounded-3xl sm:shadow-xl sm:border sm:border-[#DECBAF] my-0 sm:my-2'
      }`}>
        
        {/* Barra superior de smartphone cuando está en marco */}
        {isMobileFrame && (
          <div className="bg-[#3B2D19] text-white px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-medium select-none">
            <span>9:41</span>
            <div className="w-20 h-3.5 bg-[#261C0E] rounded-full mx-auto"></div>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 rounded-xs border border-white flex items-center p-0.5">
                <div className="w-full h-full bg-white rounded-2xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* Encabezado fijo con marca, estado en vivo y botón de contacto */}
        <Header onOpenBooking={handleOpenGeneralBooking} />

        {/* Toast Notifier */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#3B2D19] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 border border-[#6E5533] animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Área de Contenido Principal según el Tab Activo */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'servicios' && (
            <LiveServicesView
              onSelectServiceForBooking={handleSelectServiceForBooking}
            />
          )}

          {activeTab === 'citas' && (
            <AppointmentsManager
              appointments={appointments}
              onOpenBooking={handleOpenGeneralBooking}
              onOpenReschedule={(apt) => setReschedulingAppointment(apt)}
              onCancelAppointment={handleCancelAppointment}
            />
          )}

          {activeTab === 'terapeutas' && (
            <TherapistsView
              onSelectTherapistForBooking={handleSelectTherapistForBooking}
            />
          )}

          {activeTab === 'horarios' && (
            <WeeklyScheduleView />
          )}

          {activeTab === 'evaluador' && (
            <HolisticDiagnostic
              onSelectServiceForBooking={handleSelectServiceForBooking}
              onSelectTherapistForBooking={handleSelectTherapistForBooking}
            />
          )}
        </main>

        {/* Barra de Navegación Móvil Inferior */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          onOpenBooking={handleOpenGeneralBooking}
          activeAppointmentsCount={activeAppointmentsCount}
        />

        {/* Modal Wizard de Agendamiento de Citas */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSaveAppointment={handleSaveAppointment}
          preselectedServiceId={preselectedServiceId}
          preselectedTherapistId={preselectedTherapistId}
        />

        {/* Modal de Reprogramación de Citas */}
        <RescheduleModal
          isOpen={!!reschedulingAppointment}
          appointment={reschedulingAppointment}
          onClose={() => setReschedulingAppointment(null)}
          onConfirmReschedule={handleConfirmReschedule}
        />

      </div>

      {/* Footer discreto */}
      <footer className="mt-3 text-center text-[11px] text-[#8C765C] px-4 hidden sm:block">
        Equilibria Zen & Garden • Pachuca, Hidalgo • WhatsApp: {DISPLAY_PHONE}
      </footer>
    </div>
  );
}
