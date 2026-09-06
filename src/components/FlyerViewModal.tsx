import React from 'react';
import { X, Download, ShieldCheck } from 'lucide-react';

interface FlyerViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  flyerSrc: string | null;
  therapistName: string;
}

export const FlyerViewModal: React.FC<FlyerViewModalProps> = ({
  isOpen,
  onClose,
  flyerSrc,
  therapistName,
}) => {
  if (!isOpen || !flyerSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1F1A13] max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-[#D8C2A0]/40 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 bg-[#2E2519] border-b border-[#4A3B22] flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E6C76E]" />
            <div>
              <h3 className="font-serif-title font-bold text-sm text-[#F5EAD4]">
                Ficha Oficial Equilibria Club Holístico
              </h3>
              <p className="text-[11px] text-[#C4B296]">{therapistName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flyer Image Container */}
        <div className="p-3 overflow-y-auto flex-1 flex items-center justify-center bg-black/40">
          <img
            src={flyerSrc}
            alt={`Ficha Oficial de ${therapistName}`}
            className="w-full h-auto rounded-xl shadow-lg object-contain max-h-[70vh]"
          />
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#2E2519] border-t border-[#4A3B22] flex items-center justify-between text-xs">
          <span className="text-[#A89880] text-[11px]">
            Documento de Acreditación Oficial
          </span>
          <div className="flex items-center gap-2">
            <a
              href={flyerSrc}
              download={`Ficha_${therapistName.replace(/\s+/g, '_')}.jpeg`}
              className="px-3 py-1.5 rounded-lg bg-[#E6C76E] hover:bg-[#D4B55C] text-[#3B2D19] font-bold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Ficha
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
