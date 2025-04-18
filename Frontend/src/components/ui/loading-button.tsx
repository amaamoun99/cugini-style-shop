import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@radix-ui/react-dropdown-menu";
import { VariantProps } from "class-variance-authority";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
  VariantProps<typeof Button> {
  isLoading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | undefined;
  size?: "default" | "sm" | "lg" | "icon" | undefined;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    children, 
    isLoading = false, 
    loadingText, 
    startIcon, 
    endIcon, 
    className,
    variant,
    size,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "relative", 
          isLoading && "cursor-not-allowed",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
        
        <span className={cn("flex items-center gap-1", isLoading && "invisible")}>
          {startIcon && <span>{startIcon}</span>}
          {loadingText && isLoading ? loadingText : children}
          {endIcon && <span>{endIcon}</span>}
        </span>
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
