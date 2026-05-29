export const locales = ["en", "pt-BR"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];

const RTL_LOCALES: Locale[] = [];

export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  if (RTL_LOCALES.includes(locale as Locale)) return "rtl";
  return "ltr";
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function normalizeLocale(rawLocale: string): Locale | null {
  const normalized = rawLocale.toLowerCase().replace("_", "-");

  if (isValidLocale(normalized)) return normalized;

  const [language] = normalized.split("-");
  if (language === "en") return "en";
  if (language === "pt") return "pt-BR";

  return null;
}
