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
        left: isSidebarOpen ? `${sidebarWidth}px` : "0px",
        width: isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-yellow-400"></div>
    </div>
  );
};


export default Loader;
