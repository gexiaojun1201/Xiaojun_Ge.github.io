import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Clapperboard } from "lucide-react";
import { buildRows, librarySeed, posterSources, type Row } from "@/data/catalog";
import { DetailStage } from "@/components/cinema/DetailStage";
import { Shelf } from "@/components/cinema/Shelf";

const STORE = "yinglang.library.v1";
const EXIT_MS = 620;

function useLibrary() {
  const [saved, setSaved] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>(librarySeed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const parsed = JSON.parse(raw) as { saved?: string[]; progress?: Record<string, number> };
        if (Array.isArray(parsed.saved)) setSaved(parsed.saved);
        if (parsed.progress && typeof parsed.progress === "object") {
          setProgress({ ...librarySeed, ...parsed.progress });
        }
      }
    } catch {
      /* keep the seeded shelf */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORE, JSON.stringify({ saved, progress }));
  }, [ready, saved, progress]);

  const toggle = useCallback((id: string) => {
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  const setProgressAt = useCallback((id: string, value: number) => {
    setProgress((current) => ({ ...current, [id]: Math.max(0, Math.min(0.98, value)) }));
  }, []);

  return { saved, progress, toggle, setProgressAt };
}

export function CinemaApp() {
  const { saved, progress, toggle, setProgressAt } = useLibrary();
  const rows = useMemo(() => buildRows(progress, saved), [progress, saved]);
  const mainRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<Row[]>(rows);
  rowsRef.current = rows;

  const [boot, setBoot] = useState<"on" | "out" | "off">("on");
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [cursor, setCursor] = useState({ row: 0, col: 0 });
  const [keyboard, setKeyboard] = useState(false);
  const [anchored, setAnchored] = useState(false);
  const [detail, setDetail] = useState<{ rowId: string; index: number } | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const snapshot = useRef<Row | null>(null);
  const closeTarget = useRef<{ rowId: string; index: number } | null>(null);

  useEffect(() => {
    const sources = posterSources();
    let done = 0;
    let cancelled = false;
    const started = performance.now();
    const finish = () => {
      if (cancelled) return;
      setLive(true);
      setBoot("out");
      window.setTimeout(() => setBoot("off"), 500);
    };
    const tick = () => {
      if (cancelled) return;
      const ratio = sources.length === 0 ? 1 : done / sources.length;
      setLoaded(ratio);
      const elapsed = performance.now() - started;
      if ((ratio >= 1 && elapsed > 680) || elapsed > 1800) finish();
      else if (ratio >= 1) window.setTimeout(tick, Math.max(0, 700 - elapsed));
    };
    sources.forEach((src) => {
      const img = new Image();
      const step = () => {
        done += 1;
        tick();
      };
      img.onload = step;
      img.onerror = step;
      img.src = src;
    });
    const cap = window.setTimeout(tick, 720);
    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    if (!detail) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [detail]);

  useEffect(() => {
    setCursor((current) => {
      const list = rowsRef.current;
      if (!list.length) return current;
      const row = Math.min(current.row, list.length - 1);
      const col = Math.min(current.col, list[row].items.length - 1);
      if (row === current.row && col === current.col) return current;
      return { row, col };
    });
  }, [rows]);

  useEffect(() => {
    if (detail) return;
    const row = rows[cursor.row];
    const item = row?.items[cursor.col];
    if (!row || !item || !keyboard) return;
    document.querySelector(`[data-spot="${row.id}:${item.id}"]`)?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [cursor, detail, keyboard, rows]);

  function alignShelf(rowId: string, index: number) {
    const row = rowsRef.current.find((item) => item.id === rowId) ?? snapshot.current;
    const spotItem = row?.items[index];
    if (!row || !spotItem) return null;
    const el = document.querySelector(`[data-spot="${row.id}:${spotItem.id}"]`) as HTMLElement | null;
    if (!el) return null;
    const scroller = el.closest(".scroller") as HTMLElement | null;
    if (scroller) {
      const elRect = el.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const scale = scroller.offsetWidth > 0 ? scrollerRect.width / scroller.offsetWidth : 1;
      const delta =
        (elRect.left + elRect.width / 2 - (scrollerRect.left + scrollerRect.width / 2)) / (scale || 1);
      scroller.scrollLeft += delta;
    }
    el.closest(".shelf-row")?.scrollIntoView({ block: "nearest", behavior: "auto" });
    return el;
  }

  function flyStageTo(spot: HTMLElement | null) {
    const stage = document.querySelector(".stage") as HTMLElement | null;
    if (!stage || !spot) return;
    const from = stage.getBoundingClientRect();
    const to = spot.getBoundingClientRect();
    if (from.width < 2 || to.width < 2) return;
    const box = (rect: DOMRect, opacity: number) => ({
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      right: "auto",
      bottom: "auto",
      borderRadius: opacity === 1 && rect === from ? "1.35rem" : "0.9rem",
      opacity,
    });
    stage.animate(
      [
        { ...box(from, 1), borderRadius: "1.35rem" },
        { ...box(to, 1), borderRadius: "0.9rem", offset: 0.84 },
        { ...box(to, 0), borderRadius: "0.9rem" },
      ],
      { duration: EXIT_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
    );
  }

  function openAt(rowIndex: number, col: number) {
    const row = rows[rowIndex];
    if (!row) return;
    snapshot.current = row;
    setAnchored(true);
    setCursor({ row: rowIndex, col });
    setDetail({ rowId: row.id, index: col });
    setLeaving(false);
  }

  function requestClose() {
    if (!detail || leaving) return;
    closeTarget.current = { rowId: detail.rowId, index: safeIndex };
    document.body.style.overflow = "";
    setLeaving(true);
    window.setTimeout(() => {
      setDetail(null);
      setLeaving(false);
    }, EXIT_MS);
  }

  useLayoutEffect(() => {
    if (!leaving) return;
    const target = closeTarget.current;
    if (!target) return;
    closeTarget.current = null;
    flyStageTo(alignShelf(target.rowId, target.index));
  }, [leaving]);

  function onShelfKey(event: React.KeyboardEvent) {
    if (detail) return;
    const list = rowsRef.current;
    const row = list[cursor.row];
    if (!row) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setKeyboard(true);
      setCursor((current) => ({ ...current, col: Math.min(row.items.length - 1, current.col + 1) }));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setKeyboard(true);
      setCursor((current) => ({ ...current, col: Math.max(0, current.col - 1) }));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setKeyboard(true);
      setCursor((current) => {
        const next = Math.min(list.length - 1, current.row + 1);
        return { row: next, col: Math.min(current.col, list[next].items.length - 1) };
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setKeyboard(true);
      setCursor((current) => {
        const next = Math.max(0, current.row - 1);
        return { row: next, col: Math.min(current.col, list[next].items.length - 1) };
      });
    } else if (event.key === "Enter") {
      event.preventDefault();
      openAt(cursor.row, cursor.col);
    }
  }

  const active = detail ? rows.find((row) => row.id === detail.rowId) ?? snapshot.current : null;
  if (detail && active) snapshot.current = active;
  const safeIndex = active && detail ? Math.min(detail.index, active.items.length - 1) : 0;
  const current = active?.items[safeIndex];

  function toggleSave() {
    if (!current) return;
    const next = !saved.includes(current.id);
    toggle(current.id);
    setToast(next ? `Added to your list · ${current.title}` : `Removed from your list · ${current.title}`);
    window.setTimeout(() => setToast(null), 1600);
  }

  return (
    <main
      ref={mainRef}
      tabIndex={-1}
      className={`app${live ? " is-live" : ""}${detail && !leaving ? " is-behind" : ""}${detail && !leaving ? " is-detail" : ""}${leaving ? " is-settling" : ""}`}
      onKeyDown={onShelfKey}
    >
      <header className="topbar">
        <h1 className="brand">
          <span className="brand-mark">
            <Clapperboard size={16} />
          </span>
          Lumen
        </h1>
        <p className="hint">Arrow keys · Enter to open · Left and right to switch · Esc to go back</p>
      </header>
      <Shelf rows={rows} focus={cursor} keyboard={keyboard} anchored={anchored} progress={progress} onOpen={openAt} />
      <div className={`scrim${detail && !leaving ? " on" : ""}`} />
      {detail && active && current ? (
        <DetailStage
          key={detail.rowId}
          row={active}
          index={safeIndex}
          leaving={leaving}
          saved={saved.includes(current.id)}
          progress={progress[current.id] ?? 0}
          onIndex={(next) => {
            const clamped = Math.max(0, Math.min(active.items.length - 1, next));
            setDetail({ rowId: active.id, index: clamped });
            const rowIndex = rows.findIndex((row) => row.id === active.id);
            if (rowIndex >= 0) setCursor({ row: rowIndex, col: clamped });
            alignShelf(active.id, clamped);
          }}
          onRequestClose={requestClose}
          onToggleSave={toggleSave}
          onProgress={(value) => setProgressAt(current.id, value)}
        />
      ) : null}
      <div className={`toast${toast ? " on" : ""}`} role="status">
        {toast}
      </div>
      {boot !== "off" ? (
        <div className={`boot${boot === "out" ? " is-out" : ""}`} aria-hidden={boot === "out"}>
          <div>
            <p className="boot-title">Lumen</p>
            <div className="boot-track">
              <div className="boot-fill" style={{ width: `${Math.round(loaded * 100)}%` }} />
            </div>
            <p className="boot-note">Laying out the pictures</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
