import { useCallback, useState } from "react";

export function Art({
  src,
  focus = "center",
  alt,
}: {
  src?: string;
  focus?: string;
  alt: string;
}) {
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const ref = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) setPhase("ready");
  }, []);

  if (!src) return <div className="art is-error" />;

  return (
    <div className={`art is-${phase}`}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        draggable={false}
        style={{ objectPosition: focus }}
        onLoad={() => setPhase("ready")}
        onError={() => setPhase("error")}
      />
    </div>
  );
}
