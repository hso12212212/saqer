const STORAGE_KEY = 'al-saqer-my-orders';
const MAX_ENTRIES = 50;

export interface SavedOrderRef {
  id: number;
  phone: string;
  savedAt: string;
}

export function loadMyOrders(): SavedOrderRef[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(
        (x): x is SavedOrderRef =>
          x &&
          typeof x === 'object' &&
          typeof x.id === 'number' &&
          typeof x.phone === 'string',
      )
      .map((x) => ({ ...x, savedAt: x.savedAt ?? new Date().toISOString() }));
  } catch {
    return [];
  }
}

function persist(list: SavedOrderRef[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ENTRIES)));
  } catch {
    /* ignore quota/privacy-mode errors */
  }
}

export function saveMyOrder(ref: Omit<SavedOrderRef, 'savedAt'>): void {
  const list = loadMyOrders().filter((o) => o.id !== ref.id);
  list.unshift({ ...ref, savedAt: new Date().toISOString() });
  persist(list);
}

export function removeMyOrder(id: number): void {
  persist(loadMyOrders().filter((o) => o.id !== id));
}

export function hasMyOrder(id: number): boolean {
  return loadMyOrders().some((o) => o.id === id);
}
