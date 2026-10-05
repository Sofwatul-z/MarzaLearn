import { forwardRef } from "react";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[15px] px-5 py-3 text-sm font-bold tracking-[-0.01em] transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-[#24332D] text-white shadow-[0_10px_24px_rgba(36,51,45,0.14)] hover:-translate-y-0.5 hover:bg-[#31453C] hover:shadow-[0_14px_30px_rgba(36,51,45,0.18)]",
  secondary:
    "border border-[#D3DDD7] bg-white/85 text-[#24332D] shadow-[0_8px_24px_rgba(36,51,45,0.05)] hover:-translate-y-0.5 hover:border-[#B9CBC1] hover:bg-white",
  pastel:
    "border border-[#BBD9CC] bg-[#CFE8DD] text-[#24332D] hover:-translate-y-0.5 hover:bg-[#C3E1D4]",
  ghost:
    "bg-transparent text-[#52625B] hover:bg-[#EAF4EF] hover:text-[#24332D]",
  danger:
    "border border-[#E9C8C3] bg-[#FAECE9] text-[#944A40] hover:bg-[#F5DFDB]",
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
    ...props
  },
  ref
) {
  const buttonType = Component === "button" ? type ?? "button" : undefined;

  return (
    <Component
      ref={ref}
      type={buttonType}
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
