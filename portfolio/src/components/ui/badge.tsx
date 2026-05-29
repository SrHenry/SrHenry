"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    const variantClasses = {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "border border-input bg-background text-foreground",
    };
    return <div ref={ref} className={cn(base, variantClasses[variant], className)} {...props} />;
  },
);
Badge.displayName = "Badge";
