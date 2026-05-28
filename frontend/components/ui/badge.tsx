import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline" | "success";
}) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border text-foreground",
    success: "bg-emerald-600 text-white",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
