const mediaBaseUrl =
  import.meta.env.VITE_MEDIA_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  '';

export function getImageUrl(image, options = {}) {
  if (!image) return '';

  const value =
    typeof image === 'object' && image.url
      ? image.url
      : image;

  if (typeof value !== 'string') return '';

  const imageUrl = value.trim();

  if (!imageUrl) return '';

  // Local/bundled assets should be returned untouched.
  if (
    imageUrl.startsWith('/assets/') ||
    imageUrl.startsWith('/src/') ||
    imageUrl.startsWith('data:') ||
    imageUrl.startsWith('blob:')
  ) {
    return imageUrl;
  }

  // Full external URLs, including Cloudinary URLs.
  if (/^https?:\/\//i.test(imageUrl)) {
    return optimizeCloudinaryUrl(imageUrl, options);
  }

  const baseUrl = mediaBaseUrl.replace(/\/$/, '');

  return baseUrl
    ? `${baseUrl}/${imageUrl.replace(/^\//, '')}`
    : imageUrl;
}

function optimizeCloudinaryUrl(url, options = {}) {
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Don't modify a URL that already contains Cloudinary transformations.
  if (url.includes('/image/upload/')) {
    const {
      width = 1200,
      quality = 'auto',
      format = 'auto',
    } = options;

    const transformation = `f_${format},q_${quality},w_${width}`;

    return url.replace(
      '/image/upload/',
      `/image/upload/${transformation}/`,
    );
  }

  return url;
}