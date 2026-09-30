export const sections = ["dashboard", "catalogue", "rights", "usage", "compilations", "settings", "team"] as const;
export type Section = (typeof sections)[number];

export function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

export function initials(value: string | null | undefined) {
  return (value ?? "Pyramid").split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}
