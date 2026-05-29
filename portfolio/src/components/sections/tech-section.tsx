import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { AnimatedSection } from "@/components/widgets/animated-section";
import { getLocaleDirection } from "@/lib/i18n/config";

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

interface Technology {
  name: string;
  deviconDir: string;
  deviconFile: string;
  category: "languages" | "runtime" | "frameworks" | "databases" | "tools";
  invertDark?: boolean;
  bgWhite?: boolean;
}

const technologies: Technology[] = [
  {
    name: "TypeScript",
    deviconDir: "typescript",
    deviconFile: "typescript-original",
    category: "languages",
  },
  {
    name: "JavaScript",
    deviconDir: "javascript",
    deviconFile: "javascript-original",
    category: "languages",
  },
  { name: "PHP", deviconDir: "php", deviconFile: "php-original", category: "languages" },
  { name: "C#", deviconDir: "csharp", deviconFile: "csharp-original", category: "languages" },
  { name: "HTML5", deviconDir: "html5", deviconFile: "html5-original", category: "languages" },
  { name: "CSS3", deviconDir: "css3", deviconFile: "css3-original", category: "languages" },
  { name: "Node.js", deviconDir: "nodejs", deviconFile: "nodejs-original", category: "runtime" },
  { name: "Next.js", deviconDir: "nextjs", deviconFile: "nextjs-original", category: "frameworks" },
  { name: "React", deviconDir: "react", deviconFile: "react-original", category: "frameworks" },
  { name: "NestJS", deviconDir: "nestjs", deviconFile: "nestjs-original", category: "frameworks" },
  {
    name: "AdonisJS",
    deviconDir: "adonisjs",
    deviconFile: "adonisjs-original",
    category: "frameworks",
    bgWhite: true,
  },
  {
    name: "ASP.NET",
    deviconDir: "dot-net",
    deviconFile: "dot-net-original",
    category: "frameworks",
  },
  {
    name: "Laravel",
    deviconDir: "laravel",
    deviconFile: "laravel-original",
    category: "frameworks",
  },
  {
    name: "Express",
    deviconDir: "express",
    deviconFile: "express-original",
    category: "frameworks",
    invertDark: true,
  },
  {
    name: "PostgreSQL",
    deviconDir: "postgresql",
    deviconFile: "postgresql-original",
    category: "databases",
  },
  {
    name: "MongoDB",
    deviconDir: "mongodb",
    deviconFile: "mongodb-original",
    category: "databases",
  },
  { name: "Redis", deviconDir: "redis", deviconFile: "redis-original", category: "databases" },
  {
    name: "Microsoft SQL Server",
    deviconDir: "microsoftsqlserver",
    deviconFile: "microsoftsqlserver-original",
    category: "databases",
  },
  { name: "MySQL", deviconDir: "mysql", deviconFile: "mysql-original", category: "databases" },
  {
    name: "MariaDB",
    deviconDir: "mariadb",
    deviconFile: "mariadb-original",
    category: "databases",
  },
  { name: "Docker", deviconDir: "docker", deviconFile: "docker-original", category: "tools" },
  { name: "Git", deviconDir: "git", deviconFile: "git-original", category: "tools" },
  {
    name: "AWS",
    deviconDir: "amazonwebservices",
    deviconFile: "amazonwebservices-plain-wordmark",
    category: "tools",
  },
];

type Category = Technology["category"];

const categoryOrder: Category[] = ["languages", "runtime", "frameworks", "databases", "tools"];

export async function TechSection({ locale }: { locale: string }) {
  const t = await getTranslations("tech");
  const dir = getLocaleDirection(locale);

  return (
    <AnimatedSection>
      <section className="py-12">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">{t("title")}</h2>

        <div className="space-y-8">
          {categoryOrder.map((category) => {
            const techs = technologies.filter((t) => t.category === category);
            if (techs.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="mb-4 text-lg font-semibold text-primary">{t(category)}</h3>
                <Carousel autoScroll autoScrollSpeed={0.4} dir={dir} itemClassName="w-[100px]">
                  {techs.map((tech) => (
                    <Card
                      key={tech.name}
                      className="flex flex-col items-center gap-2 p-4 shadow-sm transition-shadow hover:shadow-lg h-full"
                    >
                      <TechIcon tech={tech} />
                      <span className="text-sm font-medium">{tech.name}</span>
                    </Card>
                  ))}
                </Carousel>
              </div>
            );
          })}
        </div>
      </section>
    </AnimatedSection>
  );
}

function TechIcon({ tech }: { tech: Technology }) {
  const src = `${DEVICON_BASE}/${tech.deviconDir}/${tech.deviconFile}.svg`;
  const alt = `${tech.name} icon`;

  if (tech.bgWhite) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white drop-shadow-md">
        {/* biome-ignore lint/performance/noImgElement: external CDN SVG, incompatible with next/image static export */}
        <img src={src} alt={alt} className="h-7 w-7" loading="lazy" />
      </div>
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: external CDN SVG, incompatible with next/image static export
    <img
      src={src}
      alt={alt}
      className={
        tech.invertDark ? "h-10 w-10 drop-shadow-md dark:invert" : "h-10 w-10 drop-shadow-md"
      }
      loading="lazy"
    />
  );
}
