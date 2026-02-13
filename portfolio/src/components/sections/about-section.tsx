import { messages } from '@/lib/i18n/config';
import { Icon } from '@/components/_shared/icon';
import { GITHUB_LINK, LINKEDIN_LINK, GRAVATAR_EMAIL_HASH } from '@/lib/constants';
import { getGravatarUrl } from '@/lib/utils/gravatar';

export function AboutSection() {
  const t = messages.en.about;

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center shadow-lg">
          <img 
            src={getGravatarUrl(GRAVATAR_EMAIL_HASH, 160)} 
            alt="SrHenry"
            className="rounded-full"
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t.greeting}
          </h1>
          <h2 className="text-2xl md:text-3xl text-muted">
            {t.role}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.experience}
          </p>
        </div>

        <p className="text-base md:text-lg max-w-2xl text-gray-700 dark:text-gray-300">
          {t.summary}
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer" 
             className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            GitHub
          </a>
          <a href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer"
             className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
