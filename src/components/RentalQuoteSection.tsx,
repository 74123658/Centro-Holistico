import React, { useMemo, useState } from 'react';
import { Building2, Coffee, Users, CalendarDays, Clock, MessageCircle } from 'lucide-react';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';

export const RentalQuoteSection: React.FC = () => {
  const [eventType,setEventType]=useState('Desayuno / Coffee Break');
  const [duration,setDuration]=useState('4 horas');
  const [attendees,setAttendees]=useState('');
  const [date,setDate]=useState('');
  const [extras,setExtras]=useState<string[]>([]);
  const [comments,setComments]=useState('');

  const toggle=(v:string)=>setExtras(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const message=useMemo(()=>`Hola Equilibria, deseo cotizar la renta de espacio para un evento.

*Tipo de evento:* ${eventType}
*Duración solicitada:* ${duration}
*Asistentes aproximados:* ${attendees || 'Por definir'}
*Fecha solicitada:* ${date || 'Por definir'}
*Servicios adicionales:* ${extras.join(', ') || 'Ninguno por ahora'}
*Comentarios:* ${comments || 'Sin comentarios'}

¿Me pueden confirmar disponibilidad y compartir la cotización?`,[eventType,duration,attendees,date,extras,comments]);

  return <section className="mt-8 rounded-2xl border border-[#DECBAF] bg-[#FFFDF8] overflow-hidden shadow-sm">
    <div className="p-5 sm:p-6 bg-gradient-to-br from-[#F2E6D2] to-[#FBF6EC]">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-[#4A3B22] text-white"><Building2 className="w-5 h-5"/></div>
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#9A7030]">Empresas, talleres y reuniones</span>
          <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#382B18]">Renta de espacios · Cotiza tu evento</h2>
          <p className="text-xs text-[#6E5D49] mt-1 max-w-2xl">Espacios para eventos holísticos, capacitaciones, desayunos, coffee breaks, conferencias y actividades empresariales. Capacidad máxima de 60 personas. La fecha queda sujeta a confirmación.</p>
        </div>
      </div>
    </div>

    <div className="p-5 sm:p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 text-xs font-bold text-[#4A3B22]">Tipo de evento
          <select value={eventType} onChange={e=>setEventType(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#DECBAF] bg-white font-normal">
            <option>Desayuno / Coffee Break</option><option>Conferencia / Ponencia</option><option>Coffee + Ponencia</option><option>Evento empresarial</option><option>Taller / Capacitación</option><option>Otro</option>
          </select>
        </label>
        <label className="space-y-1.5 text-xs font-bold text-[#4A3B22]">Duración
          <select value={duration} onChange={e=>setDuration(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#DECBAF] bg-white font-normal">
            <option>4 horas</option><option>6 horas</option><option>8 horas</option><option>Día completo</option><option>Otra</option>
          </select>
        </label>
        <label className="space-y-1.5 text-xs font-bold text-[#4A3B22]"><Users className="inline w-3.5 h-3.5 mr-1"/>Asistentes aproximados
          <input type="number" min="1" max="60" value={attendees} onChange={e=>setAttendees(e.target.value)} placeholder="Máximo 60" className="w-full p-2.5 rounded-xl border border-[#DECBAF] bg-white font-normal"/>
        </label>
        <label className="space-y-1.5 text-xs font-bold text-[#4A3B22]"><CalendarDays className="inline w-3.5 h-3.5 mr-1"/>Fecha solicitada
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-[#DECBAF] bg-white font-normal"/>
        </label>
      </div>

      <div>
        <p className="text-xs font-bold text-[#4A3B22] mb-2"><Coffee className="inline w-3.5 h-3.5 mr-1"/>Servicios adicionales</p>
        <div className="flex flex-wrap gap-2">{['Coffee break','Desayuno','Ponencia','Otro'].map(v=><button type="button" key={v} onClick={()=>toggle(v)} className={`px-3 py-1.5 rounded-full text-xs border ${extras.includes(v)?'bg-[#4A3B22] text-white':'bg-white border-[#DECBAF] text-[#5B472A]'}`}>{v}</button>)}</div>
      </div>

      <textarea value={comments} onChange={e=>setComments(e.target.value)} placeholder="Cuéntanos brevemente qué necesitas para tu evento" className="w-full min-h-20 p-3 rounded-xl border border-[#DECBAF] bg-white text-xs"/>

      <div className="rounded-xl bg-[#FAF4E8] border border-[#EADBCA] p-3 text-[11px] text-[#6E5D49]">
        <Clock className="inline w-3.5 h-3.5 mr-1 text-[#9A7030]"/>La renta se cotiza según el servicio solicitado. Se recomienda reservar con al menos una semana de anticipación.
      </div>

      <a href={createWhatsAppInquiryUrl(message)} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
        <MessageCircle className="w-4 h-4"/> Cotizar mi evento por WhatsApp
      </a>
    </div>
  </section>;
};
