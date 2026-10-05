export default function MetricRow({ title, value, description }) {
  return (
    <div className="group py-8 border-b border-slate-100 transition-all duration-300 hover:px-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#23332e]">
        {value}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}