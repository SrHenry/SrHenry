export interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  pushed_at: string;
  size: number;
  languageColor?: string;
}

export interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  totalCommits?: number;
  totalPRs?: number;
}
