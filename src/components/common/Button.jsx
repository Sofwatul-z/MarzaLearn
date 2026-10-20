import { forwardRef } from "react";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[15px] px-5 py-3 text-sm font-bold tracking-[-0.01em] transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-[#24332D] text-white shadow-[0_10px_24px_rgba(36,51,45,0.14)] hover:-translate-y-0.5 hover:bg-[#31453C] hover:text-white hover:shadow-[0_14px_30px_rgba(36,51,45,0.18)]",
  secondary:
    "border border-[#D3DDD7] bg-white text-[#24332D] shadow-[0_8px_24px_rgba(36,51,45,0.05)] hover:-translate-y-0.5 hover:border-[#24332D] hover:bg-[#24332D] hover:text-white",
  pastel:
    "border border-[#BBD9CC] bg-[#CFE8DD] text-[#24332D] hover:-translate-y-0.5 hover:bg-[#C3E1D4] hover:text-[#24332D]",
  ghost:
    "bg-transparent text-[#52625B] hover:bg-[#EAF4EF] hover:text-[#24332D]",
  danger:
    "border border-[#E9C8C3] bg-[#FAECE9] text-[#944A40] hover:bg-[#F5DFDB] hover:text-[#944A40]",
  destructive:
    "border border-[#E9C8C3] bg-[#FAECE9] text-[#944A40] hover:bg-[#F5DFDB] hover:text-[#944A40]",
};

const sizes = {
  sm: "min-h-9 rounded-[13px] px-4 py-2 text-xs",
  md: "",
  lg: "min-h-13 rounded-[17px] px-7 py-3.5 text-base",
};

const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "primary",
    size = "md",
    className = "",
    children,
    type,
    theme,
    style = {},
    ...props
  },
  ref
) {
  const buttonType = Component === "button" ? type ?? "button" : undefined;

  let themeStyle = {};
  if (theme) {
    if (variant === "primary") {
      themeStyle = {
        backgroundColor: theme.primaryDark || "#24332D",
        color: "#FFFFFF",
        borderColor: theme.primaryDark || "#24332D",
      };
    } else if (variant === "pastel") {
      themeStyle = {
        backgroundColor: theme.primary || "#CFE8DD",
        color: theme.primaryDark || "#24332D",
        borderColor: theme.borderSoft || theme.border || "#BBD9CC",
      };
    } else if (variant === "secondary") {
      themeStyle = {
        backgroundColor: theme.badgeBg || "rgba(255, 255, 255, 0.85)",
        color: theme.primaryDark || "#24332D",
        borderColor: theme.borderSoft || "#D3DDD7",
      };
    }
  }

  return (
    <Component
      ref={ref}
      type={buttonType}
      style={{ ...themeStyle, ...style }}
      className={`${base} ${variants[variant] ?? variants.primary} ${
        sizes[size] ?? sizes.md
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Button;
