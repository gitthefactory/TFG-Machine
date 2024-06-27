const Loader = () => {
  return (
    <div id="loader" style={{ 
      zIndex: 9999,
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100%", 
      height: "100%", 
      background: "rgba(0, 0, 0, 0.95)", // Color de fondo negro muy oscuro
      backdropFilter: "blur(6px)", // Efecto de difuminado
      WebkitBackdropFilter: "blur(6px)", // Para navegadores basados en WebKit como Safari
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-pink-500"></div>
    </div>
  );
};

export default Loader;
