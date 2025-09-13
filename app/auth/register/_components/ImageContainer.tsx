export const ImageContainer = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 p-4">
      <div className="w-full h-[95vh] bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 relative overflow-hidden rounded-2xl">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/30 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-white/40 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
