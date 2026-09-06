// Utility to handle therapist photos with support for:
// 1. LocalStorage uploaded photos (via direct file select in app)
// 2. Public folder assets (/therapists/[id].jpg)
// 3. Elegant authentic monogram fallback (NEVER fake stock photos)

const PHOTO_STORAGE_KEY_PREFIX = 'equilibria_photo_';
const FLYER_STORAGE_KEY_PREFIX = 'equilibria_flyer_';

export function getTherapistPhoto(therapistId: string, fallbackUrl?: string): string {
  try {
    const saved = localStorage.getItem(`${PHOTO_STORAGE_KEY_PREFIX}${therapistId}`);
    if (saved && saved.startsWith('data:image')) {
      return saved;
    }
  } catch (e) {
    console.error('Error reading saved therapist photo', e);
  }

  // If fallback is a real custom image or not unsplash, use it
  if (fallbackUrl && !fallbackUrl.includes('unsplash.com')) {
    return fallbackUrl;
  }

  // Check if public folder image exists or return empty to trigger authentic monogram
  return '';
}

export function saveTherapistPhoto(therapistId: string, dataUrl: string): void {
  try {
    localStorage.setItem(`${PHOTO_STORAGE_KEY_PREFIX}${therapistId}`, dataUrl);
    window.dispatchEvent(new CustomEvent('equilibria-therapist-photos-updated', { detail: { therapistId } }));
  } catch (e) {
    console.error('Error saving therapist photo', e);
  }
}

export function getTherapistFlyer(therapistId: string): string | null {
  try {
    return localStorage.getItem(`${FLYER_STORAGE_KEY_PREFIX}${therapistId}`);
  } catch (e) {
    console.error('Error reading saved therapist flyer', e);
    return null;
  }
}

export function saveTherapistFlyer(therapistId: string, dataUrl: string): void {
  try {
    localStorage.setItem(`${FLYER_STORAGE_KEY_PREFIX}${therapistId}`, dataUrl);
    window.dispatchEvent(new CustomEvent('equilibria-therapist-photos-updated', { detail: { therapistId } }));
  } catch (e) {
    console.error('Error saving therapist flyer', e);
  }
}

export function removeCustomTherapistPhoto(therapistId: string): void {
  try {
    localStorage.removeItem(`${PHOTO_STORAGE_KEY_PREFIX}${therapistId}`);
    localStorage.removeItem(`${FLYER_STORAGE_KEY_PREFIX}${therapistId}`);
    window.dispatchEvent(new CustomEvent('equilibria-therapist-photos-updated', { detail: { therapistId } }));
  } catch (e) {
    console.error('Error removing custom therapist photo', e);
  }
}

export function hasCustomTherapistPhoto(therapistId: string): boolean {
  try {
    return !!localStorage.getItem(`${PHOTO_STORAGE_KEY_PREFIX}${therapistId}`);
  } catch {
    return false;
  }
}

export function hasCustomTherapistFlyer(therapistId: string): boolean {
  try {
    return !!localStorage.getItem(`${FLYER_STORAGE_KEY_PREFIX}${therapistId}`);
  } catch {
    return false;
  }
}

export function matchTherapistFromFileName(fileName: string): string | null {
  const lower = fileName.toLowerCase();
  if (lower.includes('virginia') || lower.includes('altamirano')) {
    return 'virginia-altamirano';
  }
  if (lower.includes('nancy') || lower.includes('chanel')) {
    return 'nancy-chanel';
  }
  if (
    lower.includes('rosa') ||
    lower.includes('vazquez') ||
    lower.includes('vázquez') ||
    lower.includes('angeles') ||
    lower.includes('ángeles')
  ) {
    return 'rosa-angeles';
  }
  if (lower.includes('alma') || lower.includes('palafox') || lower.includes('erika')) {
    return 'alma-erika';
  }
  if (
    lower.includes('mara') ||
    lower.includes('gomez') ||
    lower.includes('gómez') ||
    lower.includes('arce') ||
    lower.includes('alejandra')
  ) {
    return 'mara-alejandra';
  }
  return null;
}

export function autoCropFlyerPortrait(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 400;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.fillStyle = '#FAF6EF';
      ctx.fillRect(0, 0, size, size);

      // In Equilibria flyers (portrait vertical cards):
      // The therapist's oval headshot is typically positioned in the lower-left to mid-left
      // We take a focused crop targeting this area (approx 15% to 55% from left, 45% to 85% from top)
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if (h > w * 1.1) {
        // Vertical flyer: crop the portrait oval in lower-left quadrant
        const sourceWidth = w * 0.52;
        const sourceHeight = sourceWidth;
        const sourceX = w * 0.04;
        const sourceY = h * 0.48;

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          size,
          size
        );
      } else {
        // Square or landscape flyer: center crop
        const minDim = Math.min(w, h);
        const sourceX = (w - minDim) / 2;
        const sourceY = (h - minDim) / 2;
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          minDim,
          minDim,
          0,
          0,
          size,
          size
        );
      }

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}


