import Image from "next/image";
import type { WPImage as WPImageType, WPImageNode } from "@/lib/types";

type Props = {
  image: WPImageType | WPImageNode;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

function isWPImageType(image: WPImageType | WPImageNode): image is WPImageType {
  return "node" in image;
}

export function WPImage({ image, className, fill, sizes, priority }: Props) {
  const node = isWPImageType(image) ? image.node : image;

  if (!node?.sourceUrl) return null;

  if (fill) {
    return (
      <Image
        src={node.sourceUrl}
        alt={node.altText ?? ""}
        fill
        className={className}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={node.sourceUrl}
      alt={node.altText ?? ""}
      width={node.width ?? 800}
      height={node.height ?? 600}
      className={className}
      priority={priority}
    />
  );
}
