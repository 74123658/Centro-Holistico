import React from 'react';
import { CalendarDays, MessageCircle } from 'lucide-react';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';

type MonthlyEvent = {
  id: string; name: string; date: string; time?: string; duration?: string;
  price?: string; capacity?: string; facilitator?: string; modality?: string;
};

// Agregar aquí únicamente fechas confirmadas por Equilibria.
const MONTHLY_EVENTS: MonthlyEvent[] = [];

export const MonthlyEventsSection: React.FC = () => (
  <section className="mt-8 rounded-2xl border border-[#DECBAF] bg-[#FFFDF8] p-5 sm:p-6">
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2.5 rounded-xl bg-[#EDE2CE] text-[#4A3B22]"><CalendarDays className="w-5 h-5"/></div>
      <div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#9A7030]">Agenda especial</span>
        <h2 className="font-serif-title text-xl font-bold text-[#382B18]">Eventos y Prácticas del Mes</h2>
        <p className="text-xs text-[#6E5D49] mt-1">Las actividades especiales se publican únicamente cuando su fecha está confirmada.</p>
      </div>
    </div>

    {MONTHLY_EVENTS.length ? (
      <div className="grid sm:grid-cols-2 gap-3">
        {MONTHLY_EVENTS.map(event => <article key={event.id} className="p-4 rounded-xl border border-[#EADBCA] bg-white">
          <h3 className="font-bold text-sm text-[#382B18]">{event.name}</h3>
          <p className="text-xs text-[#6E5D49] mt-1">{event.date}{event.time ? ` · ${event.time}` : ''}</p>
          {event.price && <p className="text-xs font-bold text-[#4A3B22] mt-2">{event.price}</p>}
          <a href={createWhatsAppInquiryUrl(`Hola Equilibria, deseo informes sobre *${event.name}* del ${event.date}.`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2E6B47]">
            <MessageCircle className="w-3.5 h-3.5"/> Pedir informes
          </a>
        </article>)}
      </div>
    ) : (
      <div className="p-4 rounded-xl bg-[#FAF4E8] border border-[#EADBCA]">
        <p className="text-xs text-[#5F503D]">Las próximas fechas se confirmarán directamente con Equilibria.</p>
        <a href={createWhatsAppInquiryUrl("Hola Equilibria, ¿me pueden compartir las próximas fechas de eventos y prácticas del mes?")} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#4A3B22] text-white text-xs font-bold">
          <MessageCircle className="w-3.5 h-3.5"/> Consultar próximas fechas
        </a>
      </div>
    )}
  </section>
);
