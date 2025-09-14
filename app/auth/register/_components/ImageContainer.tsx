import Image from 'next/image';

export const ImageContainer = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 p-4">
      <div className="w-full h-[95vh] relative overflow-hidden rounded-2xl">
        <Image
          src="/user-auth-image.png"
          alt="Authentication"
          fill
          className="object-cover"
          priority
        />
        {/* Decorative elements overlay */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/20 rounded-full blur-lg"></div>
      </div>
    </div>
  );
};
