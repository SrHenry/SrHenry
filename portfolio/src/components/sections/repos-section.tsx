'use client';

import { useEffect, useState } from 'react';
import { GitHubRepo } from '@/types';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/_shared/icon';
import { ExternalLink } from 'lucide-react';

export function ReposSection() {
  const t = useTranslations('repos');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const cached = localStorage.getItem('cache:repos');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 2 * 60 * 60 * 1000) {
            setRepos(data);
            setIsLoading(false);
            return;
          }
        }

        const response = await fetch('/api/repos');
        if (response.ok) {
          const data = await response.json();
          setRepos(data);
          localStorage.setItem('cache:repos', JSON.stringify({ data, timestamp: Date.now() }));
        }
      } catch (error) {
        console.error('Failed to fetch repos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRepos();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('title')}
        </h2>
        <div className="text-center">{t('loading')}</div>
      </section>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('title')}
        </h2>
        <div className="text-center text-muted-foreground">{t('noRepos')}</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        {t('title')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <div key={repo.name} className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold truncate">{repo.name}</h3>
              {repo.html_url && (
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                   className="text-muted-foreground hover:text-primary ml-2">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {repo.description || t('noDescription')}
            </p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    {repo.language}
                  </span>
                )}
                {repo.stargazers_count > 0 && (
                  <span className="flex items-center gap-1">
                    <Icon name="star" className="w-3 h-3" />
                    {repo.stargazers_count}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
