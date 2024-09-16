interface LoaderProps {
  sidebarWidth?: number;
  isSidebarOpen: boolean;
}

const Loader = ({ sidebarWidth = 250, isSidebarOpen }: LoaderProps) => {
  return (
    <div
      id="loader"
      style={{
        zIndex: 99,
        position: "fixed",
        top: 0,
        left: isSidebarOpen ? `${sidebarWidth}px` : "0px", // Si el sidebar está abierto, deja el espacio
        width: isSidebarOpen
          ? `calc(100% - ${sidebarWidth}px)` // Ajusta el ancho si el sidebar está abierto
          : "100%", // Ocupa toda la pantalla si el sidebar está cerrado
        height: "100%",
        background: "rgba(0, 0, 0, 0.95)", // Color de fondo negro muy oscuro
        backdropFilter: "blur(6px)", // Efecto de difuminado
        WebkitBackdropFilter: "blur(6px)", // Para navegadores basados en WebKit como Safari
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-pink-500"></div>
    </div>
  );
};

export default Loader;
