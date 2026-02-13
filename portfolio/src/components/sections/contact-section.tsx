import { getTranslations } from 'next-intl/server';
import { GITHUB_LINK, LINKEDIN_LINK, GITLAB_LINK, EMAIL } from '@/lib/constants';

export async function ContactSection() {
  const t = await getTranslations('contact');

  const contactLinks = [
    { name: 'GitHub', url: GITHUB_LINK },
    { name: 'LinkedIn', url: LINKEDIN_LINK },
    { name: 'GitLab', url: GITLAB_LINK },
    { name: 'Email', url: `mailto:${EMAIL}` },
  ];

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          {t('title')}
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          {contactLinks.map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
               className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90">
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
