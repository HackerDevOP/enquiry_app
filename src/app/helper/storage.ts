export function getLocal<T>(key: string): T | null {
  const local = localStorage.getItem(key);
  return local ? (JSON.parse(local) as T) : null;
}

export function setLocal<T>(key: string, obj: T) {
  localStorage.setItem(key, JSON.stringify(obj as T));
}

export function clearLocal() {
  localStorage.clear();
}

export function removeLocal(key: string) {
  localStorage.removeItem(key);
}
