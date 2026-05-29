import {
  Code2,
  ExternalLink,
  GitBranch,
  Mail,
  Monitor,
  Moon,
  Star,
  Sun,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";
import { SiGithub, SiGitlab } from "react-icons/si";
import { LinkedInIcon } from "@/components/_shared/linkedin-icon";

export type IconName =
  | "star"
  | "git-branch"
  | "users"
  | "code"
  | "external-link"
  | "github"
  | "mail"
  | "moon"
  | "sun"
  | "monitor"
  | "linkedin"
  | "gitlab";

const iconMap: Record<IconName, ComponentType<{ className?: string; size?: number | string }>> = {
  star: Star,
  "git-branch": GitBranch,
  users: Users,
  code: Code2,
  "external-link": ExternalLink,
  github: SiGithub,
  mail: Mail,
  moon: Moon,
  sun: Sun,
  monitor: Monitor,
  linkedin: LinkedInIcon,
  gitlab: SiGitlab,
};

interface IconProps {
  name: IconName;
  className?: string;
  size?: number | string;
}

export function Icon({ name, className, size }: IconProps) {
  const Component = iconMap[name];
  return <Component className={className} size={size} />;
}
