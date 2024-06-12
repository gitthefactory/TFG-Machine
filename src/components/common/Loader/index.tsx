const Loader = () => {
  return (
    <div id="loader" style={{ 
      zIndex: 9999,
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100%", 
      height: "100%", 
      background: "-webkit-radial-gradient(rgba(50, 50, 50, .9), rgba(50, 50, 50, .9))",
    }}>
      <div className="flex items-center justify-center h-screen">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent border-pink-500"></div>
      </div>
    </div>
  );
};

export default Loader;
