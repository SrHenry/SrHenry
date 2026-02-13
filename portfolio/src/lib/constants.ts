export const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "github-username";
export const GITHUB_API_BASE =
  process.env.NEXT_PUBLIC_GITHUB_API_BASE ?? "https://api.github.com";
export const GRAVATAR_EMAIL_HASH =
  process.env.NEXT_PUBLIC_GRAVATAR_EMAIL_HASH ?? "your-gravatar-hash";
export const CACHE_TTL =
  Number(process.env.NEXT_PUBLIC_CACHE_TTL) || 24 * 60 * 60 * 1000; // default 24h
export const GITHUB_LINK =
  process.env.NEXT_PUBLIC_GITHUB_LINK ?? "https://github.com/your-username";
export const LINKEDIN_LINK =
  process.env.NEXT_PUBLIC_LINKEDIN_LINK ??
  "https://linkedin.com/in/your-linkedin-id";
export const GITLAB_LINK =
  process.env.NEXT_PUBLIC_GITLAB_LINK ?? "https://gitlab.com/your-username";
export const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "your@email.com";
