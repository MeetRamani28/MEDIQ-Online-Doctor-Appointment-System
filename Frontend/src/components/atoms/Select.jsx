import clsx from "clsx";

const Select = ({ label, error, className = "", children, ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}

      <div
        className={clsx(
          "relative rounded-xl border bg-white transition-all",
          "focus-within:ring-2",
          error
            ? "border-red-500 focus-within:ring-red-300"
            : "border-slate-300 focus-within:ring-[#00B894]/30 focus-within:border-[#00B894]",
          className
        )}
      >
        <select
          {...props}
          className="w-full appearance-none bg-transparent py-3 px-4 pr-10 outline-none text-slate-800"
        >
          {children}
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          ▼
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
