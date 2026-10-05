export default function GlassPanel({
  children,
  className = "",
  as: Component = "div",
  soft = false,
  ...props
}) {
  return (
    <Component
      className={`border backdrop-blur-xl ${
        soft
          ? "border-white/70 bg-white/58 shadow-[0_16px_44px_rgba(36,51,45,0.05)]"
          : "border-[#E3E9E5]/90 bg-white/82 shadow-[0_18px_55px_rgba(36,51,45,0.07)]"
      } rounded-[24px] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
