import clsx from "clsx";

const Button = ({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "bg-[#2C7BE5] hover:bg-[#1A5FCC] text-white focus:ring-[#2C7BE5]/40",
    secondary:
      "bg-[#00B894] hover:bg-[#009E7A] text-white focus:ring-[#00B894]/40",
    outline:
      "border border-slate-300 text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl",
        "font-semibold transition-all duration-200",
        "focus:outline-none focus:ring-2",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {loading && (
        <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
