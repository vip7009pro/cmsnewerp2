// vocImageHelpers.ts - Quản lý bộ đệm và giải quyết đường dẫn ảnh VOC
export const VOC_IMAGE_CACHE = new Map<string, string | null>();

export const getCacheKey = (managementNumber: string, preferredExt?: string, version?: number) => {
  return `${(managementNumber ?? "").trim()}|${preferredExt ?? ""}|${version ?? 0}`;
};

export const normalizeImageExtension = (fileName: string, mimeType?: string) => {
  const rawExtension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (rawExtension === "jpeg") return "jpg";
  if (rawExtension === "jpg" || rawExtension === "png") return rawExtension;
  if (mimeType === "image/png") return "png";
  return "jpg";
};

export const buildImageCandidates = (managementNumber: string, preferredExt?: string, version?: number) => {
  const normalized = (managementNumber ?? "").trim();
  if (!normalized) return ["/SAMPLE.png"];
  const cacheBust = version ? `?v=${version}` : "";
  const preferredCandidates = preferredExt
    ? [`/qtrimage/${normalized}.${preferredExt}${cacheBust}`]
    : [];
  return [
    ...preferredCandidates,
    `/qtrimage/${normalized}.jpg${cacheBust}`,
    `/qtrimage/${normalized}.png${cacheBust}`,
    `/qtrimage/${normalized.toUpperCase()}.jpg${cacheBust}`,
    `/qtrimage/${normalized.toUpperCase()}.png${cacheBust}`,
  ];
};

const probeImage = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const probe = new Image();
    probe.onload = () => resolve(src);
    probe.onerror = () => reject(new Error(`Image not found: ${src}`));
    probe.src = src;
  });

export const resolveVocImage = async (managementNumber: string, preferredExt?: string, version?: number) => {
  const cacheKey = getCacheKey(managementNumber, preferredExt, version);
  if (VOC_IMAGE_CACHE.has(cacheKey)) {
    return VOC_IMAGE_CACHE.get(cacheKey) ?? null;
  }

  const candidates = buildImageCandidates(managementNumber, preferredExt, version);
  const resolved = await Promise.any(candidates.map((candidate) => probeImage(candidate))).catch(() => null);
  VOC_IMAGE_CACHE.set(cacheKey, resolved);
  return resolved;
};
