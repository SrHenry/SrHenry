import { getTranslations } from 'next-intl/server';
import { Icon } from '@/components/_shared/icon';

const GITHUB_TROPHY_BASE_URL = 'https://github-profile-trophy.vercel.app/?username=';

// Mock trophy data
const DUMMY_TROPHIES = [
  { count: 5, label: 'camis' },
  { count: 12, label: 'commits' },
  { count: 8, label: 'PRs' },
  { count: 15, label: 'Stars' },
];

export async function TrophySection() {
  const t = await getTranslations('trophy');

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t('title')}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {DUMMY_TROPHIES.map((trophy, index) => (
          <div key={index} className="bg-card rounded-lg p-4 text-center shadow-sm border border-border hover:shadow-md transition-all hover:scale-105">
            <div className="mb-2">
              <div className="text-2xl font-bold mb-1">{trophy.count}</div>
            </div>
            <div className="text-sm text-muted-foreground capitalize">{trophy.label}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        {t('description')}
      </div>
    </section>
  );
}
