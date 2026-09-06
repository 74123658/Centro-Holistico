import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SERVICES } from '../data/mockData';
import {
  saveServicePhoto,
  hasCustomServicePhoto,
  removeServicePhoto,
  matchServiceFromFileName
} from '../utils/servicePhotos';

interface TherapyPhotoUploaderProps {
  onPhotoUpdated?: (serviceId: string) => void;
  compact?: boolean;
  targetServiceId?: string;
}

export const TherapyPhotoUploader: React.FC<TherapyPhotoUploaderProps> = ({
  onPhotoUpdated,
  compact = false,
  targetServiceId
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(targetServiceId || 'biomagnetismo');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let updatedCount = 0;
    let lastServiceName = '';

    fileList.forEach(file => {
      // If targetServiceId is set, assign to that service. Otherwise match by filename
      const matchedId = targetServiceId || matchServiceFromFileName(file.name) || selectedServiceId;
      const service = SERVICES.find(s => s.id === matchedId);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result && matchedId) {
          saveServicePhoto(matchedId, result);
          updatedCount++;
          lastServiceName = service ? service.name : matchedId;
          
          if (onPhotoUpdated) {
            onPhotoUpdated(matchedId);
          }

          setSuccessMessage(`✓ Imagen aplicada con éxito a "${lastServiceName}"`);
          setTimeout(() => setSuccessMessage(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleReset = (serviceId: string) => {
    removeServicePhoto(serviceId);
    if (onPhotoUpdated) onPhotoUpdated(serviceId);
    setSuccessMessage(`Imagen restablecida al original.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Compact trigger button for a single card or modal
  if (compact && targetServiceId) {
    const isCustom = hasCustomServicePhoto(targetServiceId);
    return (
      <div className="relative inline-block">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jfif,.webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-[#4A3B22] text-white hover:bg-[#382B18] shadow-xs transition cursor-pointer"
            title="Subir foto real para esta terapia"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCustom ? 'Actualizar foto' : 'Cambiar foto'}</span>
          </button>
          {isCustom && (
            <button
              type="button"
              onClick={() => handleReset(targetServiceId)}
              className="p-1 text-[#8C765C] hover:text-[#4A3B22] transition"
              title="Restablecer a imagen predeterminada"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Full banner / Drop zone for uploading files (e.g. biomagnerismo.jfif, danzaterapia.jpg, etc.)
  return (
    <div className="bg-[#FAF5EB] border border-[#DECBAF] rounded-2xl p-4 mb-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#4A3B22] text-white">
              <Camera className="w-4 h-4" />
            </span>
            <h3 className="font-serif-title font-bold text-sm text-[#382B18]">
              Subir Fotos Reales de las Terapias
            </h3>
          </div>
          <p className="text-xs text-[#6E5D49] mt-0.5">
            Arrastra o selecciona tus imágenes (ej. <span className="font-medium text-[#4A3B22]">biomagnerismo.jfif</span>, <span className="font-medium text-[#4A3B22]">flores-bach</span>, <span className="font-medium text-[#4A3B22]">pendulo hebreo</span>, etc.). Se asignarán automáticamente.
          </p>
        </div>

        {/* Selector de servicio en caso de querer forzar a una terapia específica */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <label className="text-[11px] text-[#7A644A] font-semibold">Terapia destino:</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="text-xs bg-white border border-[#DECBAF] rounded-lg px-2 py-1 text-[#382B18] focus:outline-none focus:ring-1 focus:ring-[#8C6424]"
          >
            {SERVICES.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} {hasCustomServicePhoto(s.id) ? '✓' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zona Drag & Drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center ${
          dragActive
            ? 'border-[#8C6424] bg-[#EFE4D2]'
            : 'border-[#DECBAF] bg-white/60 hover:bg-white hover:border-[#8C6424]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jfif,.webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-10 h-10 rounded-full bg-[#F4EDE0] text-[#5B472A] flex items-center justify-center mb-2 shadow-2xs">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-[#382B18]">
          Haz clic para subir tu foto o arrastra tus archivos aquí
        </p>
        <p className="text-[11px] text-[#8C765C] mt-0.5">
          Soporta formatos JPG, PNG, WEBP y JFIF
        </p>
      </div>

      {/* Mensaje de confirmación */}
      {successMessage && (
        <div className="mt-3 p-2.5 bg-[#EAF5ED] border border-[#BDE3CA] text-[#1E5C38] rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Lista rápida de terapias con estado de foto */}
      <div className="mt-3 pt-2.5 border-t border-[#EDE1CF] flex items-center gap-2 overflow-x-auto text-[11px] text-[#6E5D49]">
        <span className="font-semibold text-[#382B18] whitespace-nowrap">Fotos personalizadas:</span>
        {SERVICES.slice(0, 6).map(s => {
          const custom = hasCustomServicePhoto(s.id);
          return (
            <span
              key={s.id}
              onClick={() => {
                setSelectedServiceId(s.id);
                fileInputRef.current?.click();
              }}
              className={`px-2 py-0.5 rounded-md whitespace-nowrap cursor-pointer transition border ${
                custom
                  ? 'bg-[#EAF5ED] text-[#1E5C38] border-[#BDE3CA] font-medium'
                  : 'bg-white/80 text-[#7A644A] border-[#DECBAF] hover:bg-white'
              }`}
              title={`Haz clic para cambiar foto de ${s.name}`}
            >
              {custom ? '✓ ' : '+ '}{s.name.split(' ')[0]} {s.name.split(' ')[1] || ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
