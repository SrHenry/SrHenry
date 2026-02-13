import { AboutSection } from '@/components/sections/about-section';
import { StatsSection } from '@/components/sections/stats-section';
import { ReposSection } from '@/components/sections/repos-section';
import { TechSection } from '@/components/sections/tech-section';
import { TrophySection } from '@/components/sections/trophy-section';
import { ContactSection } from '@/components/sections/contact-section';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <AboutSection />
      <StatsSection />
      <ReposSection />
      <TechSection />
      <TrophySection />
      <ContactSection />
    </main>
  );
}

