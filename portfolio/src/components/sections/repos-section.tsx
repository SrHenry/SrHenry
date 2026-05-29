import { ExternalLink, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { AnimatedSection } from "@/components/widgets/animated-section";
import { fetchPinnedRepos } from "@/lib/server/github-graphql";
import type { GitHubRepo } from "@/types";

async function readBuildCache(): Promise<GitHubRepo[]> {
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const cacheFile = path.join(process.cwd(), "data", "cache", "repos.json");
    const raw = await fs.readFile(cacheFile, "utf-8");
    const entry = JSON.parse(raw);
    return entry.data ?? [];
  } catch {
    return [];
  }
}

async function getRepos(): Promise<GitHubRepo[]> {
  try {
    return await fetchPinnedRepos();
  } catch {
    return readBuildCache();
  }
}

export async function ReposSection() {
  const t = await getTranslations("repos");
  const repos = await getRepos();

  return (
    <AnimatedSection>
      <section className="py-12">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">{t("title")}</h2>

        {repos.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("noRepos")}</p>
        ) : (
          <Carousel itemClassName="w-[320px] sm:w-[360px]" className="max-w-full">
            {repos.map((repo) => (
              <Card key={repo.name} className="p-6 transition-shadow hover:shadow-md h-full">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="truncate text-lg font-semibold">{repo.name}</h3>
                  {repo.html_url && (
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <p className="mb-4 text-sm text-muted-foreground">
                  {repo.description || t("noDescription")}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: repo.languageColor || "hsl(var(--primary))" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stargazers_count}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </Carousel>
        )}
      </section>
    </AnimatedSection>
  );
}
