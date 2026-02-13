import { IconName } from "@/components/_shared/icon";
export interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  pushed_at: string;
  size: number;
}

export interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  totalCommits?: number;
  totalPRs?: number;
}

export interface GitHubTrophy {
  rank: string;
  count: number;
  trophy: string;
}

export interface Technology {
  name: string;
  icon: IconName
  color: string;
  category: string;
}

export interface ContactLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}
