// Phone photos are often 5-15 MB, which is over the 4 MB request limit of the
// hosting platform. Large images are downscaled and re-encoded as JPEG in the
// browser before upload.

export const MAX_UPLOAD_FILE_SIZE = 4 * 1024 * 1024;

const COMPRESS_THRESHOLD = 800 * 1024;
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;

const canvasToBlob = (canvas) =>
  new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });

/*
 * Returns a compressed JPEG File, or the original file when it is already
 * small, is a GIF/SVG, cannot be decoded (e.g. HEIC on most browsers), or
 * when re-encoding would not make it smaller.
 */
export const compressImage = async (file) => {
  if (
    !file ||
    file.size <= COMPRESS_THRESHOLD ||
    !file.type?.startsWith("image/") ||
    file.type === "image/gif" ||
    file.type === "image/svg+xml" ||
    typeof createImageBitmap !== "function"
  ) {
    return file;
  }

  let bitmap;

  try {
    bitmap = await createImageBitmap(file);

    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      return file;
    }

    // JPEG has no alpha channel; paint white behind transparent PNGs.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await canvasToBlob(canvas);

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";

    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    bitmap?.close?.();
  }
};

export const compressImages = (files) =>
  Promise.all(Array.from(files || []).map(compressImage));

export const formatFileSize = (bytes) =>
  `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
