import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const backgroundVariants = cva("rounded-full flex item-center justify-center", {
  variants: {
    variant: {
      default: "bg-sky-100",
      primary: "bg-primary-500",
      secondary: "bg-secondary-500",
      success: "bg-success-500",
      warning: "bg-warning-500",
      danger: "bg-danger-500",
      info: "bg-info-500",
    },
    size: {
      default: "p-2",
      sm: "p-1",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-sky-700",
      primary: "text-primary-500",
      secondary: "text-secondary-500",
      success: "text-success-500",
      warning: "text-warning-500",
      danger: "text-danger-500",
      info: "text-info-500",
    },
    size: {
      default: "w-8 h-8",
      sm: "w-4 h-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type backgroundVariantProps = VariantProps<typeof backgroundVariants>;
type iconVariantProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends backgroundVariantProps, iconVariantProps {
  icon: LucideIcon;
}

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};
