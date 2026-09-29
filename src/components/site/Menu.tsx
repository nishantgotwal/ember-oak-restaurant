import { useMemo, useState } from "react";
import { Flame, Leaf, Plus, Minus, ShoppingBag, Sparkles, WheatOff, X, Sprout } from "lucide-react";
import { toast } from "sonner";
import dishesImg from "@/assets/dishes.jpg";
import { CATEGORIES, DISHES, cropStyle, type Dish, type Tag } from "@/lib/menu-data";

export type CartItem = { dish: Dish; qty: number; note: string; doneness?: string };

const FILTERS: { key: Tag; label: string; icon: typeof Leaf }[] = [
  { key: "chef", label: "Chef's Special", icon: Sparkles },
  { key: "veg", label: "Vegetarian", icon: Leaf },
  { key: "vegan", label: "Vegan", icon: Sprout },
  { key: "gf", label: "Gluten-Free", icon: WheatOff },
];

export function Menu({ onAdd }: { onAdd: (d: Dish) => void }) {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [filters, setFilters] = useState<Tag[]>([]);
  const [maxSpice, setMaxSpice] = useState(3);
  const list = useMemo(
    () => DISHES.filter((d) => d.cat === cat && filters.every((f) => d.tags.includes(f)) && d.spice <= maxSpice),
    [cat, filters, maxSpice],
  );

  return (
    <section id="menu" className="relative mx-auto max-w-7xl px-5 py-28">
      <div className="reveal text-center">
        <p className="eyebrow text-primary">The Carte</p>
        <h2 className="mt-4 font-serif text-4xl tracking-[0.08em] md:text-6xl"><span className="text-gold">Interactive Menu</span></h2>
        <p className="mt-4 font-script text-3xl text-champagne">curated nightly by our kitchen</p>
      </div>

      <div className="reveal mt-12 flex gap-2 overflow-x-auto pb-2 md:justify-center">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`eyebrow shrink-0 border px-5 py-3 transition-all duration-500 ${cat === c ? "border-primary bg-primary/10 text-primary shadow-gold" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-2">
        {FILTERS.map(({ key, label, icon: I }) => {
          const on = filters.includes(key);
          return (
            <button key={key} onClick={() => setFilters(on ? filters.filter((f) => f !== key) : [...filters, key])}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-wider transition ${on ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
              <I className="h-3.5 w-3.5" /> {label}
            </button>
          );
        })}
        <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-muted-foreground">
          <span className="tracking-wider">Spice ≤</span>
          {[0, 1, 2, 3].map((n) => (
            <button key={n} onClick={() => setMaxSpice(n)} aria-label={`Max spice ${n}`}
              className={`flex ${n <= maxSpice ? "text-primary" : "opacity-30"}`}>
              {n === 0 ? <span className="px-1">Mild</span> : <Flame className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => (
          <article key={d.id} className="group relative overflow-hidden border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/70 hover:shadow-gold animate-fade-in">
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-110" style={cropStyle(d.crop, dishesImg)} />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              {d.tags.includes("chef") && <span className="eyebrow glass absolute left-4 top-4 px-3 py-1.5 text-primary">Chef's Special</span>}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl">{d.name}</h3>
                <span className="font-serif text-xl text-primary">${d.price}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.notes}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {d.tags.filter((t) => t !== "chef").map((t) => <span key={t} className="border border-border px-2 py-1">{t === "gf" ? "GF" : t}</span>)}
                {d.spice > 0 && <span className="flex text-primary">{Array.from({ length: d.spice }).map((_, i) => <Flame key={i} className="h-3 w-3" />)}</span>}
              </div>
              {d.allergens.length > 0 && <p className="mt-3 text-xs text-muted-foreground/80">Allergens: {d.allergens.join(", ")}</p>}
              <button onClick={() => { onAdd(d); toast(`${d.name} added to your bag`); }}
                className="eyebrow mt-6 flex w-full items-center justify-center gap-2 border border-primary/50 py-3 text-primary transition hover:bg-primary hover:text-primary-foreground">
                <Plus className="h-4 w-4" /> Add to Bag
              </button>
            </div>
          </article>
        ))}
        {list.length === 0 && <p className="col-span-full py-16 text-center text-muted-foreground">No dishes match these filters — try loosening them.</p>}
      </div>
    </section>
  );
}

export function CartDrawer({ open, onClose, items, setItems }: { open: boolean; onClose: () => void; items: CartItem[]; setItems: (i: CartItem[]) => void }) {
  const [tip, setTip] = useState(18);
  const [done, setDone] = useState(false);
  const sub = items.reduce((s, i) => s + i.dish.price * i.qty, 0);
  const tax = sub * 0.0875;
  const tipAmt = (sub * tip) / 100;
  const upd = (id: string, patch: Partial<CartItem>) =>
    setItems(items.map((i) => (i.dish.id === id ? { ...i, ...patch } : i)).filter((i) => i.qty > 0));

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-card transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <p className="eyebrow text-primary">Takeaway</p>
            <h3 className="font-serif text-2xl tracking-widest">Your Bag</h3>
          </div>
          <button onClick={onClose} aria-label="Close bag"><X className="h-5 w-5" /></button>
        </div>
        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <Sparkles className="h-10 w-10 text-primary" />
            <h4 className="mt-4 font-serif text-2xl tracking-widest">Order Received</h4>
            <p className="mt-2 font-script text-3xl text-champagne">ready in 35 minutes</p>
            <button onClick={() => { setDone(false); setItems([]); onClose(); }} className="eyebrow mt-8 border border-primary px-6 py-3 text-primary">Close</button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
            <ShoppingBag className="h-10 w-10 text-primary/60" />
            <p className="mt-4">Your bag awaits its first course.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {items.map((i) => (
                <div key={i.dish.id} className="border-b border-border pb-5">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 shrink-0" style={cropStyle(i.dish.crop, dishesImg)} />
                    <div className="flex-1">
                      <div className="flex justify-between"><p className="font-display text-lg">{i.dish.name}</p><p className="text-primary">${i.dish.price * i.qty}</p></div>
                      <div className="mt-2 flex items-center gap-3">
                        <button onClick={() => upd(i.dish.id, { qty: i.qty - 1 })} className="border border-border p-1" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                        <span className="text-sm">{i.qty}</span>
                        <button onClick={() => upd(i.dish.id, { qty: i.qty + 1 })} className="border border-border p-1" aria-label="Increase"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                  {i.dish.cat === "Woodfire Grill" || i.dish.id === "m1" ? (
                    <select value={i.doneness ?? "Medium Rare"} onChange={(e) => upd(i.dish.id, { doneness: e.target.value })}
                      className="mt-3 w-full border border-border bg-background px-3 py-2 text-sm">
                      {["Rare", "Medium Rare", "Medium", "Medium Well"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : null}
                  <input value={i.note} onChange={(e) => upd(i.dish.id, { note: e.target.value })} placeholder="Special request (e.g. no capers)"
                    className="mt-3 w-full border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none" />
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-border p-6 text-sm">
              <p className="eyebrow text-muted-foreground">Gratuity</p>
              <div className="grid grid-cols-4 gap-2">
                {[0, 15, 18, 22].map((t) => (
                  <button key={t} onClick={() => setTip(t)} className={`border py-2 transition ${tip === t ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{t}%</button>
                ))}
              </div>
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tip</span><span>${tipAmt.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-border pt-3 font-serif text-xl"><span>Total</span><span className="text-gold">${(sub + tax + tipAmt).toFixed(2)}</span></div>
              <button onClick={() => setDone(true)} className="eyebrow bg-gold mt-2 w-full py-4 text-primary-foreground transition hover:opacity-90">Place Order</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
