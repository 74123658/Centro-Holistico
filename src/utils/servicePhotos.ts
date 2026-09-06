// Utility to store and retrieve real service/therapy photos uploaded by the user

export const SERVICE_PHOTO_STORAGE_PREFIX = 'equilibria_service_photo_';

export function getServicePhoto(serviceId: string, defaultUrl?: string): string {
  try {
    const saved = localStorage.getItem(`${SERVICE_PHOTO_STORAGE_PREFIX}${serviceId}`);
    if (saved) return saved;
  } catch (e) {
    console.warn('LocalStorage read error for service photo', e);
  }
  return defaultUrl || '';
}

export function saveServicePhoto(serviceId: string, dataUrl: string): void {
  try {
    localStorage.setItem(`${SERVICE_PHOTO_STORAGE_PREFIX}${serviceId}`, dataUrl);
    window.dispatchEvent(new CustomEvent('equilibria_service_photo_updated', {
      detail: { serviceId, dataUrl }
    }));
  } catch (e) {
    console.warn('LocalStorage save error for service photo', e);
  }
}

export function hasCustomServicePhoto(serviceId: string): boolean {
  try {
    return !!localStorage.getItem(`${SERVICE_PHOTO_STORAGE_PREFIX}${serviceId}`);
  } catch (e) {
    return false;
  }
}

export function removeServicePhoto(serviceId: string): void {
  try {
    localStorage.removeItem(`${SERVICE_PHOTO_STORAGE_PREFIX}${serviceId}`);
    window.dispatchEvent(new CustomEvent('equilibria_service_photo_updated', {
      detail: { serviceId }
    }));
  } catch (e) {
    console.warn('LocalStorage remove error for service photo', e);
  }
}

// Helper to match uploaded file names to service IDs
export function matchServiceFromFileName(fileName: string): string | null {
  const norm = fileName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (norm.includes('biomag') || norm.includes('magnet')) {
    return 'biomagnetismo';
  }
  if (norm.includes('pendulo') || norm.includes('hebreo')) {
    return 'pendulo-hebreo';
  }
  if (norm.includes('danza') || norm.includes('somatic')) {
    return 'danzaterapia';
  }
  if (norm.includes('bach') || norm.includes('flor') || norm.includes('microdosis')) {
    return 'flores-bach';
  }
  if (norm.includes('musico') || norm.includes('sonor') || norm.includes('sonido')) {
    return 'musicoterapia';
  }
  if (norm.includes('temazcal')) {
    return 'temazcal';
  }
  if (norm.includes('access') || norm.includes('barra')) {
    return 'barras-access';
  }
  if (norm.includes('reiki') || norm.includes('chakra')) {
    return 'reiki';
  }
  if (norm.includes('constela') || norm.includes('fluvial') || norm.includes('cuantica')) {
    return 'constelaciones';
  }
  if (norm.includes('masaje') || norm.includes('corporal')) {
    return 'masaje-terapeutico';
  }
  if (norm.includes('neuro') || norm.includes('memoria')) {
    return 'neuroespacio';
  }
  if (norm.includes('akashic') || norm.includes('angelic')) {
    return 'registros-akashicos';
  }
  if (norm.includes('biodescod') || norm.includes('hipnosis')) {
    return 'biodescodificacion';
  }
  
  return null;
}
