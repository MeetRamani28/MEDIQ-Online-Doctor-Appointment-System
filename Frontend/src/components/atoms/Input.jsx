import clsx from "clsx";

const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}

      <div
        className={clsx(
          "relative flex items-center rounded-xl border bg-white transition-all",
          "focus-within:ring-2 focus-within:ring-[#2C7BE5]/30",
          error
            ? "border-red-500 focus-within:ring-red-300"
            : "border-slate-300 focus-within:border-[#2C7BE5]",
          className
        )}
      >
        {leftIcon && (
          <span className="absolute left-4 text-slate-400">{leftIcon}</span>
        )}

        <input
          {...props}
          className={clsx(
            "w-full bg-transparent py-3 text-slate-900 placeholder:text-slate-400",
            "outline-none",
            leftIcon ? "pl-11" : "pl-4",
            rightIcon ? "pr-11" : "pr-4",
            "disabled:cursor-not-allowed disabled:bg-slate-100"
          )}
        />

        {rightIcon && (
          <span className="absolute right-4 text-slate-400">{rightIcon}</span>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
