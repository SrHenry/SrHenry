import { messages } from '@/lib/i18n/config';
import { Icon } from '@/components/_shared/icon';

// This will be replaced with real GitHub data
const DUMMY_STATS = {
  repos: 47,
  commits: 2847,
  prs: 156,
  followers: 89
};

export function StatsSection() {
  const t = messages.en.stats;

  const statsItems = [
    {
      label: t.repos,
      value: DUMMY_STATS.repos,
      icon: 'github' as const,
    },
    {
      label: t.commits,
      value: DUMMY_STATS.commits,
      icon: 'git-branch' as const,
    },
    {
      label: t.prs,
      value: DUMMY_STATS.prs,
      icon: 'code' as const,
    },
    {
      label: t.followers,
      value: DUMMY_STATS.followers,
      icon: 'users' as const,
    },
  ];

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t.title}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statsItems.map((item, index) => (
          <div key={index} className="bg-card rounded-lg p-6 text-center shadow-sm border border-border">
            <div className="flex justify-center mb-3">
              <Icon name={item.icon} className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl md:text-3xl font-bold mb-1">
              {item.value.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
