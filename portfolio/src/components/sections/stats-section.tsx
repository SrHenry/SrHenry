import { BookOpen, Calendar, GitBranch, Star, UserPlus, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SiGithub } from "react-icons/si";
import { Card } from "@/components/ui/card";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/widgets/animated-section";
import { GITHUB_API_BASE, GITHUB_USERNAME } from "@/lib/constants";

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  created_at: string;
}

interface GitHubApiRepo {
  language: string | null;
  stargazers_count: number;
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-srhenry",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

function computeAccountAge(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

function computeTotalStars(repos: GitHubApiRepo[]): number {
  return Array.isArray(repos) ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0) : 0;
}

function computeTopLanguage(repos: GitHubApiRepo[]): string {
  const counts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
}

const EMPTY_STATS = {
  public_repos: 0,
  followers: 0,
  following: 0,
  gists: 0,
  accountAge: 0,
  totalStars: 0,
  topLanguage: "N/A",
};

async function fetchGitHubStats() {
  try {
    const headers = buildHeaders();
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, { headers, next: { revalidate: 3600 } }),
      fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!userRes.ok) throw new Error(`GitHub API error: ${userRes.status}`);

    const user: GitHubUser = await userRes.json();
    const repos: GitHubApiRepo[] = reposRes.ok ? await reposRes.json() : [];

    return {
      public_repos: user.public_repos || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      gists: user.public_gists || 0,
      accountAge: computeAccountAge(user.created_at),
      totalStars: computeTotalStars(repos),
      topLanguage: computeTopLanguage(repos),
    };
  } catch {
    return EMPTY_STATS;
  }
}

const iconMap = {
  repos: SiGithub,
  stars: Star,
  followers: Users,
  following: UserPlus,
  gists: BookOpen,
  age: Calendar,
  language: GitBranch,
} as const;

type StatKey = keyof typeof iconMap;

const STAT_LINKS: Partial<Record<StatKey, string>> = {
  repos: `https://github.com/${GITHUB_USERNAME}?tab=repositories`,
  followers: `https://github.com/${GITHUB_USERNAME}?tab=followers`,
  following: `https://github.com/${GITHUB_USERNAME}?tab=following`,
  gists: `https://gist.github.com/${GITHUB_USERNAME}`,
};

export async function StatsSection() {
  const t = await getTranslations("stats");
  const stats = await fetchGitHubStats();

  const items: { label: string; value: number | string; key: StatKey }[] = [
    { label: t("repos"), value: stats.public_repos, key: "repos" },
    { label: t("stars"), value: stats.totalStars, key: "stars" },
    { label: t("followers"), value: stats.followers, key: "followers" },
    { label: t("following"), value: stats.following, key: "following" },
    { label: t("gists"), value: stats.gists, key: "gists" },
    { label: t("age"), value: stats.accountAge, key: "age" },
  ];

  return (
    <AnimatedSection>
      <section className="py-12">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">{t("title")}</h2>

        <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => {
            const Icon = iconMap[item.key];
            const display =
              typeof item.value === "number" ? item.value.toLocaleString() : item.value;
            const href = STAT_LINKS[item.key];

            const card = (
              <>
                <div className="mb-3 flex justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-1 text-2xl font-bold md:text-3xl">{display}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </>
            );

            return (
              <StaggerItem key={item.key}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg bg-card p-6 text-center text-card-foreground shadow-sm transition-shadow hover:shadow-md hover:ring-1 hover:ring-primary/30 cursor-pointer no-underline"
                  >
                    {card}
                  </a>
                ) : (
                  <Card className="p-6 text-center">{card}</Card>
                )}
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>
    </AnimatedSection>
  );
}
