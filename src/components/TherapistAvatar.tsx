import React, { useState } from 'react';
import { Sparkles, Shield, Flower2, Heart, Award } from 'lucide-react';
import { getTherapistPhoto } from '../utils/therapistPhotos';

interface TherapistAvatarProps {
  therapistId: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

const THERAPIST_META: Record<string, { initials: string; icon: React.FC<{ className?: string }>; color: string; ring: string }> = {
  'virginia-altamirano': {
    initials: 'VA',
    icon: Flower2,
    color: 'from-[#6E4B28] to-[#4A3219]',
    ring: 'ring-[#D8B980]',
  },
  'nancy-chanel': {
    initials: 'NC',
    icon: Heart,
    color: 'from-[#7A4526] to-[#542B12]',
    ring: 'ring-[#E6C76E]',
  },
  'rosa-angeles': {
    initials: 'DRA. RV',
    icon: Shield,
    color: 'from-[#2F4A38] to-[#1E3326]',
    ring: 'ring-[#A2C7A8]',
  },
  'alma-erika': {
    initials: 'LIC. AP',
    icon: Sparkles,
    color: 'from-[#4B3C68] to-[#2F2447]',
    ring: 'ring-[#CBB2E8]',
  },
  'mara-alejandra': {
    initials: 'MG',
    icon: Award,
    color: 'from-[#824632] to-[#592D1D]',
    ring: 'ring-[#E3B096]',
  },
};

export const TherapistAvatar: React.FC<TherapistAvatarProps> = ({
  therapistId,
  name,
  className = '',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);
  const photo = getTherapistPhoto(therapistId);
  const meta = THERAPIST_META[therapistId] || {
    initials: name.substring(0, 2).toUpperCase(),
    icon: Sparkles,
    color: 'from-[#4A3B22] to-[#2E2414]',
    ring: 'ring-[#D8C2A0]',
  };
  const IconComponent = meta.icon;

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  }[size];

  const hasPhoto = !!photo && !imgError;

  if (hasPhoto) {
    return (
      <div className={`relative shrink-0 rounded-full overflow-hidden ${sizeClasses} ${className}`}>
        <img
          src={photo}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }

  // Authentic, dignified Monogram Emblem - NO fake stock photos!
  return (
    <div
      className={`relative shrink-0 rounded-full bg-gradient-to-br ${meta.color} text-[#FAF6EF] flex flex-col items-center justify-center font-serif-title font-bold shadow-sm border border-white/20 ring-2 ${meta.ring} ${sizeClasses} ${className}`}
      title={`${name} (Foto real pendiente)`}
    >
      <IconComponent className={`${size === 'xl' ? 'w-5 h-5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} text-[#E6C76E] opacity-90 mb-0.5`} />
      <span className="tracking-wider leading-none text-center px-1 font-semibold">
        {meta.initials}
      </span>
    </div>
  );
};
