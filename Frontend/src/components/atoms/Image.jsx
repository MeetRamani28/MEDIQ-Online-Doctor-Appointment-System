const Button = ({ name, click, className = "" }) => {
  return (
    <button
      onClick={click}
      className={`
        px-6 py-2 sm:px-8 sm:py-3 md:px-6 md:py-1 cursor-pointer 
        bg-white hover:bg-[#0097a7] hover:text-white 
        text-sm sm:text-base md:text-lg lg:text-xl 
        font-medium rounded-md 
        transition ease-in duration-200 
        active:bg-[#007c89] active:text-white 
        w-fit
        ${className}
      `}
    >
      {name}
    </button>
  );
};

export default Button;
