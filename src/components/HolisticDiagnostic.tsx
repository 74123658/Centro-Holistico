import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, CheckCircle2, ArrowRight, RotateCcw, MessageCircle } from 'lucide-react';
import { THERAPISTS, SERVICES } from '../data/mockData';
import { Therapist, Service } from '../types';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';
import { getTherapistPhoto } from '../utils/therapistPhotos';
import { TherapistAvatar } from './TherapistAvatar';

interface HolisticDiagnosticProps {
  onSelectServiceForBooking: (serviceId: string) => void;
  onSelectTherapistForBooking: (therapistId: string) => void;
}

export const HolisticDiagnostic: React.FC<HolisticDiagnosticProps> = ({
  onSelectServiceForBooking,
  onSelectTherapistForBooking
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [bodyTension, setBodyTension] = useState<number>(5);
  const [result, setResult] = useState<{
    therapist: Therapist;
    services: Service[];
  } | null>(null);

  // Daily Habits
  const [habits, setHabits] = useState<{ [key: string]: boolean }>({
    respiracion: false,
    hidratacion: false,
    gratitud: false,
    pausaActiva: false
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('equilibria_habits_' + new Date().toISOString().slice(0, 10));
      if (saved) setHabits(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const toggleHabit = (key: string) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    try {
      localStorage.setItem('equilibria_habits_' + new Date().toISOString().slice(0, 10), JSON.stringify(updated));
    } catch (e) {}
  };

  const symptomOptions = [
    { id: "estres", label: "Estrés y agotamiento mental", icon: "🧠" },
    { id: "dolor", label: "Dolor muscular / tensión de espalda", icon: "💆" },
    { id: "insomnio", label: "Insomnio o dificultad para descansar", icon: "🌙" },
    { id: "bloqueo", label: "Bloqueos emocionales o familiares", icon: "🕊️" },
    { id: "ansiedad", label: "Ansiedad o tristeza persistente", icon: "🌧️" },
    { id: "energia", label: "Pesadez o carga energética densa", icon: "⚡" },
    { id: "memoria", label: "Falta de concentración o memoria", icon: "🌿" },
    { id: "renovacion", label: "Deseo de desintoxicación y renovación", icon: "🔥" }
  ];

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    let recTherapist = THERAPISTS[0];
    let recServices: Service[] = [];

    if (selectedSymptoms.includes('dolor') || selectedSymptoms.includes('renovacion')) {
      recTherapist = selectedSymptoms.includes('renovacion') ? THERAPISTS[4] : THERAPISTS[3];
      const massage = SERVICES.find(s => s.id === 'masaje-terapeutico');
      if (massage) recServices.push(massage);
      if (selectedSymptoms.includes('renovacion')) {
        const temazcal = SERVICES.find(s => s.id === 'temazcal');
        if (temazcal) recServices.push(temazcal);
      }
    } else if (selectedSymptoms.includes('energia') || selectedSymptoms.includes('ansiedad')) {
      recTherapist = THERAPISTS[1];
      const reiki = SERVICES.find(s => s.id === 'reiki');
      const bach = SERVICES.find(s => s.id === 'flores-bach');
      if (reiki) recServices.push(reiki);
      if (bach) recServices.push(bach);
    } else if (selectedSymptoms.includes('bloqueo')) {
      recTherapist = THERAPISTS[0];
      const constel = SERVICES.find(s => s.id === 'constelaciones');
      const barras = SERVICES.find(s => s.id === 'barras-access');
      if (constel) recServices.push(constel);
      if (barras) recServices.push(barras);
    } else if (selectedSymptoms.includes('memoria')) {
      recTherapist = THERAPISTS[3];
      const neuro = SERVICES.find(s => s.id === 'neuroespacio');
      if (neuro) recServices.push(neuro);
    } else {
      recTherapist = THERAPISTS[2];
      const barras = SERVICES.find(s => s.id === 'barras-access');
      const reiki = SERVICES.find(s => s.id === 'reiki');
      if (barras) recServices.push(barras);
      if (reiki) recServices.push(reiki);
    }

    setResult({
      therapist: recTherapist,
      services: recServices
    });
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F9EED9] via-[#FAF3E6] to-[#F5EAD4] p-4 rounded-2xl border border-[#E5D2B4] shadow-xs text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C702E]">
          Orientador de Bienestar
        </span>
        <h2 className="font-serif-title text-lg font-bold text-[#3B2D19] mt-1">
          ¿Qué necesita tu Ser hoy?
        </h2>
        <p className="text-xs text-[#705E47] mt-0.5 max-w-sm mx-auto">
          Selecciona cómo te sientes o qué deseas trabajar y te mostraremos opciones de bienestar que puedes consultar con Equilibria.
        </p>
      </div>

      {/* Formulario de Evaluación */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EADBCA] shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#57442B] uppercase tracking-wider mb-2">
            1. Selecciona lo que deseas trabajar o explorar:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {symptomOptions.map((sym) => {
              const isSelected = selectedSymptoms.includes(sym.id);
              return (
                <button
                  type="button"
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-[#FAF2E3] border-[#B88746] text-[#3B2D19] ring-1 ring-[#B88746]'
                      : 'bg-[#FDFBF7] border-[#E8DCC9] text-[#695844] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{sym.icon}</span>
                    <span className="text-xs font-medium">{sym.label}</span>
                  </div>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${
                    isSelected ? 'bg-[#5B472A] text-white border-[#5B472A]' : 'border-[#CEBA9E]'
                  }`}>
                    {isSelected ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF5EB] p-3 rounded-xl border border-[#E8DFC9]">
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#5B472A] mb-1">
              <span>Sobrecarga Mental:</span>
              <span className="font-bold text-[#9C702E]">{stressLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full accent-[#5B472A]"
            />
            <div className="flex justify-between text-[10px] text-[#8C765C]">
              <span>Calmo</span>
              <span>Saturado</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#5B472A] mb-1">
              <span>Tensión Física / Dolor:</span>
              <span className="font-bold text-[#9C702E]">{bodyTension}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={bodyTension}
              onChange={(e) => setBodyTension(parseInt(e.target.value))}
              className="w-full accent-[#5B472A]"
            />
            <div className="flex justify-between text-[10px] text-[#8C765C]">
              <span>Ligero</span>
              <span>Contracturado</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={selectedSymptoms.length === 0}
          onClick={handleDiagnose}
          className="w-full py-3 bg-[#4A3B22] hover:bg-[#382C18] disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition"
        >
          {selectedSymptoms.length === 0 ? 'Selecciona al menos 1 necesidad' : 'Ver mi orientación personalizada ✨'}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E6] to-[#F5EAD4] p-4 sm:p-5 rounded-2xl border-2 border-[#D9C199] shadow-xs space-y-4 animate-in fade-in duration-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C702E]">
              Orientación de Bienestar
            </span>
            <h3 className="font-serif-title text-base font-bold text-[#3B2D19] mt-0.5">
              Opciones recomendadas para ti
            </h3>
          </div>

          {/* Terapeuta Asignada */}
          <div className="bg-white p-3.5 rounded-xl border border-[#DECBAF] flex items-center gap-3">
            <TherapistAvatar
              therapistId={result.therapist.id}
              name={result.therapist.name}
              size="md"
              className="border border-[#DFCEB3] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#9C702E] uppercase">Terapeuta sugerida:</span>
              <h4 className="font-bold text-xs text-[#382B18]">{result.therapist.name}</h4>
              <p className="text-[10px] text-[#7A664E] truncate">{result.therapist.title}</p>
            </div>
            <a
  href={createWhatsAppInquiryUrl(
    `Hola, me gustaría recibir información sobre una sesión con ${result.therapist.name}. ¿Me pueden confirmar disponibilidad, fecha y horario?`
  )}
  target="_blank"
  rel="noopener noreferrer"
  className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-semibold rounded-lg shadow-xs transition flex-shrink-0"
>
  Consultar por WhatsApp
</a>
          </div>

          {/* Terapias recomendadas */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7030] block mb-2">
              Terapias sugeridas:
            </span>
            <div className="space-y-2">
              {result.services.map((srv) => (
                <div key={srv.id} className="bg-white p-3 rounded-xl border border-[#DECBAF] flex items-center justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-xs text-[#3B2D19]">{srv.name}</h5>
                    <p className="text-[11px] text-[#73624D]">{srv.desc}</p>
                  </div>
                 <a
  href={createWhatsAppInquiryUrl(
    `Hola, me gustaría recibir información sobre ${srv.name}. ¿Me pueden confirmar disponibilidad, fecha y horario?`
  )}
  target="_blank"
  rel="noopener noreferrer"
  className="px-3 py-1 bg-[#25D366] text-white text-xs font-semibold rounded-lg transition flex-shrink-0"
>
  Consultar por WhatsApp
</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Micro-rutina de autocuidado diaria */}
      <div className="bg-white rounded-2xl p-4 border border-[#EADBCA] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-title font-bold text-sm text-[#382B18]">
              Rutina de Autocuidado Diario
            </h3>
            <p className="text-[11px] text-[#73634F]">
              Pequeños hábitos de paz para sostener tu energía hoy
            </p>
          </div>
          <span className="text-[10px] bg-[#FAF2E3] text-[#9C702E] font-bold px-2 py-0.5 rounded-full border border-[#EADBCA]">
            {Object.values(habits).filter(Boolean).length}/4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: 'respiracion', label: '3 min de respiración consciente', sub: 'Inhala en 4 tiempos, exhala en 6' },
            { key: 'hidratacion', label: '1 vaso de agua con intención', sub: 'Agradece el agua que te purifica' },
            { key: 'gratitud', label: 'Anotar 3 bendiciones de hoy', sub: 'Eleva tu frecuencia vibratoria' },
            { key: 'pausaActiva', label: 'Estirar cuello y hombros', sub: 'Libera la tensión acumulada' }
          ].map((h) => (
            <div
              key={h.key}
              onClick={() => toggleHabit(h.key)}
              className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                habits[h.key]
                  ? 'bg-[#F2F7F2] border-[#81A885]'
                  : 'bg-[#FDFBF7] border-[#EADBCA] hover:bg-white'
              }`}
            >
              <div className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold border ${
                habits[h.key] ? 'bg-[#2E6B47] text-white border-[#2E6B47]' : 'border-[#CEBA9E] bg-white'
              }`}>
                {habits[h.key] ? '✓' : ''}
              </div>
              <div>
                <p className={`text-xs font-semibold ${habits[h.key] ? 'line-through text-[#637565]' : 'text-[#382B18]'}`}>
                  {h.label}
                </p>
                <p className="text-[10px] text-[#85725A]">{h.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
