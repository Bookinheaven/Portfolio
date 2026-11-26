import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * SmoothImage renders a subtle shimmer placeholder until the image finishes decoding,
 * then fades and unblurs smoothly into view.
 */
function SmoothImage({
  src,
  alt,
  className,
  wrapperClassName,
  loading = "lazy",
  decoding = "async",
  draggable = false,
  ...props
}) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const isLoaded = loadedSrc === src;

  const imgRef = useCallback(
    (node) => {
      if (node && node.complete && node.naturalWidth > 0) {
        setLoadedSrc(src);
      }
    },
    [src]
  );

  return (
    <div className={cn("relative overflow-hidden bg-muted/40", wrapperClassName)}>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/60 to-muted/30 animate-pulse"
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        draggable={draggable}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setLoadedSrc(src)}
        className={cn(
          "transition-all duration-500 ease-out will-change-[opacity,transform]",
          isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.015] blur-[3px]",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { SmoothImage };
