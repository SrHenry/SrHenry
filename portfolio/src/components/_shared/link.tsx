import Link from 'next/link';
import { LinkHTMLAttributes } from 'react';
import { Icon, IconName } from './icon';

interface CustomLinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost';
  external?: boolean;
  className?: string;
}

export function CustomLink({
  href,
  children,
  icon,
  variant = 'primary',
  external = false,
  className = '',
  ...props
}: CustomLinkProps) {
  const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800',
  }[variant];

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses} ${className}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {icon && <Icon name={icon} className="w-4 h-4" />}
      {children}
    </Link>
  );
}
