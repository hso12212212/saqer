import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { productImageSrc } from '../lib/imageUrl';

const FADE_MS = 700;
const SLIDE_EVERY_MS = 3000;

type Props = {
  gallery: string[];
  productName: string;
  showDiscount: boolean;
  discountPercent: number;
};

export default function ProductImageGallery({
  gallery,
  productName,
  showDiscount,
  discountPercent,
}: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const safeGallery = gallery.length > 0 ? gallery : [''];
  const n = safeGallery.length;

  useEffect(() => {
    setActive(0);
  }, [gallery.join('|')]);

  useEffect(() => {
    if (n <= 1 || lightbox !== null) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % n);
    }, SLIDE_EVERY_MS);
    return () => clearInterval(id);
  }, [n, lightbox]);

  const openBox = useCallback(
    (index: number) => {
      if (safeGallery[index]) setLightbox(index);
    },
    [safeGallery],
  );

  const closeBox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBox();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeBox]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white sm:rounded-3xl dark:border-ink-800 dark:bg-ink-900">
        <div className="relative aspect-square">
          {safeGallery.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => openBox(i)}
              className={`absolute inset-0 h-full w-full transition-opacity ease-in-out ${
                i === active
                  ? 'z-[1] cursor-zoom-in opacity-100'
                  : 'z-0 pointer-events-none opacity-0'
              }`}
              style={{ transitionDuration: `${FADE_MS}ms` }}
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
              aria-label={
                n > 1
                  ? `صورة ${i + 1} من ${n} — اضغط للتكبير`
                  : 'اضغط للتكبير'
              }
            >
              {url ? (
                <img
                  src={productImageSrc(url)}
                  alt={n > 1 ? `${productName} — ${i + 1}` : productName}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : null}
            </button>
          ))}
          {showDiscount && (
            <span className="chip pointer-events-none absolute right-3 top-3 z-10 bg-rose-500 text-white sm:right-4 sm:top-4">
              خصم {discountPercent}%
            </span>
          )}
        </div>
        {n > 1 && (
          <div
            className="flex items-center justify-center gap-1.5 border-t border-ink-100/80 py-2.5 dark:border-ink-800/80"
            role="tablist"
            aria-label="معاينة الصور"
          >
            {safeGallery.map((url, i) => (
              <button
                key={`dot-${i}-${url}`}
                type="button"
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active
                    ? 'w-6 bg-saqer-600'
                    : 'w-1.5 bg-ink-300 hover:bg-ink-400 dark:bg-ink-600 dark:hover:bg-ink-500'
                }`}
                aria-label={`الصورة ${i + 1}`}
                aria-selected={i === active}
              />
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && safeGallery[lightbox] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal
          aria-label="تكبير الصورة"
          onClick={closeBox}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeBox();
            }}
            className="absolute end-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative z-10 max-h-[min(90vh,900px)] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={productImageSrc(safeGallery[lightbox])}
              alt={productName}
              className="max-h-[min(90vh,900px)] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
