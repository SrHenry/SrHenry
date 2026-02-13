import { Icon } from '@/components/_shared/icon';

import type { IconName } from '@/components/_shared/icon';

type Technology = {
  name: string;
  icon: IconName;
  category: string;
};

const technologies: Technology[] = [
  { name: 'TypeScript', icon: 'code', category: 'Language' },
  { name: 'JavaScript', icon: 'code', category: 'Language' },
  { name: 'Node.js', icon: 'code', category: 'Runtime' },
  { name: 'Next.js', icon: 'code', category: 'Framework' },
];

export function TechSection() {
  const categories = [...new Set(technologies.map(tech => tech.category))];

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Technologies
      </h2>
      
      <div className="space-y-8">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-xl font-semibold mb-4 text-primary">{category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {technologies
                .filter(tech => tech.category === category)
                .map(tech => (
                  <div key={tech.name} className="bg-card rounded-lg p-4 text-center shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="mb-2 flex justify-center">
                      <Icon name={tech.icon} className="w-8 h-8 text-primary" />
                    </div>
                    <div className="font-medium text-sm">{tech.name}</div>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
