/**
 * imgproxy utility for Veedibox
 * Service URL: http://149.102.155.247:8080
 */

const IMGPROXY_URL = process.env.NEXT_PUBLIC_IMGPROXY_URL || "http://149.102.155.247:8080";

type ResizeType = "fit" | "fill" | "auto";

interface ImgProxyOptions {
  width?: number;
  height?: number;
  resizing_type?: ResizeType;
  blur?: number;
  quality?: number;
}

/**
 * Generates an insecure imgproxy URL for a given image.
 * Format: http://imgproxy-url/insecure/resize:width:height:resizing_type/blur:blur/q:quality/plain/source-url
 */
export const getOptimizedImageUrl = (sourceUrl: string, options: ImgProxyOptions = {}) => {
  const {
    width = 0,
    height = 0,
    resizing_type = "fill",
    blur = 0,
    quality = 80,
  } = options;

  let processingOptions = "";

  if (width > 0 || height > 0) {
    processingOptions += `/rs:${resizing_type}:${width}:${height}:0`;
  }

  if (blur > 0) {
    processingOptions += `/bl:${blur}`;
  }

  if (quality < 100) {
    processingOptions += `/q:${quality}`;
  }

  // Base64 encode the source URL if needed, or use plain
  // For simplicity and matching the user's example, we use plain
  return `${IMGPROXY_URL}/insecure${processingOptions}/plain/${sourceUrl}`;
};
