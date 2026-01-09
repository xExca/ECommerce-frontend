export function imageUrl(path?: string | null): string {
  if (!path) return "";

  if (path.startsWith("blob:")) return path;

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${normalized}`;
}
