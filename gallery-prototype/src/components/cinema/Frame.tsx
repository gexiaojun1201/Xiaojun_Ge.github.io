import type { Item } from "@/data/catalog";
import { Art } from "@/components/cinema/Art";

export function Frame({ item, alt = "" }: { item: Item; alt?: string }) {
  if (!item.image) {
    return (
      <div className="type-panel">
        {item.date ? <p>{item.date}</p> : null}
        <h3>{item.title}</h3>
        <p>{item.genres}</p>
      </div>
    );
  }
  return <Art src={item.image} focus={item.focus} alt={alt} />;
}
