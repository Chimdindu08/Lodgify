export const areas = ["All areas", "Ifite Road", "Behind Main Gate", "Amawbia Road", "Amansea", "Express Gate"];
export const roomTypes = ["All types", "Self-contained", "Single room", "Flat share", "Mini flat"];
export const studentLevels = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "Postgraduate"];

export function money(value: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);
}

export function date(value: string): string {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function initials(name: string): string {
  return name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}
