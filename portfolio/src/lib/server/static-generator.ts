import fs from "node:fs/promises";
import path from "node:path";
import { generateBuildCache } from "./cache-generator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://srhenry.github.io";
const LOCALES = ["en", "pt-BR"];

async function generateStaticSeo() {
  const publicDir = path.join(process.cwd(), "public");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${LOCALES.map(
  (locale) => `  <url>
    <loc>${SITE_URL}/${locale}</loc>
    <changefreq>monthly</changefreq>
    <priority>${locale === "en" ? "1.0" : "0.8"}</priority>
  </url>`,
).join("\n")}
</urlset>`;

  const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

  await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemap);
  await fs.writeFile(path.join(publicDir, "robots.txt"), robots);

  console.log("✓ Static SEO files generated (sitemap.xml, robots.txt)");
}

async function main() {
  console.log("Generating static assets...");

  await Promise.all([
    generateBuildCache("repos", async () => {
      const { fetchPinnedRepos } = await import("./github-graphql");
      const repos = await fetchPinnedRepos();
      return repos.map(({ languageColor: _, ...rest }) => rest);
    }),
    generateBuildCache("stats", async () => {
      const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "SrHenry";
      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "portfolio-srhenry",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
      };
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
      const data = await response.json();
      return { public_repos: data.public_repos || 0, followers: data.followers || 0, following: data.following || 0 };
    }),
    generateStaticSeo(),
  ]);

  console.log("Static asset generation complete!");
}

main().catch(console.error);
