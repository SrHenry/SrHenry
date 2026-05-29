import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ReposSection } from "@/components/sections/repos-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TechSection } from "@/components/sections/tech-section";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="flex flex-col gap-16">
      <div id="about">
        <AboutSection />
      </div>
      <div id="stats">
        <StatsSection />
      </div>
      <div id="repos">
        <ReposSection />
      </div>
      <div id="tech">
        <TechSection locale={locale} />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
    </div>
  );
}
