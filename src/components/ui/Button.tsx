import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-brand hover:bg-brand-dark text-white border-brand",

  secondary:
    "bg-gray-900 hover:bg-black text-white border-gray-900",

  outline:
    "bg-white hover:bg-gray-50 text-gray-900 border-gray-300",

  danger:
    "bg-red-600 hover:bg-red-700 text-white border-red-600",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      variant = "primary",
      loading,
      fullWidth,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
        h-11
        rounded-xl
        border
        px-5
        font-medium
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${styles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
        `}
        {...props}
      >
        {loading ? "Please wait..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";