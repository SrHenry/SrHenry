import { GITHUB_GRAPHQL_URL, GITHUB_USERNAME } from "../constants";

const GITHUB_GRAPHQL_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "User-Agent": "portfolio-srhenry",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

interface GraphQLPinnedRepo {
  name: string;
  description: string | null;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string } | null;
  url: string;
  pushedAt: string;
}

interface GraphQLResponse {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: (GraphQLPinnedRepo | null)[];
      };
    };
  };
  errors?: { message: string }[];
}

const PINNED_REPOS_QUERY = `
  query GetPinnedRepos($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            stargazerCount
            primaryLanguage { name color }
            url
            pushedAt
          }
        }
      }
    }
  }
`;

export interface PinnedRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  pushed_at: string;
  size: number;
  languageColor: string;
}

export async function fetchPinnedRepos(): Promise<PinnedRepo[]> {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: GITHUB_GRAPHQL_HEADERS,
    body: JSON.stringify({ query: PINNED_REPOS_QUERY, variables: { username: GITHUB_USERNAME } }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API error: ${response.status} ${response.statusText}`);
  }

  const json: GraphQLResponse = await response.json();

  if (json.errors?.length) {
    throw new Error(`GitHub GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  const nodes = json.data?.user?.pinnedItems?.nodes ?? [];
  return nodes
    .filter((n): n is GraphQLPinnedRepo => n !== null)
    .map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      stargazers_count: repo.stargazerCount || 0,
      language: repo.primaryLanguage?.name || "",
      html_url: repo.url || "",
      pushed_at: repo.pushedAt || "",
      size: 0,
      languageColor: repo.primaryLanguage?.color || "",
    }));
}
