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
