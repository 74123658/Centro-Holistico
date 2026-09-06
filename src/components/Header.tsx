import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Clock, Info, X } from 'lucide-react';
import { DISPLAY_PHONE, ADDITIONAL_PHONES, CENTER_ADDRESS } from '../data/mockData';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';

interface HeaderProps {
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const [showCenterInfo, setShowCenterInfo] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8DFC9] shadow-xs px-4 sm:px-6 py-3">
        <div className="w-full flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E2D2B8] to-[#C9AE85] flex items-center justify-center shadow-xs border border-[#DFCFB7] flex-shrink-0">
              <span className="font-serif-title font-bold text-base text-[#4A3B22] tracking-tighter">EQ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif-title font-bold text-base text-[#3C2E1B] leading-none tracking-tight">
                  Equilibria
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2E6B47] bg-[#EAF5ED] px-1.5 py-0.5 rounded-full border border-[#D0EBD8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B47] animate-pulse"></span>
                  En vivo
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-[#8A714C] uppercase font-medium mt-0.5">
                Club Holístico • Pachuca
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCenterInfo(true)}
              className="p-2 rounded-full text-[#6E5A40] hover:text-[#3C2E1B] hover:bg-[#F3EBDD] transition"
              title="Información del Centro"
              aria-label="Información del centro"
            >
              <Info className="w-4 h-4" />
            </button>

            <a
              href={createWhatsAppInquiryUrl("Hola Equilibria, me comunico desde la app móvil para solicitar informes sobre los servicios y citas.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition transform active:scale-95"
              title="WhatsApp Directo"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="bg-[#4A3B22] hover:bg-[#382C18] text-[#FAF5EB] px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition transform active:scale-95"
            >
              + Cita
            </button>
          </div>
        </div>
      </header>

      {/* Modal Informativo del Centro */}
      {showCenterInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF5EB] rounded-2xl max-w-sm w-full p-5 border border-[#DECBAF] shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCenterInfo(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-[#7E694D] hover:text-[#3C2E1B] hover:bg-[#ECE0CD] transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C702E]">Centro Holístico</span>
              <h3 className="font-serif-title text-lg font-bold text-[#3B2D19] mt-0.5">Equilibria Zen & Garden</h3>
              <p className="text-xs text-[#705E47] italic mt-1">"Regálate un espacio para sentirte bien, reconectar y vivir en armonía."</p>
            </div>

            <div className="space-y-3 text-xs text-[#5C4A33] bg-white p-3.5 rounded-xl border border-[#E9DDC7]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A87935] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#3B2D19]">Ubicación:</span>
                  <p className="text-[11px] text-[#705E47] mt-0.5">{CENTER_ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#A87935] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#3B2D19]">Horarios de Atención:</span>
                  <p className="text-[11px] text-[#705E47] mt-0.5">Lunes a Viernes: 09:00 - 19:00 hrs</p>
                  <p className="text-[11px] text-[#705E47]">Sábados: 09:00 - 15:00 hrs (Temazcal y eventos)</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#2E6B47] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#3B2D19]">Teléfonos directos:</span>
                  <p className="text-[11px] font-bold text-[#2E6B47] mt-0.5">{DISPLAY_PHONE}</p>
                  <p className="text-[10px] text-[#705E47]">{ADDITIONAL_PHONES.join(' • ')}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={`tel:${DISPLAY_PHONE.replace(/\s+/g, '')}`}
                className="flex-1 py-2 rounded-xl bg-[#ECE0CD] hover:bg-[#E2D2B8] text-[#4A3B22] text-xs font-semibold text-center transition"
              >
                Llamar
              </a>
              <a
                href={createWhatsAppInquiryUrl("Hola Equilibria, me gustaría solicitar informes de sus terapias.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-xl bg-[#2E6B47] hover:bg-[#235637] text-white text-xs font-semibold text-center transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
