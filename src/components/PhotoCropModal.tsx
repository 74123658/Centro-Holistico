import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Move, Check, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';
import { saveTherapistPhoto, saveTherapistFlyer } from '../utils/therapistPhotos';

interface PhotoCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  therapistId: string;
  therapistName: string;
  onSaved: (message: string) => void;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  therapistId,
  therapistName,
  onSaved,
}) => {
  const [zoom, setZoom] = useState(1.8);
  const [panX, setPanX] = useState(-30);
  const [panY, setPanY] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saveFlyerAsDocument, setSaveFlyerAsDocument] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset positioning when new image is loaded
  useEffect(() => {
    if (isOpen && imageSrc) {
      // In the Equilibria flyers, the portraits are typically in the lower-left or middle-left
      // Default to a zoom and pan that highlights the oval face area
      setZoom(1.9);
      setPanX(-25);
      setPanY(25);
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - panX,
        y: e.touches[0].clientY - panY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanX(e.touches[0].clientX - dragStart.x);
    setPanY(e.touches[0].clientY - dragStart.y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Quick preset buttons for convenience
  const applyPreset = (preset: 'face-lower-left' | 'center' | 'zoom-in') => {
    if (preset === 'face-lower-left') {
      setZoom(2.2);
      setPanX(-35);
      setPanY(35);
    } else if (preset === 'center') {
      setZoom(1.2);
      setPanX(0);
      setPanY(0);
    } else if (preset === 'zoom-in') {
      setZoom(z => Math.min(z + 0.3, 3.5));
    }
  };

  const handleSaveCrop = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const outputSize = 400; // 400x400 clean square avatar
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Viewport box in the modal is 240x240 px
    const viewportSize = 240;
    
    // Scale factor from preview viewport to actual canvas
    const scaleToCanvas = outputSize / viewportSize;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputSize, outputSize);

    // Save and transform context
    ctx.save();
    // Center origin
    ctx.translate(outputSize / 2, outputSize / 2);
    // Apply pan and zoom relative to canvas
    ctx.translate(panX * scaleToCanvas, panY * scaleToCanvas);
    ctx.scale(zoom * scaleToCanvas, zoom * scaleToCanvas);

    // Draw the image centered
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = viewportSize;
    let drawHeight = viewportSize;

    if (imgAspect > 1) {
      drawWidth = viewportSize * imgAspect;
    } else {
      drawHeight = viewportSize / imgAspect;
    }

    ctx.drawImage(
      img,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
    saveTherapistPhoto(therapistId, croppedDataUrl);

    if (saveFlyerAsDocument) {
      // Also save the full original image as the official downloadable / viewable flyer
      saveTherapistFlyer(therapistId, imageSrc);
    }

    onSaved(`¡Foto de perfil actualizada con éxito para ${therapistName}!`);
    onClose();
  };

  return (
    <div
      id="photo-crop-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF6EF] w-full max-w-md rounded-2xl border border-[#D8C2A0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#F5EAD4] to-[#F2E3C6] border-b border-[#E3D1BA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4A3B22] text-[#FAF5EB] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#E6C76E]" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-sm text-[#382B18]">
                Encuadrar Foto de Perfil
              </h3>
              <p className="text-[11px] text-[#7A664E]">{therapistName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#5C482C] flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport & Interactive Canvas Area */}
        <div className="p-4 space-y-3">
          <div className="text-center">
            <p className="text-xs text-[#6A5338]">
              <strong>Arrastra y ajusta el zoom</strong> para centrar el rostro dentro del círculo.
            </p>
          </div>

          {/* Interactive Crop Box */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-64 h-64 mx-auto rounded-2xl bg-[#1C1710] overflow-hidden cursor-grab active:cursor-grabbing border-2 border-[#C29B27] shadow-inner select-none flex items-center justify-center"
          >
            {/* The Image being transformed */}
            <div
              style={{
                transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.05s ease-out',
              }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              <img
                ref={(el) => (imageRef.current = el)}
                src={imageSrc}
                alt="Para recortar"
                className="max-w-none w-64 h-auto object-contain"
                crossOrigin="anonymous"
              />
            </div>

            {/* Circular Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Outer dark mask with circular transparent cutout */}
              <div
                className="w-52 h-52 rounded-full border-2 border-[#E6C76E] shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
                style={{
                  boxShadow: '0 0 0 9999px rgba(18, 14, 9, 0.65)',
                }}
              />
            </div>

            {/* Crosshair indicator */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-4 h-4 border-t border-l border-white" />
              <div className="w-4 h-4 border-t border-r border-white" />
              <div className="w-4 h-4 border-b border-l border-white" />
              <div className="w-4 h-4 border-b border-r border-white" />
            </div>

            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs pointer-events-none flex items-center gap-1">
              <Move className="w-3 h-3" /> Arrastra
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => applyPreset('face-lower-left')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-[#F0E4CE] hover:bg-[#E8D7BD] text-[#4A3B22] rounded-lg border border-[#D8C2A0] transition"
            >
              🎯 Encuadre Óvalo Ficha
            </button>
            <button
              onClick={() => applyPreset('center')}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-[#FAF3E6] text-[#5C482C] rounded-lg border border-[#E0D0BB] transition"
            >
              Centrar
            </button>
            <button
              onClick={() => {
                setPanX(0);
                setPanY(0);
                setZoom(1.5);
              }}
              className="px-2 py-1 text-[11px] text-[#8C6225] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reiniciar
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="bg-white p-3 rounded-xl border border-[#E3D1BA] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#523F27]">
              <span className="flex items-center gap-1 font-semibold">
                <ZoomIn className="w-3.5 h-3.5 text-[#9C702E]" /> Nivel de Zoom:
              </span>
              <span className="font-mono text-[11px] bg-[#FAF3E6] px-2 py-0.5 rounded border border-[#E5D2B4]">
                {zoom.toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-[#8C7152]" />
              <input
                type="range"
                min="0.8"
                max="3.8"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#4A3B22] h-1.5 bg-[#E8DAC5] rounded-lg cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-[#8C7152]" />
            </div>
          </div>

          {/* Checkbox to keep original flyer */}
          <label className="flex items-start gap-2 text-xs text-[#523F27] cursor-pointer bg-[#F5EEDF] p-2.5 rounded-xl border border-[#E5D5BF]">
            <input
              type="checkbox"
              checked={saveFlyerAsDocument}
              onChange={(e) => setSaveFlyerAsDocument(e.target.checked)}
              className="mt-0.5 accent-[#4A3B22] rounded"
            />
            <span>
              <strong>Guardar también la ficha completa</strong> como infografía oficial descargable en el perfil de {therapistName}.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#FAF3E6] border-t border-[#E3D1BA] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#665239] hover:bg-[#EADBCA] rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveCrop}
            className="px-5 py-2 text-xs font-bold bg-[#4A3B22] hover:bg-[#342813] text-white rounded-xl shadow-md flex items-center gap-1.5 transition transform active:scale-95"
          >
            <Check className="w-4 h-4 text-[#E6C76E]" />
            Guardar Foto de Perfil
          </button>
        </div>
      </div>
    </div>
  );
};
