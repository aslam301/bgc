import Image from "next/image";

interface CommunityAvatarProps {
  src: string;
  alt: string;
  size?: number;
}

const CommunityAvatar = ({ src, alt, size = 80 }: CommunityAvatarProps) => {
  return (
    <div className="relative">
      {/* Decorative shapes */}
      <div
        className="absolute -top-3 -right-3 w-8 h-8 bg-sunny rotate-12 animate-float"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-grape rotate-45 animate-float"
        style={{ animationDelay: "2s" }}
      />

      {/* Main avatar */}
      <div
        className="relative bg-ink flex items-center justify-center shadow-[6px_6px_0_0_hsl(var(--coral))] overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt}
          width={size * 0.8}
          height={size * 0.8}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default CommunityAvatar;
