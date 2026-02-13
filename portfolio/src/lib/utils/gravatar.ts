export function getGravatarUrl(emailHash: string, size: number = 200): string {
  return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=mp`;
}

export function getGravatarFallback(initials: string): string {
  return `https://ui-avatars.com/api/?name=${initials}&background=random`;
}
