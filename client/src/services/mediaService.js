const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';

export function getImageUrl(image) {
  if (!image) return '';
  if (typeof image === 'object' && image.url) return image.url;
  if (typeof image === 'string' && image.startsWith('http')) return image;
  return `${mediaBaseUrl}${image}`;
}
