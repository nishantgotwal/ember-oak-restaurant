import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Menu, CartDrawer, type CartItem } from "@/components/site/Menu";
import { ReservationModal } from "@/components/site/Reservation";
import { Hero, ChefStory, Signatures, SocialProof, Visit, Footer } from "@/components/site/Sections";
import type { Dish } from "@/lib/menu-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ember & Oak — Artisanal Gastronomy & Woodfire Fine Dining" },
      { name: "description", content: "Award-winning woodfire fine dining in New York. Explore our tasting menu, order takeaway, and reserve your table at Ember & Oak." },
      { property: "og:title", content: "Ember & Oak — Woodfire Fine Dining" },
      { property: "og:description", content: "Artisanal gastronomy meets woodfire mastery. Voted Best Dining Experience 2026." },
    ],
  }),
  component: Index,
});

function Index() {
  const [resOpen, setResOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const add = (d: Dish) =>
    setCart((c) => (c.find((i) => i.dish.id === d.id) ? c.map((i) => (i.dish.id === d.id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { dish: d, qty: 1, note: "" }]));
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <main className="bg-background text-foreground">
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled ? "glass border-x-0 border-t-0 py-3" : "py-6"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          <a href="#" className="font-serif text-lg tracking-[0.3em]">EMBER <span className="text-primary">&</span> OAK</a>
          <nav className="eyebrow hidden gap-8 text-[10px] text-foreground/80 md:flex">
            <a href="#menu" className="story-link hover:text-primary">Menu</a>
            <a href="#story" className="story-link hover:text-primary">Story</a>
            <a href="#visit" className="story-link hover:text-primary">Visit</a>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setCartOpen(true)} className="relative p-2" aria-label="Open bag">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && <span className="bg-gold absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium text-primary-foreground">{count}</span>}
            </button>
            <button onClick={() => setResOpen(true)} className="eyebrow hidden border border-primary/60 px-5 py-2.5 text-[10px] text-primary transition hover:bg-primary hover:text-primary-foreground sm:block">Reserve</button>
          </div>
        </div>
      </header>

      <Hero onReserve={() => setResOpen(true)} />
      <Menu onAdd={add} />
      <Signatures onReserve={() => setResOpen(true)} />
      <ChefStory />
      <SocialProof />
      <Visit />
      <Footer />

      <ReservationModal open={resOpen} onClose={() => setResOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} setItems={setCart} />
    </main>
  );
}
