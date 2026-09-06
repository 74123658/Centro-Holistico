import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Check, MessageCircle } from 'lucide-react';
import { WEEKLY_CLASSES, DISPLAY_PHONE } from '../data/mockData';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';
import { getNextDateForSchedule } from '../utils/dateFormat';

export const WeeklyScheduleView: React.FC = () => {
  const [reservedClasses, setReservedClasses] = useState<{ [id: string]: boolean }>({});
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('Todos');

  const days = ['Todos', 'Lunes a Viernes', 'Martes', 'Miércoles', 'Jueves y Viernes'];

  const handleReserve = (classId: string, className: string) => {
    setReservedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId]
    }));
  };

  const filteredClasses = WEEKLY_CLASSES.filter(c => {
    if (selectedDayFilter === 'Todos') return true;
    return c.day.includes(selectedDayFilter);
  });

  return (
    <div className="space-y-4 pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F9EED9] via-[#FAF3E6] to-[#F5EAD4] p-4 rounded-2xl border border-[#E5D2B4] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C702E]">
            Clases Grupales
          </span>
          <span className="text-[10px] bg-[#2E6B47] text-white px-2 py-0.5 rounded-full font-bold">
            Cupo Limitado
          </span>
        </div>
        <h2 className="font-serif-title text-lg font-bold text-[#3B2D19] mt-1">
          Programa Semanal de Bienestar
        </h2>
        <p className="text-xs text-[#705E47] mt-0.5">
          Actividades matutinas y vespertinas para cultivar presencia, movimiento y salud mental en comunidad.
        </p>
      </div>

      {/* Filtros de Día */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDayFilter(day)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedDayFilter === day
                ? 'bg-[#4A3B22] text-white shadow-xs'
                : 'bg-white border border-[#DECBAF] text-[#695742] hover:bg-[#FAF4E8]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Lista de Clases */}
      <div className="space-y-3">
        {filteredClasses.map((cls) => {
          const isReserved = !!reservedClasses[cls.id];
          const availableSpots = isReserved ? cls.spotsRemaining - 1 : cls.spotsRemaining;
          const nextDate = getNextDateForSchedule(cls.day);

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl p-4 border border-[#EADBCA] shadow-xs hover:border-[#D5C2A5] transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-[#FAF3E6] text-[#7E571E] px-2 py-0.5 rounded border border-[#EADBCA]">
                      {cls.category}
                    </span>
                    <span className="text-[11px] font-semibold text-[#8C6D37]">
                      {cls.day}
                    </span>
                  </div>
                  <h3 className="font-serif-title font-bold text-sm text-[#382B18] mt-1">
                    {cls.title}
                  </h3>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  availableSpots <= 2
                    ? 'bg-[#FDEED9] text-[#A65B17]'
                    : 'bg-[#EAF5ED] text-[#2E6B47]'
                }`}>
                  {availableSpots} cupos libres
                </span>
              </div>

              {/* Próxima fecha exacta: Día, Mes y Año */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#2E6B47] font-semibold bg-[#EAF5ED] px-2.5 py-1.5 rounded-xl border border-[#CEEAD6]">
                <Calendar className="w-3.5 h-3.5 text-[#2E6B47] shrink-0" />
                <span>Próxima fecha programada: <strong>{nextDate.fullText}</strong></span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#705E47] bg-[#FAF5EB] p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B88746]" />
                  <span>{cls.time} hrs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#B88746]" />
                  <span className="truncate">{cls.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B88746]" />
                  <span>{cls.room} • Equilibria Pachuca</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <a
                  href={createWhatsAppInquiryUrl(`Hola Equilibria, me interesa pedir informes sobre la clase de ${cls.title} (${cls.day} a las ${cls.time}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#7A644A] hover:text-[#3B2D19] flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Pedir informes</span>
                </a>

                <button
                  onClick={() => handleReserve(cls.id, cls.title)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    isReserved
                      ? 'bg-[#2E6B47] text-white'
                      : 'bg-[#4A3B22] hover:bg-[#382C18] text-white shadow-xs'
                  }`}
                >
                  {isReserved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Lugar Reservado</span>
                    </>
                  ) : (
                    <span>Apartar Lugar</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
