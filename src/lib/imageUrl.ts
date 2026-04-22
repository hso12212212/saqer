const MAX_GALLERY = 5;

/** روابط المعرض (حتى 5) — إن لُوحظت `images` تُستخدم وإلا `image` فقط */
export function productGalleryImages(p: { image: string; images?: string[] }): string[] {
  const raw = p.images;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, MAX_GALLERY);
  }
  return p.image ? [p.image] : [];
}

export function productPrimaryImage(p: { image: string; images?: string[] }): string {
  return productGalleryImages(p)[0] ?? p.image ?? '';
}

/** يعرض رابط المنتج الصحيح: روابط https أو مسارات /uploads من السيرver */
export function productImageSrc(urlOrPath: string): string {
  if (!urlOrPath) return '';
  if (/^https?:\/\//i.test(urlOrPath) || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
  if (urlOrPath.startsWith('/')) return `${base}${urlOrPath}`;
  return urlOrPath;
}
