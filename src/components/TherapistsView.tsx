import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle2, MessageCircle, Calendar, Sparkles, Clock, MapPin, Camera, RotateCcw, ChevronDown, ChevronUp, Image as ImageIcon, ShieldCheck, Eye, FileText, SlidersHorizontal } from 'lucide-react';
import { Therapist } from '../types';
import { THERAPISTS, DISPLAY_PHONE } from '../data/mockData';
import { createWhatsAppInquiryUrl } from '../utils/whatsapp';
import { getTherapistPhoto, saveTherapistPhoto, removeCustomTherapistPhoto, hasCustomTherapistPhoto, getTherapistFlyer, hasCustomTherapistFlyer, autoCropFlyerPortrait, saveTherapistFlyer } from '../utils/therapistPhotos';
import { PhotoCropModal } from './PhotoCropModal';
import { FlyerViewModal } from './FlyerViewModal';
import { BulkPhotoUploader } from './BulkPhotoUploader';
import { TherapistAvatar } from './TherapistAvatar';

interface TherapistsViewProps {
  onSelectTherapistForBooking: (therapistId: string) => void;
}

export const TherapistsView: React.FC<TherapistsViewProps> = ({
  onSelectTherapistForBooking
}) => {
  const [photoUpdateCounter, setPhotoUpdateCounter] = useState(0);
  const [expandedTherapistId, setExpandedTherapistId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppingImageSrc, setCroppingImageSrc] = useState<string | null>(null);
  const [croppingTherapistId, setCroppingTherapistId] = useState<string>('');
  const [croppingTherapistName, setCroppingTherapistName] = useState<string>('');

  // Flyer viewer modal state
  const [viewingFlyerSrc, setViewingFlyerSrc] = useState<string | null>(null);
  const [viewingFlyerName, setViewingFlyerName] = useState<string>('');

  useEffect(() => {
    const handleUpdate = () => {
      setPhotoUpdateCounter(c => c + 1);
    };
    window.addEventListener('equilibria-therapist-photos-updated', handleUpdate);
    return () => {
      window.removeEventListener('equilibria-therapist-photos-updated', handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleFileChange = (therapistId: string, therapistName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido (JPG o PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        // Save as official flyer
        saveTherapistFlyer(therapistId, dataUrl);
        // Open crop modal so user can center the therapist's face easily
        setCroppingImageSrc(dataUrl);
        setCroppingTherapistId(therapistId);
        setCroppingTherapistName(therapistName);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    // Reset input value so re-uploading the same file works
    event.target.value = '';
  };

  const handleResetPhoto = (therapistId: string, therapistName: string) => {
    removeCustomTherapistPhoto(therapistId);
    showToast(`Foto predeterminada restablecida para ${therapistName}.`);
  };

  const handleOpenFlyer = (therapistId: string, therapistName: string) => {
    const flyer = getTherapistFlyer(therapistId);
    if (flyer) {
      setViewingFlyerSrc(flyer);
      setViewingFlyerName(therapistName);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#3B2D19] text-[#FAF5EB] px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-[#C29B27] animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#E6C76E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#F9EED9] via-[#FAF3E6] to-[#F5EAD4] p-4 rounded-2xl border border-[#E5D2B4] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C702E]">
            Círculo de Especialistas
          </span>
          <span className="text-[10px] bg-[#EAF5ED] text-[#2E6B47] px-2 py-0.5 rounded-full font-bold border border-[#D0EBD8]">
            ● Agenda en Vivo
          </span>
        </div>
        <h2 className="font-serif-title text-lg font-bold text-[#3B2D19] mt-1">
          Nuestras Terapeutas Certificadas
        </h2>
        <p className="text-xs text-[#705E47] mt-0.5">
          Especialistas con formación científica, clínica y holística para guiar tu proceso de bienestar integral.
        </p>
      </div>

      {/* Bulk Uploader & Guidance */}
      <BulkPhotoUploader
        onOpenCropModal={(therapistId, therapistName, imageSrc) => {
          setCroppingTherapistId(therapistId);
          setCroppingTherapistName(therapistName);
          setCroppingImageSrc(imageSrc);
          setCropModalOpen(true);
        }}
        onOpenFlyerModal={(therapistId, therapistName) => {
          handleOpenFlyer(therapistId, therapistName);
        }}
        onSuccessToast={(msg) => showToast(msg)}
      />

      {/* Lista de Terapeutas */}
      <div className="space-y-4">
        {THERAPISTS.map((therapist) => {
          const currentPhoto = getTherapistPhoto(therapist.id);
          const isCustom = hasCustomTherapistPhoto(therapist.id);
          const hasFlyer = hasCustomTherapistFlyer(therapist.id);
          const isExpanded = expandedTherapistId === therapist.id;

          return (
            <div
              key={therapist.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EADBCA] shadow-xs hover:border-[#D5C2A5] transition space-y-3"
            >
              {/* Cabecera de terapeuta */}
              <div className="flex items-start gap-3.5">
                <div className="relative flex-shrink-0 group">
                  <TherapistAvatar
                    therapistId={therapist.id}
                    name={therapist.name}
                    size="xl"
                    className="border-2 border-[#EADBCA] shadow-xs"
                  />
                  
                  {/* Botón flotante para subir/cambiar foto */}
                  <button
                    onClick={() => fileInputRefs.current[therapist.id]?.click()}
                    title="Cargar foto real o ficha de terapeuta"
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#4A3B22] text-[#FAF5EB] hover:bg-[#2F2412] flex items-center justify-center shadow-md border-2 border-white transition transform active:scale-90 cursor-pointer"
                    aria-label={`Cambiar foto de ${therapist.name}`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[therapist.id] = el)}
                    onChange={(e) => handleFileChange(therapist.id, therapist.name, e)}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                  />

                  <span className="absolute -top-1 -left-1 text-[8px] font-bold bg-[#4A3B22] text-[#FAF5EB] px-1.5 py-0.2 rounded-md shadow-xs">
                    {therapist.badge}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-serif-title font-bold text-sm sm:text-base text-[#3B2D19]">
                      {therapist.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#9E6D24] font-semibold mt-0.5">
                    {therapist.title}
                  </p>
                  
                  {isCustom ? (
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] bg-[#EAF5ED] text-[#2E6B47] px-2 py-0.5 rounded-full font-bold border border-[#D0EBD8] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2E6B47]" />
                        Foto Real Verificada
                      </span>
                      <button
                        onClick={() => {
                          setCroppingTherapistId(therapist.id);
                          setCroppingTherapistName(therapist.name);
                          setCroppingImageSrc(currentPhoto);
                          setCropModalOpen(true);
                        }}
                        className="text-[10px] text-[#8C6225] hover:text-[#523A16] font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
                        title="Ajustar encuadre"
                      >
                        <SlidersHorizontal className="w-2.5 h-2.5" />
                        Reencuadrar
                      </button>
                      <button
                        onClick={() => handleResetPhoto(therapist.id, therapist.name)}
                        className="text-[10px] text-[#A64B2A] hover:underline flex items-center gap-0.5"
                        title="Restablecer"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        onClick={() => fileInputRefs.current[therapist.id]?.click()}
                        className="text-[10px] bg-[#FFF8EE] text-[#8C6225] px-2 py-0.5 rounded-full font-semibold border border-[#E8D4B5] hover:bg-[#FBEED7] transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3 text-[#8C6225]" />
                        Subir foto real de su ficha
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-[#7A664E] mt-1.5 line-clamp-3 leading-relaxed">
                    {therapist.exp}
                  </p>
                </div>
              </div>

              {/* Lema personal */}
              <div className="bg-[#FAF5EB] p-2.5 rounded-xl border-l-3 border-[#C29B27] text-xs italic text-[#5C4A34]">
                "{therapist.lema}"
              </div>

              {/* Enfoque prioritario */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7030] block">
                  Atención especializada para:
                </span>
                <p className="text-xs text-[#52412E] mt-0.5 leading-relaxed">
                  {therapist.focus}
                </p>
              </div>

              {/* Especialidades Principales */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7030] block mb-1">
                  Disciplinas & Terapias:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {therapist.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#FAF3E6] text-[#5C482C] px-2 py-0.5 rounded-md border border-[#EADBCA]"
                    >
                      • {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sección expandible de credenciales y especialidades complementarias */}
              {(therapist.secondarySpecialties || therapist.accreditations) && (
                <div className="pt-1">
                  <button
                    onClick={() => setExpandedTherapistId(isExpanded ? null : therapist.id)}
                    className="text-[11px] font-bold text-[#8C6225] hover:text-[#5E3F10] flex items-center gap-1 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C29B27]" />
                    <span>{isExpanded ? 'Ocultar trayectoria y terapias complementarias' : 'Ver certificaciones y terapias complementarias'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#FCFAF6] border border-[#ECDDC9] space-y-3 animate-fade-in text-xs text-[#4F3E2B]">
                      {therapist.accreditations && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7030] block mb-1">
                            Acreditaciones & Registros:
                          </span>
                          <ul className="space-y-1 pl-1">
                            {therapist.accreditations.map((acc, i) => (
                              <li key={i} className="text-[11px] flex items-center gap-1.5 text-[#3D2F1E]">
                                <CheckCircle2 className="w-3 h-3 text-[#2E6B47] flex-shrink-0" />
                                <span>{acc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {therapist.secondarySpecialties && therapist.secondarySpecialties.map((group, idx) => (
                        <div key={idx}>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7030] block mb-1">
                            {group.category}:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {group.items.map((item, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-white text-[#523F27] px-2 py-0.5 rounded border border-[#E3D1BA]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Acciones */}
              <div className="pt-3 border-t border-[#F2E7D5] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-[#2E6B47] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#2E6B47]"></span>
                  <span>{therapist.availableToday ? `${therapist.activeSlotsCount} turnos hoy` : 'Agenda semanal'}</span>
                </div>

                <div className="flex items-center gap-2">
                  {hasFlyer && (
                    <button
                      onClick={() => handleOpenFlyer(therapist.id, therapist.name)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#F4EADB] hover:bg-[#EBDEC9] text-[#5C4524] border border-[#DECBAF] transition flex items-center gap-1 text-xs font-semibold"
                      title="Ver Ficha Oficial de Equilibria"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#9C702E]" />
                      <span className="hidden sm:inline">Ver Ficha</span>
                    </button>
                  )}

                  <button
                    onClick={() => fileInputRefs.current[therapist.id]?.click()}
                    className="px-2.5 py-1.5 rounded-xl bg-[#FAF4E8] hover:bg-[#F2E5CE] text-[#4A3B22] border border-[#DECBAF] transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
                    title={isCustom ? "Cambiar foto real" : "Subir foto real"}
                  >
                    <Camera className="w-3.5 h-3.5 text-[#9C702E]" />
                    <span className="hidden sm:inline">{isCustom ? "Cambiar Foto" : "Subir Foto Real"}</span>
                  </button>

                  <a
                    href={createWhatsAppInquiryUrl(`Hola ${therapist.name}, vi tu perfil en Equilibria Club Holístico y me gustaría consultar disponibilidad de agenda contigo.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#FAF4E8] hover:bg-[#F2E5CE] text-[#4A3B22] border border-[#DECBAF] transition"
                    title="WhatsApp con Terapeuta"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  </a>

                  <button
                    onClick={() => onSelectTherapistForBooking(therapist.id)}
                    className="px-3.5 py-1.5 bg-[#4A3B22] hover:bg-[#382C18] text-white text-xs font-bold rounded-xl shadow-xs transition transform active:scale-95"
                  >
                    Agendar Cita
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Photo Crop and Alignment Modal */}
      <PhotoCropModal
        isOpen={cropModalOpen}
        onClose={() => {
          setCropModalOpen(false);
          setCroppingImageSrc(null);
        }}
        imageSrc={croppingImageSrc}
        therapistId={croppingTherapistId}
        therapistName={croppingTherapistName}
        onSaved={(msg) => showToast(msg)}
      />

      {/* Fullscreen Official Flyer Viewer */}
      <FlyerViewModal
        isOpen={!!viewingFlyerSrc}
        onClose={() => setViewingFlyerSrc(null)}
        flyerSrc={viewingFlyerSrc}
        therapistName={viewingFlyerName}
      />

    </div>
  );
};

