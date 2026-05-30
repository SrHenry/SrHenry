import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/widgets/navbar";
import { routing } from "@/i18n/routing";
import { GITHUB_LINK, GITLAB_LINK, LINKEDIN_LINK, SITE_URL } from "@/lib/constants";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Luis Henrique da Silva Santos",
  alternateName: "SrHenry",
  url: SITE_URL,
  sameAs: [GITHUB_LINK, LINKEDIN_LINK, GITLAB_LINK],
  jobTitle: "Full-Stack Web Developer",
  knowsAbout: ["TypeScript", "Node.js", "React", "Next.js", "Backend Development"],
} as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}`,
      siteName: "SrHenry",
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}`])),
    },
    other: {
      "script:ld+json": JSON.stringify(JSON_LD),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar />
        <main className="container mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          <div className="container mx-auto max-w-4xl px-4">
            &copy; {new Date().getFullYear()} SrHenry. All rights reserved.
          </div>
        </footer>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
