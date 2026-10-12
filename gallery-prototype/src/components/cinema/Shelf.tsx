import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Row } from "@/data/catalog";
import { Art } from "@/components/cinema/Art";

export function Shelf({
  rows,
  focus,
  keyboard,
  anchored,
  progress,
  onOpen,
}: {
  rows: Row[];
  focus: { row: number; col: number };
  keyboard: boolean;
  anchored: boolean;
  progress: Record<string, number>;
  onOpen: (row: number, col: number) => void;
}) {
  return (
    <div className="shelf-motion">
      {rows.map((row, rowIndex) => (
        <RowStrip
          key={row.id}
          row={row}
          rowIndex={rowIndex}
          focus={focus}
          keyboard={keyboard}
          anchored={anchored}
          progress={progress}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

function RowStrip({
  row,
  rowIndex,
  focus,
  keyboard,
  anchored,
  progress,
  onOpen,
}: {
  row: Row;
  rowIndex: number;
  focus: { row: number; col: number };
  keyboard: boolean;
  anchored: boolean;
  progress: Record<string, number>;
  onOpen: (row: number, col: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  function scrollByDir(dir: number) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.72, behavior: "smooth" });
  }

  return (
    <section className="shelf-row" aria-label={row.label}>
      <h2 className="row-label">{row.label}</h2>
      <button type="button" className="row-btn prev" aria-label="Scroll left" onClick={() => scrollByDir(-1)}>
        <ChevronLeft />
      </button>
      <div
        className="scroller"
        ref={scroller}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          drag.current = {
            down: true,
            x: event.clientX,
            left: scroller.current?.scrollLeft ?? 0,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current.down || !scroller.current) return;
          const dx = event.clientX - drag.current.x;
          if (Math.abs(dx) < 8) return;
          if (!drag.current.moved) {
            drag.current.moved = true;
            scroller.current.setPointerCapture(event.pointerId);
          }
          scroller.current.scrollLeft = drag.current.left - dx;
          scroller.current.classList.add("is-drag");
        }}
        onPointerUp={() => {
          drag.current.down = false;
          scroller.current?.classList.remove("is-drag");
        }}
        onPointerCancel={() => {
          drag.current.down = false;
        }}
      >
        {row.items.map((item, col) => {
          const marked = (keyboard || anchored) && focus.row === rowIndex && focus.col === col;
          const amount = progress[item.id];
          if (row.variant === "event") {
            return (
              <button
                key={item.id}
                type="button"
                data-spot={`${row.id}:${item.id}`}
                className={`event-card${marked ? " is-focus is-return" : ""}`}
                aria-label={item.title}
                onClick={() => {
                  if (drag.current.moved) {
                    drag.current.moved = false;
                    return;
                  }
                  onOpen(rowIndex, col);
                }}
              >
                {item.image ? <Art src={item.image} focus={item.focus} alt="" /> : null}
                <span className="event-copy">
                  {item.date ? <p className="event-date">{item.date}</p> : null}
                  <p className="event-title">{item.title}</p>
                  <p className="event-sub">{item.genres}</p>
                </span>
              </button>
            );
          }
          const shape = row.variant === "ranked" ? "ranked" : row.variant === "landscape" ? "land" : "";
          return (
            <button
              key={item.id}
              type="button"
              data-spot={`${row.id}:${item.id}`}
              className={`poster-card ${shape}${marked ? " is-focus is-return" : ""}`}
              aria-label={item.title}
              onClick={() => {
                if (drag.current.moved) {
                  drag.current.moved = false;
                  return;
                }
                onOpen(rowIndex, col);
              }}
            >
              <Art src={item.image} focus={item.focus} alt="" />
              {row.variant === "ranked" ? <span className="rank">{col + 1}</span> : null}
              <span className="poster-copy">
                <span className="poster-title">{item.title}</span>
                <span className="poster-genre">{item.genres}</span>
              </span>
              {row.variant === "landscape" && amount ? (
                <span className="watch-bar">
                  <span style={{ width: `${Math.round(amount * 100)}%` }} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <button type="button" className="row-btn next" aria-label="Scroll right" onClick={() => scrollByDir(1)}>
        <ChevronRight />
      </button>
    </section>
  );
}
