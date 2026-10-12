import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Pause, Play, Plus } from "lucide-react";
import type { Row } from "@/data/catalog";
import { Frame } from "@/components/cinema/Frame";

const TRAVEL = 800;

function clock(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

function measureTone(src: string, focus: string): Promise<"ink" | "paper"> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = 48;
      const h = 27;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx || !img.naturalWidth) {
        resolve("paper");
        return;
      }
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const fy = focus.includes("%") ? Number.parseFloat(focus) / 100 : 0.5;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) * (Number.isFinite(fy) ? fy : 0.5), dw, dh);
      const y0 = Math.floor(h * 0.52);
      const data = ctx.getImageData(2, y0, Math.floor(w * 0.6), h - y0 - 1).data;
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) {
        sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      }
      resolve(sum / (data.length / 4) >= 78 ? "ink" : "paper");
    };
    img.onerror = () => resolve("paper");
    img.src = src;
  });
}

export function DetailStage({
  row,
  index,
  leaving,
  saved,
  progress,
  onIndex,
  onRequestClose,
  onToggleSave,
  onProgress,
}: {
  row: Row;
  index: number;
  leaving: boolean;
  saved: boolean;
  progress: number;
  onIndex: (index: number) => void;
  onRequestClose: () => void;
  onToggleSave: () => void;
  onProgress: (value: number) => void;
}) {
  const item = row.items[index] ?? row.items[0];
  const prevIndex = useRef(index);
  const first = useRef(true);
  const leavingRef = useRef(leaving);
  const navLock = useRef(false);
  const playRef = useRef(progress);
  const ptr = useRef<{ x: number; y: number } | null>(null);

  const [entered, setEntered] = useState(false);
  const [showChrome, setShowChrome] = useState(false);
  const [nudge, setNudge] = useState<0 | 1 | -1>(0);
  const [player, setPlayer] = useState<"off" | "in" | "out">("off");
  const [paused, setPaused] = useState(false);
  const [playhead, setPlayhead] = useState(progress);
  const [episode, setEpisode] = useState<string | null>(null);
  const [bright, setBright] = useState<number[]>([index]);
  const [tone, setTone] = useState<"ink" | "paper">("paper");
  const toneCache = useRef<Record<string, "ink" | "paper">>({});
  const progressRef = useRef(progress);
  const onProgressRef = useRef(onProgress);
  progressRef.current = progress;
  onProgressRef.current = onProgress;

  playRef.current = playhead;
  leavingRef.current = leaving;

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    const timer = window.setTimeout(() => {
      if (!navLock.current && !leavingRef.current) setShowChrome(true);
    }, 640);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (leaving) setShowChrome(false);
  }, [leaving]);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      prevIndex.current = index;
      return;
    }
    if (prevIndex.current === index) return;
    const from = prevIndex.current;
    prevIndex.current = index;
    navLock.current = true;
    setShowChrome(false);
    setPlayer("off");
    setEpisode(null);
    setPlayhead(progressRef.current);
    setBright([from, index]);
    const settleTimer = window.setTimeout(() => setBright([index]), TRAVEL);
    const chromeTimer = window.setTimeout(() => {
      navLock.current = false;
      if (!leavingRef.current) setShowChrome(true);
    }, TRAVEL + 380);
    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(chromeTimer);
    };
  }, [index]);

  useEffect(() => {
    const src = item.image;
    if (!src) {
      setTone("ink");
      return;
    }
    const known = toneCache.current[item.id];
    if (known) {
      setTone(known);
      return;
    }
    let live = true;
    measureTone(src, item.focus).then((next) => {
      if (!live) return;
      toneCache.current[item.id] = next;
      setTone(next);
    });
    return () => {
      live = false;
    };
  }, [item.id, item.image, item.focus]);

  useEffect(() => {
    setPlayhead(progressRef.current);
  }, [item.id]);

  useEffect(() => {
    if (player !== "in" || paused) return;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const step = (now - last) / 1000;
      last = now;
      setPlayhead((value) => Math.min(0.98, value + step / Math.max(item.seconds, 1)));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [player, paused, item.seconds]);

  useEffect(() => {
    if (!leaving) return;
    onProgressRef.current(playRef.current);
  }, [leaving]);

  function go(dir: 1 | -1) {
    if (leaving || player !== "off") return;
    const next = index + dir;
    if (next < 0 || next >= row.items.length) {
      setNudge(0);
      requestAnimationFrame(() => setNudge(dir));
      return;
    }
    onProgress(playRef.current);
    onIndex(next);
  }

  function openPlayer(name?: string) {
    if (item.variant === "event") {
      onToggleSave();
      return;
    }
    setEpisode(name ?? item.episodes?.[0]?.name ?? null);
    setPaused(false);
    setPlayer("in");
    setShowChrome(false);
  }

  function closePlayer() {
    onProgress(playRef.current);
    setPlayer("out");
    window.setTimeout(() => {
      setPlayer("off");
      if (!leavingRef.current && !navLock.current) setShowChrome(true);
    }, 220);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (player !== "off") closePlayer();
        else onRequestClose();
        return;
      }
      if (player !== "off") return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        openPlayer();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const playLabel = item.variant === "event" ? (saved ? "Reminder set" : "Set a reminder") : item.episodes ? "Play episode 1" : "Play";
  const chromeOn = showChrome && !leaving && player === "off";

  return (
    <div className={`detail${entered ? " is-in" : ""}${leaving ? " is-exit" : ""}`} role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="ambient">
        {item.image ? <img src={item.image} alt="" /> : null}
      </div>
      <div
        className="stage"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          ptr.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          if (!ptr.current || player !== "off") return;
          const dx = event.clientX - ptr.current.x;
          const dy = event.clientY - ptr.current.y;
          ptr.current = null;
          if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
          go(dx < 0 ? 1 : -1);
        }}
      >
        <div className={`shift${nudge === 1 ? " nudge-next" : ""}${nudge === -1 ? " nudge-prev" : ""}`}>
          <div className="reel" style={{ "--i": index } as React.CSSProperties}>
            {row.items.map((slide, slideIndex) => (
              <div key={slide.id} className={`slide-card${bright.includes(slideIndex) ? " is-bright" : ""}`}>
                <Frame item={slide} />
                <div className="slide-shade" />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={`nav-arrow prev${index === 0 ? " is-dim" : ""}`}
          aria-label="Previous"
          onClick={() => go(-1)}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className={`nav-arrow next${index === row.items.length - 1 ? " is-dim" : ""}`}
          aria-label="Next"
          onClick={() => go(1)}
        >
          <ChevronRight />
        </button>
      </div>

      <button type="button" className="back-btn" onClick={onRequestClose}>
        <ArrowLeft />
        Back
      </button>

      <div className={`chrome is-${tone}${chromeOn ? " is-on" : ""}`}>
        <div className="badge-row">
          {item.badge ? <span className="badge">{item.badge}</span> : null}
          <span className="counter">
            {index + 1} / {row.items.length}
          </span>
        </div>
        <div className="title-block">
          <div>
            <h2 className="hero-title">{item.title}</h2>
            <div className="service">
              <span className="mark">L</span>
              <span>{item.kindLabel}</span>
              <span>·</span>
              <span>{item.genres}</span>
              <span className="pill">{item.rating}</span>
            </div>
          </div>
          <p className="cast">
            <b>{item.creditLabel}</b>
            {item.cast}
          </p>
        </div>
        <p className="logline">{item.logline}</p>
        <div className="service">
          <span>{item.year}</span>
          <span>·</span>
          <span>{item.runtime}</span>
          <span className="pill">HD</span>
        </div>
        <div className="actions">
          <button type="button" className="play-btn" onClick={() => openPlayer()}>
            <Play />
            {playLabel}
          </button>
          {item.variant === "photo" ? (
            <button
              type="button"
              className="icon-btn"
              aria-label={saved ? "Remove from list" : "Add to list"}
              onClick={onToggleSave}
            >
              <span className={`swap${saved ? " is-saved" : ""}`}>
                <Plus />
                <Check />
              </span>
            </button>
          ) : null}
        </div>
        {item.episodes ? (
          <div className="episodes">
            {item.episodes.map((ep) => (
              <button key={ep.name} type="button" className="ep" onClick={() => openPlayer(ep.name)}>
                <span
                  className="ep-still"
                  style={
                    item.image
                      ? { backgroundImage: `url(${item.image})`, backgroundPosition: ep.focus }
                      : undefined
                  }
                />
                <span className="ep-name">{ep.name}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {player !== "off" ? (
        <div className={`player is-${tone}${player === "in" ? " is-in" : " is-out"}`}>
          {item.image ? (
            <img className="player-still" src={item.image} alt="" style={{ objectPosition: item.focus }} />
          ) : (
            <Frame item={item} />
          )}
          <div className="player-ui">
            <p className="player-title">{item.title}</p>
            <p className="player-sub">{episode ? `Now playing · ${episode}` : "Now playing"}</p>
            <div className="scrub">
              <span style={{ width: `${Math.round(playhead * 100)}%` }} />
            </div>
            <div className="player-row">
              <button type="button" className="icon-btn" aria-label={paused ? "Play" : "Pause"} onClick={() => setPaused((value) => !value)}>
                {paused ? <Play /> : <Pause />}
              </button>
              <span className="time">
                {clock(playhead * item.seconds)} / {clock(item.seconds)}
              </span>
              <button type="button" className="play-btn" onClick={closePlayer}>
                Back to details
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <p className="sr" aria-live="polite">
        {item.title}
      </p>
    </div>
  );
}
