import React from 'react';
import {
  Sparkles,
  MessageCircle,
  Users,
  Compass,
  CalendarDays
} from 'lucide-react';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';

export type TabType =
  | 'servicios'
  | 'citas'
  | 'terapeutas'
  | 'horarios'
  | 'evaluador';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenBooking: () => void;
  activeAppointmentsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab
}) => {
  const navItems = [
    {
      id: 'servicios' as TabType,
      label: 'Servicios',
      icon: Sparkles
    },
    {
      id: 'whatsapp_action',
      label: 'Solicitar',
      icon: MessageCircle,
      isPrimary: true
    },
    {
      id: 'terapeutas' as TabType,
      label: 'Terapeutas',
      icon: Users
    },
    {
      id: 'evaluador' as TabType,
      label: 'Orientador',
      icon: Compass
    },
    {
      id: 'horarios' as TabType,
      label: 'Horarios',
      icon: CalendarDays
    }
  ];

  const openWhatsApp = () => {
    const url = createWhatsAppInquiryUrl(
      'Hola Equilibria, deseo solicitar información para una cita. ¿Me pueden compartir disponibilidad?'
    );

    window.open(url, '_blank');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF5EB]/95 backdrop-blur-md border-t border-[#E8DFC9] pb-safe px-3 py-1 shadow-lg">
      <div className="max-w-3xl lg:max-w-4xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <button
                key="whatsapp_btn"
                onClick={openWhatsApp}
                className="flex flex-col items-center justify-center -mt-4 group focus:outline-none"
                aria-label="Solicitar cita por WhatsApp"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#4A3B22] to-[#6E5433] text-white flex items-center justify-center shadow-md transform group-hover:scale-105 group-active:scale-95 transition">
                  <MessageCircle className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-bold text-[#4A3B22] mt-0.5">
                  Solicitar
                </span>
              </button>
            );
          }

          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id as TabType)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition ${
                isActive
                  ? 'text-[#4A3B22]'
                  : 'text-[#8A765D] hover:text-[#564228]'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive
                    ? 'scale-110 stroke-[2.25]'
                    : 'stroke-[1.75]'
                }`}
              />

              <span
                className={`text-[10px] tracking-tight mt-1 ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A3B22] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
