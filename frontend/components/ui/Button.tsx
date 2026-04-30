import Link from "next/link";

type ButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
};

export function Button({
  label,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variants: Record<string, string> = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary",
  };

  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {label}
    </button>
  );
}
