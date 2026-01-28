const Image = ({ image, className = "", alt = "Image" }) => {
  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default Image;
