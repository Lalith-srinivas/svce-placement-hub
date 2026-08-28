import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--navy))] disabled:pointer-events-none disabled:opacity-50",
          size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
          variant === "primary" && "bg-navy text-white hover:bg-navy-light",
          variant === "outline" && "border border-border bg-white text-foreground hover:bg-secondary",
          variant === "ghost" && "text-muted-foreground hover:bg-secondary hover:text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
