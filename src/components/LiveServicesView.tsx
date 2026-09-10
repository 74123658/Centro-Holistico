import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Clock, Star, Users, MapPin, Video, ArrowRight, X, Check, MessageCircle, Heart } from 'lucide-react';
import { Service, ServiceCategory } from '../types';
import { SERVICES, THERAPISTS } from '../data/mockData';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';
import { getTherapistPhoto } from '../utils/therapistPhotos';
import { getServicePhoto } from '../utils/servicePhotos';
import { TherapistAvatar } from './TherapistAvatar';
import { MassageIntakeModal } from './MassageIntakeModal';
import { RentalQuoteSection } from './RentalQuoteSection';
import { MonthlyEventsSection } from './MonthlyEventsSection';

interface LiveServicesViewProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const LiveServicesView: React.FC<LiveServicesViewProps> = ({
  onSelectServiceForBooking
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDetailService, setSelectedDetailService] = useState<Service | null>(null);
  const [showMassageForm, setShowMassageForm] = useState(false);

  const categories: ServiceCategory[] = [
    'Todos',
    'Experiencias',
    'Cuerpo',
    'Mente',
    'Energía',
    'Espíritu',
    'Sistémica',
    'Emocional'
  ];

  // Filtered services
  const filteredServices = useMemo(() => {
    return SERVICES.filter((srv) => {
      const matchCategory = selectedCategory === 'Todos' || srv.category === selectedCategory;
      const matchQuery = 
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.suitableFor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 pb-20">
      
      {/* Header Zen & Live Indicator */}
      <div className="bg-gradient-to-r from-[#F9EED9] via-[#FAF3E6] to-[#F5EAD4] p-4 rounded-2xl border border-[#E5D2B4] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C702E] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E6B47] animate-pulse"></span>
            Catálogo de Terapias
          </span>
          <span className="text-[10px] bg-[#2E6B47] text-white px-2 py-0.5 rounded-full font-bold">
            Pachuca • Presencial & Zoom
          </span>
        </div>
        <h2 className="font-serif-title text-lg font-bold text-[#3B2D19] mt-1">
          Servicios de Bienestar y Sanación
        </h2>
        <p className="text-xs text-[#705E47] mt-0.5">
          Elige una terapia para armonizar cuerpo, mente y energía con especialistas certificadas.
        </p>
      </div>

      {/* Buscador & Filtros de Categoría */}
      <div className="space-y-3 bg-[#FAF3E6]/60 p-3.5 rounded-2xl border border-[#EADBCA]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#998369]" />
          <input
            type="text"
            placeholder="Buscar por nombre, técnica (temazcal, reiki, péndulo, masaje...), síntoma o beneficio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-[#DECBAF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B472A]/40 shadow-2xs text-[#382B18] placeholder-[#9E8B75]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-[#998369] hover:text-[#3B2D19] p-0.5 rounded cursor-pointer"
              title="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categorías envolventes (Nunca se cortan en ningún dispositivo) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A644A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9C702E]" />
              Filtro por Especialidad ({filteredServices.length} de {SERVICES.length} terapias)
            </span>
            {selectedCategory !== 'Todos' && (
              <button
                onClick={() => setSelectedCategory('Todos')}
                className="text-[11px] font-bold text-[#9C702E] hover:text-[#5B472A] underline cursor-pointer"
              >
                Ver Todas ({SERVICES.length})
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = cat === 'Todos' ? SERVICES.length : SERVICES.filter(s => s.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 select-none ${
                    isSelected
                      ? 'bg-[#4A3B22] text-white shadow-sm ring-2 ring-[#9C702E]/50'
                      : 'bg-white border border-[#DECBAF] text-[#695742] hover:bg-[#FAF4E8] hover:border-[#BFAD92]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-[#F2E7D5] text-[#70583A]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Indicador de categoría activa cuando está filtrado */}
      {selectedCategory !== 'Todos' && (
        <div className="flex items-center justify-between bg-[#F4EADB] px-3.5 py-2 rounded-xl border border-[#DECBAF] text-xs text-[#5C4524]">
          <span>
            Mostrando especialidad: <strong>{selectedCategory}</strong> ({filteredServices.length} {filteredServices.length === 1 ? 'servicio disponible' : 'servicios disponibles'})
          </span>
          <button
            onClick={() => setSelectedCategory('Todos')}
            className="text-[11px] font-bold text-[#8C6424] hover:text-[#3B2D19] underline cursor-pointer"
          >
            Quitar filtro
          </button>
        </div>
      )}

      {/* Listado de Servicios */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#EADBCA] space-y-2">
          <p className="text-xs text-[#73634F]">
            No encontramos servicios con los términos "{searchQuery}".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
            className="text-xs font-bold text-[#9C702E] underline cursor-pointer"
          >
            Restablecer filtros y ver todas las terapias
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((srv) => {
            const qualifiedTherapists = THERAPISTS.filter(t => srv.therapistIds.includes(t.id));

            return (
              <div
                key={srv.id}
                onClick={() => setSelectedDetailService(srv)}
                className="bg-white rounded-2xl border border-[#EADBCA] shadow-xs overflow-hidden hover:shadow-md hover:border-[#D5C2A5] transition flex flex-col justify-between group cursor-pointer"
              >
                {/* Imagen con Badges */}
                <div className="relative h-40 overflow-hidden bg-[#EFE7D8]">
                  <img
                    src={getServicePhoto(srv.id, srv.imageUrl)}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#4A3B22] px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
                      {srv.category}
                    </span>
                    {srv.popular && (
                      <span className="text-[10px] font-bold bg-[#D4AF37] text-[#2F2309] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Destacada
                      </span>
                    )}
                  </div>

                  {/* Estado en vivo */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="text-[10px] bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{srv.id.startsWith('constelaciones') ? 'Duración por confirmar' : `${srv.durationMinutes} min`}</span>
                    </span>

                    <span className="text-[10px] font-bold bg-[#2E6B47] text-white px-2 py-0.5 rounded-full shadow-xs">
                      Consultar disponibilidad
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif-title font-bold text-base text-[#382B18] leading-tight group-hover:text-[#8C6424] transition">
                        {srv.name}
                      </h3>
                      {srv.price ? (
                        <div className="text-right flex-shrink-0">
                          <span className="font-extrabold text-sm text-[#382B18]">
                            ${srv.price}
                          </span>
                          <span className="text-[10px] text-[#8C765C] block leading-none">MXN</span>
                        </div>
                      ) : (
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] font-semibold text-[#8C6424] bg-[#FAF3E6] border border-[#EADBCA] px-2 py-0.5 rounded-md block">
                            Costo por confirmar
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-[#6E5D49] line-clamp-2 mt-1">
                      {srv.desc}
                    </p>

                    {/* Beneficio destacado */}
                    <div className="mt-2 text-[11px] text-[#7A644A] bg-[#FAF5EB] p-2.5 rounded-lg border border-[#F0E4D0]">
                      <span className="font-semibold text-[#3B2D19]">Ideal para:</span> {srv.suitableFor}
                    </div>
                  </div>

                  {/* Terapeutas y Botón de Agendar */}
                  <div className="pt-2.5 border-t border-[#F2E7D5] flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-2 overflow-hidden">
                        {qualifiedTherapists.map(t => (
                          <TherapistAvatar
                            key={t.id}
                            therapistId={t.id}
                            name={t.name}
                            size="sm"
                            className="inline-block ring-1 ring-white"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#8A765D] ml-0.5">
                        {qualifiedTherapists.length === 1 ? qualifiedTherapists[0].shortName : `${qualifiedTherapists.length} especialistas`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedDetailService(srv)}
                        className="px-2 py-1.5 text-xs text-[#5B472A] hover:bg-[#FAF4E8] rounded-lg transition cursor-pointer font-medium"
                      >
                        Ver más
                      </button>

                      <button
                        onClick={() => {
                          if (srv.id === 'masaje-terapeutico') {
                            setShowMassageForm(true);
                          } else {
                            window.open(createWhatsAppInquiryUrl(`Hola Equilibria, me interesa *${srv.name}*. ¿Me pueden compartir disponibilidad e información para solicitar una cita?`), '_blank');
                          }
                        }}
                        className="px-3 py-1.5 bg-[#4A3B22] hover:bg-[#382C18] text-white text-xs font-bold rounded-xl shadow-xs transition transform active:scale-95 cursor-pointer"
                      >
                        Agendar
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Ficha Detallada del Servicio */}
      {selectedDetailService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-[#FAF5EB] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col border border-[#DECBAF] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            
            {/* Header del detalle */}
            <div className="relative h-44 overflow-hidden flex-shrink-0 bg-[#EFE7D8]">
              <img
                src={getServicePhoto(selectedDetailService.id, selectedDetailService.imageUrl)}
                alt={selectedDetailService.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5EB] via-black/30 to-black/30"></div>

              <button
                onClick={() => setSelectedDetailService(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#3B2D19] px-2 py-0.5 rounded">
                  {selectedDetailService.category}
                </span>
                <h2 className="font-serif-title text-xl font-bold text-[#3B2D19] mt-1">
                  {selectedDetailService.name}
                </h2>
              </div>
            </div>

            {/* Contenido con scroll */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-[#52412B]">
              
              {/* Metadatos clave */}
              <div className={`grid ${selectedDetailService.price ? 'grid-cols-3' : 'grid-cols-2'} gap-2 text-center bg-white p-3 rounded-xl border border-[#EADBCA]`}>
                <div>
                  <span className="text-[10px] text-[#9A7030] font-semibold block">Duración</span>
                  <span className="font-bold text-xs text-[#382B18]">{selectedDetailService.id.startsWith('constelaciones') ? 'Por confirmar' : `${selectedDetailService.durationMinutes} min`}</span>
                </div>
                {selectedDetailService.price ? (
                  <div>
                    <span className="text-[10px] text-[#9A7030] font-semibold block">Inversión</span>
                    <span className="font-bold text-xs text-[#382B18]">${selectedDetailService.price} MXN</span>
                  </div>
                ) : null}
                <div>
                  <span className="text-[10px] text-[#9A7030] font-semibold block">Modalidad</span>
                  <span className="font-bold text-xs text-[#382B18]">{selectedDetailService.modality}</span>
                </div>
              </div>

              {/* Descripción profunda */}
              <div>
                <h4 className="font-bold text-xs text-[#382B18] uppercase tracking-wider mb-1">
                  Descripción de la Terapia
                </h4>
                <p className="text-xs text-[#6B573F] leading-relaxed">
                  {selectedDetailService.longDesc || selectedDetailService.desc}
                </p>
              </div>

              {/* Beneficios */}
              <div>
                <h4 className="font-bold text-xs text-[#382B18] uppercase tracking-wider mb-2">
                  Beneficios Principales
                </h4>
                <div className="space-y-1.5">
                  {selectedDetailService.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-[#EADBCA]">
                      <Check className="w-3.5 h-3.5 text-[#2E6B47] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#5C4B37]">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terapeutas que imparten */}
              <div>
                <h4 className="font-bold text-xs text-[#382B18] uppercase tracking-wider mb-2">
                  Especialistas Certificadas
                </h4>
                <div className="space-y-2">
                  {THERAPISTS.filter(t => selectedDetailService.therapistIds.includes(t.id)).map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#EADBCA]">
                      <TherapistAvatar
                        therapistId={t.id}
                        name={t.name}
                        size="md"
                        className="border border-[#DFCEB3] shrink-0"
                      />
                      <div className="flex-1">
                        <h5 className="font-bold text-xs text-[#382B18]">{t.name}</h5>
                        <p className="text-[10px] text-[#8C6F3D]">{t.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción final */}
              <div className="pt-2 border-t border-[#DECBAF] flex gap-2">
                <a
                  href={createWhatsAppInquiryUrl(`Hola Equilibria, tengo dudas sobre el servicio de ${selectedDetailService.name}. ¿Podrían orientarme?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 bg-[#FAF4E8] hover:bg-[#F2E5CE] text-[#4A3B22] border border-[#DECBAF] font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Preguntar</span>
                </a>

                <button
                  onClick={() => {
                    const srv = selectedDetailService;
                    setSelectedDetailService(null);
                    if (srv.id === 'masaje-terapeutico') {
                      setShowMassageForm(true);
                    } else {
                      window.open(createWhatsAppInquiryUrl(`Hola Equilibria, me interesa *${srv.name}*. ¿Me pueden compartir disponibilidad e información para solicitar una cita?`), '_blank');
                    }
                  }}
