import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Sparkles, FileImage, ShieldCheck, RefreshCw, SlidersHorizontal, AlertCircle, ArrowRight } from 'lucide-react';
import { THERAPISTS } from '../data/mockData';
import {
  matchTherapistFromFileName,
  saveTherapistPhoto,
  saveTherapistFlyer,
  autoCropFlyerPortrait,
  hasCustomTherapistPhoto,
  getTherapistPhoto,
  hasCustomTherapistFlyer,
} from '../utils/therapistPhotos';
import { TherapistAvatar } from './TherapistAvatar';

interface BulkPhotoUploaderProps {
  onOpenCropModal: (therapistId: string, therapistName: string, imageSrc: string) => void;
  onOpenFlyerModal: (therapistId: string, therapistName: string) => void;
  onSuccessToast: (msg: string) => void;
}

export const BulkPhotoUploader: React.FC<BulkPhotoUploaderProps> = ({
  onOpenCropModal,
  onOpenFlyerModal,
  onSuccessToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState<number | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<Array<{ name: string; fileName: string; therapistId: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileList = async (files: FileList | File[]) => {
    setIsProcessing(true);
    setErrorMessage(null);
    const assigned: Array<{ name: string; fileName: string; therapistId: string }> = [];

    const fileArray = Array.from(files);
    let matchedCount = 0;

    for (const file of fileArray) {
      // Check if file is image
      if (!file.type.startsWith('image/') && !file.name.match(/\.(jpe?g|png|webp)$/i)) {
        continue;
      }

      const matchedId = matchTherapistFromFileName(file.name);
      if (!matchedId) continue;

      const therapist = THERAPISTS.find(t => t.id === matchedId);
      if (!therapist) continue;

      try {
        // Read file as Data URL
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // 1. Save as full official flyer
        saveTherapistFlyer(matchedId, dataUrl);

        // 2. Auto-crop portrait for avatar
        const croppedAvatar = await autoCropFlyerPortrait(dataUrl);
        saveTherapistPhoto(matchedId, croppedAvatar);

        assigned.push({
          name: therapist.name,
          fileName: file.name,
          therapistId: matchedId,
        });
        matchedCount++;
      } catch (err) {
        console.error('Error processing file', file.name, err);
      }
    }

    setIsProcessing(false);
    setProcessedCount(matchedCount);
    setRecentAssignments(assigned);

    if (matchedCount > 0) {
      onSuccessToast(`¡Se asignaron con éxito las fotos reales de ${matchedCount} archivo(s)!`);
    } else {
      setErrorMessage(
        'No se identificaron nombres de terapeutas en los archivos seleccionados. Asegúrate de que los archivos contengan: "Virginia", "Nancy", "Rosa", "Alma" o "Mara".'
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(e.target.files);
      // reset input
      e.target.value = '';
    }
  };

  const countLoaded = THERAPISTS.filter(t => hasCustomTherapistPhoto(t.id)).length;

  return (
    <div className="bg-gradient-to-br from-[#FAF5EC] to-[#F3E8D3] rounded-2xl border-2 border-[#D8C2A0] p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3D1BA] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#4A3B22] text-[#F5EAD4] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#E6C76E]" />
          </div>
          <div>
            <h3 className="font-serif-title font-bold text-base text-[#382B18] flex items-center gap-2">
              Fotos Reales y Fichas Oficiales Equilibria
              <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#E8D7BE] text-[#4A3B22] border border-[#D4BF9E]">
                {countLoaded} de 5 cargadas
              </span>
            </h3>
            <p className="text-xs text-[#7A664E]">
              Sin modelos genéricos. Asigna las 11 imágenes adjuntas arrastrándolas todas juntas o seleccionándolas aquí.
            </p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="px-4 py-2 rounded-xl bg-[#4A3B22] hover:bg-[#382B18] text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E6C76E]" />
              Procesando imágenes...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 text-[#E6C76E]" />
              Seleccionar Archivos Adjuntos
            </>
          )}
        </button>
      </div>

      {/* Hidden Multi-file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.jpeg,.jpg,.png,.webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 select-none ${
          isDragging
            ? 'border-[#B88E28] bg-[#F2E5CD] scale-[0.99]'
            : 'border-[#CBB38F] bg-white/70 hover:bg-white/95 hover:border-[#A88020]'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-[#FAF3E6] border border-[#E3D1BA] flex items-center justify-center text-[#7A5B2B]">
          <FileImage className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#3B2D18]">
            {isDragging
              ? '¡Suelta las imágenes aquí para asignarlas automáticamente!'
              : 'Arrastra aquí las imágenes adjuntas o haz clic para seleccionarlas'}
          </p>
          <p className="text-xs text-[#7A664E] mt-0.5">
            El sistema detecta automáticamente si el archivo corresponde a <strong>Virginia, Nancy, Dra. Rosa, Lic. Alma Erika o Mara</strong> y encuadra su rostro.
          </p>
        </div>
      </div>

      {/* Status or Error Notice */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Status Cards of the 5 Therapists */}
      <div className="space-y-1.5 pt-1">
        <p className="text-xs font-bold text-[#544126] uppercase tracking-wider">
          Estado actual de cada terapeuta en la plataforma:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {THERAPISTS.map((t) => {
            const hasPhoto = hasCustomTherapistPhoto(t.id);
            const hasFlyer = hasCustomTherapistFlyer(t.id);
            const photoUrl = getTherapistPhoto(t.id);

            return (
              <div
                key={t.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                  hasPhoto
                    ? 'bg-[#F2F7F2] border-[#A8D3A8]'
                    : 'bg-white border-[#E0D0BB]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <TherapistAvatar
                    therapistId={t.id}
                    name={t.name}
                    size="md"
                    className="border border-[#D8C2A0]"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#3B2D18] truncate">
                      {t.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {hasPhoto ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Foto Real Cargada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Emblema Oficial
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick actions for this therapist */}
                <div className="flex items-center gap-1 shrink-0">
                  {hasFlyer && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFlyerModal(t.id, t.name);
                      }}
                      className="p-1.5 rounded-lg bg-[#FAF4E8] hover:bg-[#EADBCA] text-[#6E542C] border border-[#DECBAF] transition"
                      title="Ver Ficha Oficial Completa"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {hasPhoto && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCropModal(t.id, t.name, photoUrl);
                      }}
                      className="p-1.5 rounded-lg bg-[#FAF4E8] hover:bg-[#EADBCA] text-[#6E542C] border border-[#DECBAF] transition"
                      title="Reencuadrar rostro"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
