import Image from "next/image";

interface PhotoGridProps {
  photos: {
    src: string;
    alt: string;
  }[];
}

const PhotoGrid = ({ photos }: PhotoGridProps) => {
  return (
    <div className="grid grid-cols-4 gap-1">
      {photos.map((photo, index) => (
        <div
          key={index}
          className="aspect-square bg-muted overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={200}
            height={200}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
