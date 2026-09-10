import React, { useMemo, useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';

interface Props { onClose: () => void; }

export const MassageIntakeModal: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState({
    name:'', age:'', allergy:'No', allergyDetail:'', condition:'No', conditionDetail:'',
    implant:'No', implantDetail:'', medication:'No', medicationDetail:'', needs:[] as string[],
    workOn:'', intensity:'5', music:'Sí', musicType:'Relajante', aromatherapy:'No', aroma:'',
    consent:false
  });
  const set = (key:string, value:any) => setForm(prev => ({...prev, [key]:value}));
  const toggleNeed = (v:string) => set('needs', form.needs.includes(v) ? form.needs.filter(x=>x!==v) : [...form.needs,v]);

  const message = useMemo(() => `Hola Equilibria, deseo solicitar información para una cita de *Masaje Holístico*.

*Nombre:* ${form.name}
*Edad:* ${form.age}
*Alergias:* ${form.allergy}${form.allergy === 'Sí' ? ` — ${form.allergyDetail}` : ''}
*Condición o padecimiento médico:* ${form.condition}${form.condition === 'Sí' ? ` — ${form.conditionDetail}` : ''}
*Implante:* ${form.implant}${form.implant === 'Sí' ? ` — ${form.implantDetail}` : ''}
*Medicamentos:* ${form.medication}${form.medication === 'Sí' ? ` — ${form.medicationDetail}` : ''}
*Necesidad:* ${form.needs.join(', ') || 'Sin especificar'}
*Desea trabajar:* ${form.workOn || 'Sin especificar'}
*Intensidad:* ${form.intensity}/10
*Música:* ${form.music}${form.music === 'Sí' ? ` — ${form.musicType}` : ''}
*Aromaterapia:* ${form.aromatherapy}${form.aromatherapy === 'Sí' ? ` — Aroma: ${form.aroma || 'por definir'}` : ''}

¿Me pueden compartir disponibilidad?`, [form]);

  const yesNo = (key:string, label:string, detailKey?:string, detailPlaceholder?:string) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#4A3B22]">{label}</label>
      <div className="flex gap-2">
        {['No','Sí'].map(v => <button type="button" key={v} onClick={()=>set(key,v)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${form[key as keyof typeof form]===v?'bg-[#4A3B22] text-white':'bg-white text-[#4A3B22] border-[#DECBAF]'}`}>{v}</button>)}
      </div>
      {detailKey && form[key as keyof typeof form] === 'Sí' && <input value={form[detailKey as keyof typeof form] as string}
        onChange={e=>set(detailKey,e.target.value)} placeholder={detailPlaceholder}
        className="w-full p-2.5 rounded-xl border border-[#DECBAF] text-xs bg-white" />}
    </div>
  );

  return <div className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center p-3">
    <div className="bg-[#FFFDF8] w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl">
      <div className="sticky top-0 bg-[#FFFDF8] border-b border-[#EADBCA] p-4 flex justify-between items-center z-10">
        <div><h3 className="font-serif-title font-bold text-xl text-[#382B18]">Cuestionario previo · Masaje Holístico</h3>
        <p className="text-xs text-[#7A644A]">Completa lo necesario antes de solicitar disponibilidad.</p></div>
        <button onClick={onClose}><X className="w-5 h-5"/></button>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Nombre completo *" className="p-2.5 rounded-xl border border-[#DECBAF] text-xs"/>
          <input value={form.age} onChange={e=>set('age',e.target.value)} placeholder="Edad *" inputMode="numeric" className="p-2.5 rounded-xl border border-[#DECBAF] text-xs"/>
        </div>
        {yesNo('allergy','¿Tienes alguna alergia?','allergyDetail','¿Cuál?')}
        {yesNo('condition','¿Tienes alguna condición o padecimiento médico?','conditionDetail','¿Cuál?')}
        {yesNo('implant','¿Tienes algún implante?','implantDetail','¿Cuál?')}
        {yesNo('medication','¿Tomas medicamentos actualmente?','medicationDetail','¿Cuáles y para qué los tomas?')}

        <div><label className="text-xs font-bold text-[#4A3B22]">¿Qué necesitas trabajar? Puedes elegir varias.</label>
          <div className="flex flex-wrap gap-2 mt-2">{['Estrés','Relajación','Dolor o tensión','Cansancio','Emoción','Malestar físico','Otro'].map(v=>
            <button type="button" key={v} onClick={()=>toggleNeed(v)} className={`px-3 py-1.5 rounded-full text-xs border ${form.needs.includes(v)?'bg-[#4A3B22] text-white':'bg-white border-[#DECBAF]'}`}>{v}</button>)}</div>
        </div>
        <textarea value={form.workOn} onChange={e=>set('workOn',e.target.value)} placeholder="Síntoma, emoción o malestar que deseas trabajar" className="w-full p-2.5 rounded-xl border border-[#DECBAF] text-xs min-h-20"/>
        <div><label className="text-xs font-bold text-[#4A3B22]">Intensidad actual: {form.intensity}/10</label>
          <input type="range" min="1" max="10" value={form.intensity} onChange={e=>set('intensity',e.target.value)} className="w-full"/></div>
        {yesNo('music','¿Deseas música durante la sesión?')}
        {form.music==='Sí' && <select value={form.musicType} onChange={e=>set('musicType',e.target.value)} className="w-full p-2.5 rounded-xl border border-[#DECBAF] text-xs"><option>Relajante</option><option>Instrumental</option><option>Sonidos de naturaleza</option><option>Otra</option></select>}
        {yesNo('aromatherapy','¿Deseas aromaterapia?')}
        {form.aromatherapy==='Sí' && <input value={form.aroma} onChange={e=>set('aroma',e.target.value)} placeholder="Aroma preferido" className="w-full p-2.5 rounded-xl border border-[#DECBAF] text-xs"/>}

        <label className="flex gap-2 items-start text-[11px] text-[#6E5D49]">
          <input type="checkbox" checked={form.consent} onChange={e=>set('consent',e.target.checked)} className="mt-0.5"/>
          <span>Autorizo el envío de esta información a Equilibria para atender mi solicitud. Esta información es de orientación y no constituye un diagnóstico médico.</span>
        </label>
        <a href={form.name && form.age && form.consent ? createWhatsAppInquiryUrl(message) : undefined}
          target="_blank" rel="noopener noreferrer"
          aria-disabled={!form.name || !form.age || !form.consent}
          className={`w-full py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 ${form.name && form.age && form.consent?'bg-[#25D366] text-white':'bg-gray-200 text-gray-500 pointer-events-none'}`}>
          <MessageCircle className="w-4 h-4"/> Solicitar disponibilidad por WhatsApp
        </a>
      </div>
    </div>
  </div>;
};
