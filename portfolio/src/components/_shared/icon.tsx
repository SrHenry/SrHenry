import { LucideProps, Star, GitBranch, Users, Code2, ExternalLink, Github, Mail } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconName =
  | 'star'
  | 'git-branch'
  | 'users'
  | 'code'
  | 'external-link'
  | 'github'
  | 'mail';

const iconMap: Record<IconName, ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>> = {
  'star': Star,
  'git-branch': GitBranch,
  'users': Users,
  'code': Code2,
  'external-link': ExternalLink,
  'github': Github,
  'mail': Mail,
};

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

export function Icon({ name, className = '', ...props }: IconProps) {
  const Component = iconMap[name];
  return <Component className={className} {...props} />;
}
